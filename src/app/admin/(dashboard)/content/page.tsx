"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CloudinaryUploader } from "@/components/cms/CloudinaryUploader";
import { toast } from "sonner";
import {
  Clapperboard,
  Repeat,
  Users,
  Grid3x3,
  GitBranch,
  Quote,
  HelpCircle,
  Send,
  RotateCcw,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
  type LucideIcon,
} from "lucide-react";

// ─── Types (inline — avoids server-only import issues) ────────────────────────

interface HeroContent {
  label: string;
  headlineLine1: string;
  cyclePhrases: string[];
  subtitle: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary: { text: string; href: string };
  videoUrl: string;
  posterUrl: string;
}
interface AboutContent {
  label: string;
  headingLine1: string;
  headingLine2: string;
  headingHighlight: string;
  headingLine4: string;
  body: string;
  stats: { value: number; suffix: string; label: string }[];
}
interface ServiceItem {
  number: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
}
interface ServicesContent {
  label: string;
  headingLine1: string;
  headingHighlight: string;
  subheading: string;
  items: ServiceItem[];
}
interface ProcessStep {
  number: string;
  title: string;
  description: string;
}
interface ProcessContent {
  label: string;
  heading: string;
  steps: ProcessStep[];
}
interface TestimonialItem {
  text: string;
  image: string;
  name: string;
  role: string;
}
interface TestimonialsContent {
  label: string;
  heading: string;
  headingHighlight: string;
  headingLine2: string;
  subheading: string;
  items: TestimonialItem[];
}
interface FAQItem {
  question: string;
  answer: string;
}
interface FAQContent {
  heading: string;
  headingHighlight: string;
  items: FAQItem[];
}
interface CTAContent {
  label: string;
  headingLine1: string;
  headingLine2: string;
  subtext: string;
  email: string;
  phone: string;
  location: string;
  satisfactionScore: string;
  satisfactionLabel: string;
  ctaButtonText: string;
  videoUrl: string;
}
interface MarqueeContent {
  row1: string;
  row2: string;
}
interface CMSContent {
  global: {
    siteName: string;
    tagline: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    social: { instagram: string; linkedin: string; youtube: string };
  };
  home: {
    hero: HeroContent;
    marquee: MarqueeContent;
    about: AboutContent;
    services: ServicesContent;
    process: ProcessContent;
    testimonials: TestimonialsContent;
    faq: FAQContent;
    cta: CTAContent;
  };
  about: { hero: { heading: string; label: string } };
  contact: { hero: { heading: string; label: string } };
}

// ─── Default content ──────────────────────────────────────────────────────────

const defaultContent: CMSContent = {
  global: {
    siteName: "Movico",
    tagline: "Corporate Video Production",
    email: "hello@movico.sa",
    phone: "+966 XX XXX XXXX",
    whatsapp: "+966XXXXXXXXX",
    address: "Riyadh, Saudi Arabia",
    social: { instagram: "", linkedin: "", youtube: "" },
  },
  home: {
    hero: {
      label: "Award-Winning Production",
      headlineLine1: "We craft stories that",
      cyclePhrases: ["inspire", "captivate", "convert", "resonate"],
      subtitle: "Riyadh's leading corporate video production company.",
      ctaPrimary: { text: "View Our Work", href: "/projects" },
      ctaSecondary: { text: "Get In Touch", href: "/contact" },
      videoUrl: "",
      posterUrl: "/hero-poster.jpg",
    },
    marquee: {
      row1: "Brand Films · Event Coverage · Corporate Videos · Media Production",
      row2: "Saudi Arabia · GCC · Riyadh · Cinematic Production",
    },
    about: {
      label: "About Movico",
      headingLine1: "We are a",
      headingLine2: "creative studio",
      headingHighlight: "obsessed",
      headingLine4: "with storytelling",
      body: "Movico is a full-service corporate video production company based in Riyadh.",
      stats: [
        { value: 150, suffix: "+", label: "Projects" },
        { value: 50, suffix: "+", label: "Clients" },
        { value: 8, suffix: "", label: "Years" },
      ],
    },
    services: {
      label: "What We Do",
      headingLine1: "Full-service",
      headingHighlight: "production",
      subheading: "From concept to delivery, we handle everything.",
      items: [],
    },
    process: {
      label: "How We Work",
      heading: "Our Process",
      steps: [
        { number: "01", title: "Discovery", description: "We learn about your brand and goals." },
        { number: "02", title: "Pre-Production", description: "Script, storyboard, and planning." },
        { number: "03", title: "Production", description: "Filming with professional crew." },
        { number: "04", title: "Post-Production", description: "Edit, color grade, and sound design." },
      ],
    },
    testimonials: {
      label: "Client Stories",
      heading: "What our",
      headingHighlight: "clients",
      headingLine2: "say about us",
      subheading: "Real results from real partnerships.",
      items: [],
    },
    faq: {
      heading: "Frequently",
      headingHighlight: "Asked",
      items: [],
    },
    cta: {
      label: "Start Your Project",
      headingLine1: "Ready to create",
      headingLine2: "something remarkable?",
      subtext: "Let's bring your vision to life.",
      email: "hello@movico.sa",
      phone: "+966 XX XXX XXXX",
      location: "Riyadh, KSA",
      satisfactionScore: "100%",
      satisfactionLabel: "Client Satisfaction",
      ctaButtonText: "Start a Project",
      videoUrl: "",
    },
  },
  about: { hero: { heading: "About Movico", label: "Our Story" } },
  contact: { hero: { heading: "Get In Touch", label: "Contact" } },
};

// ─── Section definitions ──────────────────────────────────────────────────────

type SectionId = "hero" | "marquee" | "about" | "services" | "process" | "testimonials" | "faq" | "cta";

const sectionDefs: {
  id: SectionId;
  label: string;
  description: string;
  Icon: LucideIcon;
}[] = [
  { id: "hero", label: "Hero", description: "Headline, video, CTA", Icon: Clapperboard },
  { id: "marquee", label: "Marquee", description: "Ticker text", Icon: Repeat },
  { id: "about", label: "About", description: "Heading, stats", Icon: Users },
  { id: "services", label: "Services", description: "Service cards", Icon: Grid3x3 },
  { id: "process", label: "Process", description: "Workflow steps", Icon: GitBranch },
  { id: "testimonials", label: "Testimonials", description: "Client reviews", Icon: Quote },
  { id: "faq", label: "FAQ", description: "Questions", Icon: HelpCircle },
  { id: "cta", label: "CTA", description: "Contact form copy", Icon: Send },
];

const sectionAnchors: Record<SectionId, string> = {
  hero: "/",
  marquee: "/",
  about: "/#about",
  services: "/#services",
  process: "/#process",
  testimonials: "/#testimonials",
  faq: "/#faq",
  cta: "/#contact",
};

// ─── Shared style constants ───────────────────────────────────────────────────

const inputCls =
  "bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm w-full focus:border-[#d98629]/50 focus:outline-none placeholder:text-slate-400 transition-colors duration-150";

const textareaCls =
  "bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm w-full focus:border-[#d98629]/50 focus:outline-none placeholder:text-slate-400 transition-colors duration-150 resize-none";

const labelCls = "text-[10px] uppercase tracking-[0.12em] text-slate-400 mb-1.5 block";

const addBtnCls =
  "bg-white/[0.04] border border-slate-200 text-slate-500 text-xs rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-700 w-full mt-2 transition-all flex items-center justify-center gap-2";

const deleteBtnCls =
  "text-slate-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-400/10";

const tagChipCls =
  "flex items-center gap-1 bg-[#d98629]/15 text-[#d98629] text-[11px] px-2.5 py-1 rounded-full border border-[#d98629]/25";

const dividerCls = "h-px bg-white/[0.05] my-5";

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

// ─── Tag input ────────────────────────────────────────────────────────────────

function TagInput({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");

  function addTag() {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setInput("");
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {values.map((tag, i) => (
          <span key={i} className={tagChipCls}>
            {tag}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="text-[#d98629]/60 hover:text-[#d98629] transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
          }
        }}
        placeholder="Type and press Enter to add…"
        className={inputCls}
      />
    </div>
  );
}

// ─── Section Editors ──────────────────────────────────────────────────────────

function HeroEditor({
  data,
  update,
}: {
  data: HeroContent;
  update: (path: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Label">
        <input className={inputCls} value={data.label} onChange={(e) => update("home.hero.label", e.target.value)} />
      </Field>
      <Field label="Headline">
        <input className={inputCls} value={data.headlineLine1} onChange={(e) => update("home.hero.headlineLine1", e.target.value)} />
      </Field>
      <div className={dividerCls} />
      <Field label="Cycling Phrases">
        <TagInput values={data.cyclePhrases} onChange={(v) => update("home.hero.cyclePhrases", v)} />
      </Field>
      <div className={dividerCls} />
      <Field label="Subtitle">
        <textarea className={textareaCls} rows={3} value={data.subtitle} onChange={(e) => update("home.hero.subtitle", e.target.value)} />
      </Field>
      <div className={dividerCls} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="CTA Primary Text">
          <input className={inputCls} value={data.ctaPrimary.text} onChange={(e) => update("home.hero.ctaPrimary.text", e.target.value)} />
        </Field>
        <Field label="CTA Primary URL">
          <input className={inputCls} value={data.ctaPrimary.href} onChange={(e) => update("home.hero.ctaPrimary.href", e.target.value)} />
        </Field>
        <Field label="CTA Secondary Text">
          <input className={inputCls} value={data.ctaSecondary.text} onChange={(e) => update("home.hero.ctaSecondary.text", e.target.value)} />
        </Field>
        <Field label="CTA Secondary URL">
          <input className={inputCls} value={data.ctaSecondary.href} onChange={(e) => update("home.hero.ctaSecondary.href", e.target.value)} />
        </Field>
      </div>
      <div className={dividerCls} />
      <CloudinaryUploader
        resourceType="video"
        folder="movico/videos"
        label="Hero Video"
        currentUrl={data.videoUrl}
        onUpload={({ url }) => update("home.hero.videoUrl", url)}
      />
      {data.videoUrl && (
        <p className="text-[10px] text-slate-400 font-mono truncate mt-1" title={data.videoUrl}>{data.videoUrl}</p>
      )}
      <div className={dividerCls} />
      <CloudinaryUploader
        resourceType="image"
        folder="movico/thumbnails"
        label="Hero Poster (fallback image)"
        currentUrl={data.posterUrl}
        onUpload={({ url }) => update("home.hero.posterUrl", url)}
      />
      {data.posterUrl && (
        <p className="text-[10px] text-slate-400 font-mono truncate mt-1" title={data.posterUrl}>{data.posterUrl}</p>
      )}
    </div>
  );
}

function MarqueeEditor({
  data,
  update,
}: {
  data: MarqueeContent;
  update: (path: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Row 1 — Large ticker text">
        <input className={inputCls} value={data.row1} onChange={(e) => update("home.marquee.row1", e.target.value)} />
      </Field>
      <Field label="Row 2 — Smaller subtitle ticker">
        <input className={inputCls} value={data.row2} onChange={(e) => update("home.marquee.row2", e.target.value)} />
      </Field>
    </div>
  );
}

function AboutEditor({
  data,
  update,
}: {
  data: AboutContent;
  update: (path: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Label — Section eyebrow">
        <input className={inputCls} value={data.label} onChange={(e) => update("home.about.label", e.target.value)} />
      </Field>
      <div className={dividerCls} />
      <Field label="Heading Line 1">
        <input className={inputCls} value={data.headingLine1} onChange={(e) => update("home.about.headingLine1", e.target.value)} />
      </Field>
      <Field label="Heading Line 2">
        <input className={inputCls} value={data.headingLine2} onChange={(e) => update("home.about.headingLine2", e.target.value)} />
      </Field>
      <Field label="Highlighted text — Renders in amber color">
        <input className={inputCls} value={data.headingHighlight} onChange={(e) => update("home.about.headingHighlight", e.target.value)} />
      </Field>
      <Field label="Heading Line 4">
        <input className={inputCls} value={data.headingLine4} onChange={(e) => update("home.about.headingLine4", e.target.value)} />
      </Field>
      <div className={dividerCls} />
      <Field label="Body Text">
        <textarea className={textareaCls} rows={4} value={data.body} onChange={(e) => update("home.about.body", e.target.value)} />
      </Field>
      <div className={dividerCls} />
      <div>
        <label className={labelCls}>Stats</label>
        <div className="space-y-2">
          {data.stats.map((stat, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="number"
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm w-24 focus:border-[#d98629]/50 focus:outline-none transition-colors duration-150"
                value={stat.value}
                onChange={(e) => {
                  const next = [...data.stats];
                  next[i] = { ...next[i], value: Number(e.target.value) };
                  update("home.about.stats", next);
                }}
                placeholder="Value"
              />
              <input
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm w-16 focus:border-[#d98629]/50 focus:outline-none transition-colors duration-150"
                value={stat.suffix}
                onChange={(e) => {
                  const next = [...data.stats];
                  next[i] = { ...next[i], suffix: e.target.value };
                  update("home.about.stats", next);
                }}
                placeholder="+"
              />
              <input
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm flex-1 focus:border-[#d98629]/50 focus:outline-none transition-colors duration-150"
                value={stat.label}
                onChange={(e) => {
                  const next = [...data.stats];
                  next[i] = { ...next[i], label: e.target.value };
                  update("home.about.stats", next);
                }}
                placeholder="Label"
              />
              <button
                type="button"
                onClick={() => update("home.about.stats", data.stats.filter((_, idx) => idx !== i))}
                className={deleteBtnCls}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => update("home.about.stats", [...data.stats, { value: 0, suffix: "", label: "" }])}
          className={addBtnCls}
        >
          <Plus size={12} /> Add Stat
        </button>
      </div>
    </div>
  );
}

function ServicesEditor({
  data,
  update,
}: {
  data: ServicesContent;
  update: (path: string, value: unknown) => void;
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <Field label="Label">
        <input className={inputCls} value={data.label} onChange={(e) => update("home.services.label", e.target.value)} />
      </Field>
      <Field label="Heading Line 1">
        <input className={inputCls} value={data.headingLine1} onChange={(e) => update("home.services.headingLine1", e.target.value)} />
      </Field>
      <Field label="Heading Highlight">
        <input className={inputCls} value={data.headingHighlight} onChange={(e) => update("home.services.headingHighlight", e.target.value)} />
      </Field>
      <Field label="Subheading">
        <textarea className={textareaCls} rows={2} value={data.subheading} onChange={(e) => update("home.services.subheading", e.target.value)} />
      </Field>
      <div className={dividerCls} />
      <div>
        <label className={labelCls}>Services</label>
        <div className="space-y-1.5">
          {data.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-100 transition-colors text-left"
              >
                <span className="text-[10px] text-[#d98629]/70 font-mono w-6 shrink-0">{item.number}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-xs font-medium truncate">{item.title || "Untitled"}</p>
                  <p className="text-slate-400 text-[10px] truncate">{item.description}</p>
                </div>
                {expandedIdx === i ? (
                  <ChevronDown size={12} className="text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight size={12} className="text-slate-400 shrink-0" />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    update("home.services.items", data.items.filter((_, idx) => idx !== i));
                    if (expandedIdx === i) setExpandedIdx(null);
                  }}
                  className={deleteBtnCls}
                >
                  <Trash2 size={11} />
                </button>
              </button>
              {expandedIdx === i && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-200 space-y-3 bg-white/[0.01]">
                  <Field label="Title">
                    <input
                      className={inputCls}
                      value={item.title}
                      onChange={(e) => {
                        const next = [...data.items];
                        next[i] = { ...next[i], title: e.target.value };
                        update("home.services.items", next);
                      }}
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={item.description}
                      onChange={(e) => {
                        const next = [...data.items];
                        next[i] = { ...next[i], description: e.target.value };
                        update("home.services.items", next);
                      }}
                    />
                  </Field>
                  <Field label="Tags">
                    <TagInput
                      values={item.tags}
                      onChange={(tags) => {
                        const next = [...data.items];
                        next[i] = { ...next[i], tags };
                        update("home.services.items", next);
                      }}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Href">
                      <input
                        className={inputCls}
                        value={item.href}
                        onChange={(e) => {
                          const next = [...data.items];
                          next[i] = { ...next[i], href: e.target.value };
                          update("home.services.items", next);
                        }}
                      />
                    </Field>
                    <Field label="Icon name (Lucide)">
                      <input
                        className={inputCls}
                        value={item.icon}
                        onChange={(e) => {
                          const next = [...data.items];
                          next[i] = { ...next[i], icon: e.target.value };
                          update("home.services.items", next);
                        }}
                        placeholder="e.g. Film"
                      />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            const next = [
              ...data.items,
              {
                number: String(data.items.length + 1).padStart(2, "0"),
                icon: "Film",
                title: "New Service",
                description: "",
                tags: [],
                href: "/services",
              },
            ];
            update("home.services.items", next);
            setExpandedIdx(next.length - 1);
          }}
          className={addBtnCls}
        >
          <Plus size={12} /> Add Service
        </button>
      </div>
    </div>
  );
}

function ProcessEditor({
  data,
  update,
}: {
  data: ProcessContent;
  update: (path: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Label">
        <input className={inputCls} value={data.label} onChange={(e) => update("home.process.label", e.target.value)} />
      </Field>
      <Field label="Heading">
        <input className={inputCls} value={data.heading} onChange={(e) => update("home.process.heading", e.target.value)} />
      </Field>
      <div className={dividerCls} />
      <div>
        <label className={labelCls}>Steps</label>
        <div className="space-y-3">
          {data.steps.map((step, i) => (
            <div key={i} className="bg-white/[0.02] border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[#d98629]/60 text-xs font-mono w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <input
                  className={inputCls + " flex-1"}
                  value={step.title}
                  onChange={(e) => {
                    const next = [...data.steps];
                    next[i] = { ...next[i], title: e.target.value };
                    update("home.process.steps", next);
                  }}
                  placeholder="Step title"
                />
                <button
                  type="button"
                  onClick={() => update("home.process.steps", data.steps.filter((_, idx) => idx !== i))}
                  className={deleteBtnCls}
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <textarea
                className={textareaCls}
                rows={2}
                value={step.description}
                onChange={(e) => {
                  const next = [...data.steps];
                  next[i] = { ...next[i], description: e.target.value };
                  update("home.process.steps", next);
                }}
                placeholder="Step description"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            update("home.process.steps", [
              ...data.steps,
              { number: String(data.steps.length + 1).padStart(2, "0"), title: "", description: "" },
            ])
          }
          className={addBtnCls}
        >
          <Plus size={12} /> Add Step
        </button>
      </div>
    </div>
  );
}

function TestimonialsEditor({
  data,
  update,
}: {
  data: TestimonialsContent;
  update: (path: string, value: unknown) => void;
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <Field label="Label">
        <input className={inputCls} value={data.label} onChange={(e) => update("home.testimonials.label", e.target.value)} />
      </Field>
      <Field label="Heading">
        <input className={inputCls} value={data.heading} onChange={(e) => update("home.testimonials.heading", e.target.value)} />
      </Field>
      <Field label="Heading Highlight">
        <input className={inputCls} value={data.headingHighlight} onChange={(e) => update("home.testimonials.headingHighlight", e.target.value)} />
      </Field>
      <Field label="Heading Line 2">
        <input className={inputCls} value={data.headingLine2} onChange={(e) => update("home.testimonials.headingLine2", e.target.value)} />
      </Field>
      <Field label="Subheading">
        <input className={inputCls} value={data.subheading} onChange={(e) => update("home.testimonials.subheading", e.target.value)} />
      </Field>
      <div className={dividerCls} />
      <div>
        <label className={labelCls}>Testimonials</label>
        <div className="space-y-1.5">
          {data.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 shrink-0 flex items-center justify-center text-[10px] text-slate-500">
                  {item.name ? item.name[0].toUpperCase() : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-xs font-medium">{item.name || "Unnamed"}</p>
                  <p className="text-slate-400 text-[10px]">{item.role}</p>
                </div>
                {expandedIdx === i ? (
                  <ChevronDown size={12} className="text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight size={12} className="text-slate-400 shrink-0" />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    update("home.testimonials.items", data.items.filter((_, idx) => idx !== i));
                    if (expandedIdx === i) setExpandedIdx(null);
                  }}
                  className={deleteBtnCls}
                >
                  <Trash2 size={11} />
                </button>
              </button>
              {expandedIdx === i && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-200 space-y-3 bg-white/[0.01]">
                  <Field label="Testimonial Text">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={item.text}
                      onChange={(e) => {
                        const next = [...data.items];
                        next[i] = { ...next[i], text: e.target.value };
                        update("home.testimonials.items", next);
                      }}
                    />
                  </Field>
                  <CloudinaryUploader
                    resourceType="image"
                    folder="movico/testimonials"
                    label="Photo"
                    currentUrl={item.image}
                    onUpload={({ url }) => {
                      const next = [...data.items];
                      next[i] = { ...next[i], image: url };
                      update("home.testimonials.items", next);
                    }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Name">
                      <input
                        className={inputCls}
                        value={item.name}
                        onChange={(e) => {
                          const next = [...data.items];
                          next[i] = { ...next[i], name: e.target.value };
                          update("home.testimonials.items", next);
                        }}
                      />
                    </Field>
                    <Field label="Role">
                      <input
                        className={inputCls}
                        value={item.role}
                        onChange={(e) => {
                          const next = [...data.items];
                          next[i] = { ...next[i], role: e.target.value };
                          update("home.testimonials.items", next);
                        }}
                      />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            const next = [...data.items, { text: "", image: "", name: "", role: "" }];
            update("home.testimonials.items", next);
            setExpandedIdx(next.length - 1);
          }}
          className={addBtnCls}
        >
          <Plus size={12} /> Add Testimonial
        </button>
      </div>
    </div>
  );
}

function FAQEditor({
  data,
  update,
}: {
  data: FAQContent;
  update: (path: string, value: unknown) => void;
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <Field label="Heading">
        <input className={inputCls} value={data.heading} onChange={(e) => update("home.faq.heading", e.target.value)} />
      </Field>
      <Field label="Heading Highlight">
        <input className={inputCls} value={data.headingHighlight} onChange={(e) => update("home.faq.headingHighlight", e.target.value)} />
      </Field>
      <div className={dividerCls} />
      <div>
        <label className={labelCls}>FAQ Items</label>
        <div className="space-y-1.5">
          {data.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-100 transition-colors text-left"
              >
                <p className="flex-1 text-slate-700 text-xs truncate">{item.question || "Untitled question"}</p>
                {expandedIdx === i ? (
                  <ChevronDown size={12} className="text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight size={12} className="text-slate-400 shrink-0" />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    update("home.faq.items", data.items.filter((_, idx) => idx !== i));
                    if (expandedIdx === i) setExpandedIdx(null);
                  }}
                  className={deleteBtnCls}
                >
                  <Trash2 size={11} />
                </button>
              </button>
              {expandedIdx === i && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-200 space-y-3 bg-white/[0.01]">
                  <Field label="Question">
                    <input
                      className={inputCls}
                      value={item.question}
                      onChange={(e) => {
                        const next = [...data.items];
                        next[i] = { ...next[i], question: e.target.value };
                        update("home.faq.items", next);
                      }}
                    />
                  </Field>
                  <Field label="Answer">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={item.answer}
                      onChange={(e) => {
                        const next = [...data.items];
                        next[i] = { ...next[i], answer: e.target.value };
                        update("home.faq.items", next);
                      }}
                    />
                  </Field>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            const next = [...data.items, { question: "", answer: "" }];
            update("home.faq.items", next);
            setExpandedIdx(next.length - 1);
          }}
          className={addBtnCls}
        >
          <Plus size={12} /> Add FAQ
        </button>
      </div>
    </div>
  );
}

function CTAEditor({
  data,
  update,
}: {
  data: CTAContent;
  update: (path: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Label">
        <input className={inputCls} value={data.label} onChange={(e) => update("home.cta.label", e.target.value)} />
      </Field>
      <div className={dividerCls} />
      <Field label="Heading Line 1">
        <input className={inputCls} value={data.headingLine1} onChange={(e) => update("home.cta.headingLine1", e.target.value)} />
      </Field>
      <Field label="Heading Line 2">
        <input className={inputCls} value={data.headingLine2} onChange={(e) => update("home.cta.headingLine2", e.target.value)} />
      </Field>
      <Field label="Subtext">
        <textarea className={textareaCls} rows={3} value={data.subtext} onChange={(e) => update("home.cta.subtext", e.target.value)} />
      </Field>
      <div className={dividerCls} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email">
          <input className={inputCls} value={data.email} onChange={(e) => update("home.cta.email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className={inputCls} value={data.phone} onChange={(e) => update("home.cta.phone", e.target.value)} />
        </Field>
      </div>
      <Field label="Location">
        <input className={inputCls} value={data.location} onChange={(e) => update("home.cta.location", e.target.value)} />
      </Field>
      <div className={dividerCls} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Satisfaction Score">
          <input className={inputCls} value={data.satisfactionScore} onChange={(e) => update("home.cta.satisfactionScore", e.target.value)} />
        </Field>
        <Field label="Satisfaction Label">
          <input className={inputCls} value={data.satisfactionLabel} onChange={(e) => update("home.cta.satisfactionLabel", e.target.value)} />
        </Field>
      </div>
      <div className={dividerCls} />
      <Field label="CTA Button Text">
        <input className={inputCls} value={data.ctaButtonText} onChange={(e) => update("home.cta.ctaButtonText", e.target.value)} />
      </Field>
      <CloudinaryUploader
        resourceType="video"
        folder="movico/videos"
        label="Background Video"
        currentUrl={data.videoUrl}
        onUpload={({ url }) => update("home.cta.videoUrl", url)}
      />
      {data.videoUrl && (
        <p className="text-[10px] text-slate-400 font-mono truncate mt-1" title={data.videoUrl}>{data.videoUrl}</p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type SaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

export default function ContentPage() {
  const [content, setContent] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [unsavedCount, setUnsavedCount] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load content on mount
  useEffect(() => {
    fetch("/api/cms/content")
      .then((r) => {
        if (r.status === 401) throw new Error("unauthenticated");
        return r.ok ? r.json() : null;
      })
      .then((data) => {
        if (data) setContent(data);
        else setContent(defaultContent);
      })
      .catch((err) => {
        if (err.message === "unauthenticated") {
          toast.error("Not authenticated. Please log in.");
        }
        setContent(defaultContent);
      })
      .finally(() => setLoading(false));
  }, []);

  // Refresh iframe
  const refreshPreview = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }, []);

  // Save function
  const save = useCallback(
    async (data: CMSContent) => {
      setSaveStatus("saving");
      try {
        await fetch("/api/cms/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        setSaveStatus("saved");
        setUnsavedCount(0);
        refreshPreview();
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
        toast.error("Failed to save");
      }
    },
    [refreshPreview]
  );

  // Deep-set helper using dot notation
  const updateField = useCallback((path: string, value: unknown) => {
    setContent((prev) => {
      if (!prev) return prev;
      const updated = structuredClone(prev);
      const keys = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
    setSaveStatus("unsaved");
    setUnsavedCount((c) => c + 1);
  }, []);

  // Auto-save debounce
  useEffect(() => {
    if (saveStatus !== "unsaved" || !content) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      save(content);
    }, 1500);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [content, saveStatus, save]);

  // Switch section and navigate iframe
  const handleSectionSwitch = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    if (iframeRef.current) {
      iframeRef.current.src = sectionAnchors[sectionId] ?? "/";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 size={20} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (!content) return null;

  const h = content.home;
  const activeDef = sectionDefs.find((s) => s.id === activeSection)!;

  // Status indicator
  const statusNode = (() => {
    if (saveStatus === "saved")
      return (
        <span className="flex items-center gap-1.5 text-green-400 text-xs">
          <CheckCircle2 size={12} /> All saved
        </span>
      );
    if (saveStatus === "saving")
      return (
        <span className="flex items-center gap-1.5 text-[#d98629] text-xs animate-pulse">
          <Loader2 size={12} className="animate-spin" /> Saving…
        </span>
      );
    if (saveStatus === "unsaved")
      return (
        <span className="flex items-center gap-1.5 text-amber-400 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Unsaved changes ({unsavedCount})
        </span>
      );
    if (saveStatus === "error")
      return (
        <span className="flex items-center gap-1.5 text-red-400 text-xs">
          <AlertCircle size={12} /> Save failed
        </span>
      );
    return null;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Bar */}
      <header className="h-14 border-b border-slate-200 flex items-center px-6 gap-4 shrink-0 bg-slate-50 z-10">
        <div className="flex items-center flex-1 min-w-0">
          <span className="text-slate-400 text-xs">Pages /</span>
          <span className="text-slate-900 text-xs font-semibold ml-1">Home</span>
        </div>
        <div className="flex items-center gap-3">
          {statusNode}
          <button
            onClick={() => content && save(content)}
            disabled={saveStatus === "saving" || saveStatus === "saved" || saveStatus === "idle"}
            className="flex items-center gap-2 bg-[#d98629] hover:bg-[#c4771e] disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-150"
          >
            {saveStatus === "saving" ? (
              <><Loader2 size={12} className="animate-spin" /> Saving…</>
            ) : saveStatus === "saved" ? (
              <><CheckCircle2 size={12} /> Saved</>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-slate-500 hover:text-white text-xs border border-slate-200 px-3 py-1.5 rounded-lg hover:border-slate-300 transition-all"
        >
          ↗ View Site
        </a>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left — Section Nav */}
        <nav className="w-52 shrink-0 border-r border-slate-200 overflow-y-auto bg-slate-50 py-3">
          {sectionDefs.map(({ id, label, description, Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => handleSectionSwitch(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 border-l-2 ${
                  isActive
                    ? "bg-[#d98629]/10 border-[#d98629] text-white"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium leading-tight">{label}</p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">{description}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Center — Field Editor */}
        <div className="w-[420px] shrink-0 overflow-y-auto p-6 border-r border-slate-200 bg-slate-50">
          {/* Section header */}
          <div className="mb-6">
            <h2 className="text-slate-900 font-semibold text-base">{activeDef.label}</h2>
            <p className="text-slate-400 text-xs mt-0.5">{activeDef.description}</p>
          </div>

          {/* Section-specific editor */}
          {activeSection === "hero" && <HeroEditor data={h.hero} update={updateField} />}
          {activeSection === "marquee" && <MarqueeEditor data={h.marquee} update={updateField} />}
          {activeSection === "about" && <AboutEditor data={h.about} update={updateField} />}
          {activeSection === "services" && <ServicesEditor data={h.services} update={updateField} />}
          {activeSection === "process" && <ProcessEditor data={h.process} update={updateField} />}
          {activeSection === "testimonials" && <TestimonialsEditor data={h.testimonials} update={updateField} />}
          {activeSection === "faq" && <FAQEditor data={h.faq} update={updateField} />}
          {activeSection === "cta" && <CTAEditor data={h.cta} update={updateField} />}
        </div>

        {/* Right — Live Preview */}
        <div className="flex-1 relative bg-[#050505]">
          <div className="absolute inset-0 flex flex-col">
            {/* Preview toolbar */}
            <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-3 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-[11px] text-slate-400">
                localhost:3000
              </div>
              <button
                onClick={refreshPreview}
                className="text-slate-400 hover:text-slate-700 transition-colors"
                title="Refresh preview"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            {/* iframe */}
            <iframe
              ref={iframeRef}
              src="/"
              className="flex-1 w-full border-0"
              title="Site Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
