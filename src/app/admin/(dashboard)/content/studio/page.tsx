"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Loader2, CheckCircle2, AlertCircle,
  Image as ImageIcon, Play, LayoutGrid, MessageSquare, Sparkles, Film,
  Plus, Trash2, ChevronDown, ChevronRight, PanelRight, PanelRightClose, PanelLeft, PanelLeftClose, type LucideIcon,
} from "lucide-react";
import { ScaledPreviewPane } from "@/components/cms/ScaledPreviewPane";
import { useAdminLayout } from "@/contexts/AdminLayoutContext";
import { CloudinaryUploader } from "@/components/cms/CloudinaryUploader";
import { defaultContent } from "@/lib/cms/types";
import type { StudioContent, StudioPackage, StudioWorkImage } from "@/lib/cms/types";

type SectionId = "hero" | "marquee" | "space" | "work" | "packages" | "quote" | "finalcta";

const sectionDefs: { id: SectionId; label: string; description: string; Icon: LucideIcon }[] = [
  { id: "hero",     label: "Hero",        description: "Headline, subtitle, CTA",    Icon: Film        },
  { id: "marquee",  label: "Marquee",     description: "Fact ticker items",           Icon: Play        },
  { id: "space",    label: "The Space",   description: "Heading, stats, images",      Icon: ImageIcon   },
  { id: "work",     label: "Work Strip",  description: "Filmstrip images & heading",  Icon: LayoutGrid  },
  { id: "packages", label: "Packages",    description: "Studio package cards",        Icon: Sparkles    },
  { id: "quote",    label: "Quote",       description: "Full-width quote section",    Icon: MessageSquare},
  { id: "finalcta", label: "Final CTA",   description: "Booking section copy",        Icon: Play        },
];

const inputCls = "bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm w-full focus:border-[#d98629]/50 focus:outline-none placeholder:text-slate-400 transition-colors";
const textareaCls = inputCls + " resize-none";
const labelCls = "text-[10px] uppercase tracking-[0.12em] text-slate-400 mb-1.5 block";
const addBtnCls = "w-full mt-2 flex items-center justify-center gap-2 border border-slate-200 text-slate-500 text-xs rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-700 transition-all";
const divCls = "h-px bg-slate-100 my-4";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>}
    </div>
  );
}

function CTAFields({ label, value, onChange }: { label: string; value: { text: string; href: string }; onChange: (v: { text: string; href: string }) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label={`${label} Text`}>
        <input className={inputCls} value={value.text} onChange={(e) => onChange({ ...value, text: e.target.value })} />
      </Field>
      <Field label={`${label} URL`}>
        <input className={inputCls} value={value.href} onChange={(e) => onChange({ ...value, href: e.target.value })} />
      </Field>
    </div>
  );
}

/* ── Section Editors ──────────────────────────────────── */

function HeroEditor({ data, update }: { data: StudioContent["hero"]; update: (d: StudioContent["hero"]) => void }) {
  const set = (k: keyof StudioContent["hero"], v: unknown) => update({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Headline Line 1"><input className={inputCls} value={data.headlineLine1} onChange={(e) => set("headlineLine1", e.target.value)} /></Field>
      <Field label="Headline Line 2 (amber)"><input className={inputCls} value={data.headlineLine2} onChange={(e) => set("headlineLine2", e.target.value)} /></Field>
      <Field label="Headline Line 3"><input className={inputCls} value={data.headlineLine3} onChange={(e) => set("headlineLine3", e.target.value)} /></Field>
      <div className={divCls} />
      <Field label="Subtitle"><textarea className={textareaCls} rows={3} value={data.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></Field>
      <div className={divCls} />
      <CTAFields label="Primary CTA" value={data.ctaPrimary} onChange={(v) => set("ctaPrimary", v)} />
      <CTAFields label="Secondary CTA" value={data.ctaSecondary} onChange={(v) => set("ctaSecondary", v)} />
      <div className={divCls} />
      <Field label="Hero Background Image">
        <CloudinaryUploader resourceType="image" folder="movico/studio" label="Hero Image" currentUrl={data.heroImage} onUpload={({ url }) => set("heroImage", url)} />
      </Field>
    </div>
  );
}

function MarqueeEditor({ data, update }: { data: string[]; update: (d: string[]) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-slate-400">Each item appears in the scrolling ticker below the hero.</p>
      {data.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input className={inputCls} value={item} onChange={(e) => { const next = [...data]; next[i] = e.target.value; update(next); }} placeholder={`Fact ${i + 1}`} />
          <button onClick={() => update(data.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-400 transition-colors px-2">
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button onClick={() => update([...data, ""])} className={addBtnCls}><Plus size={12} /> Add Item</button>
    </div>
  );
}

function SpaceEditor({ data, update }: { data: StudioContent["space"]; update: (d: StudioContent["space"]) => void }) {
  const set = (k: keyof StudioContent["space"], v: unknown) => update({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Heading Line 1"><input className={inputCls} value={data.headingLine1} onChange={(e) => set("headingLine1", e.target.value)} /></Field>
      <Field label="Heading Line 2 (amber)"><input className={inputCls} value={data.headingLine2} onChange={(e) => set("headingLine2", e.target.value)} /></Field>
      <Field label="Description"><textarea className={textareaCls} rows={3} value={data.description} onChange={(e) => set("description", e.target.value)} /></Field>
      <div className={divCls} />
      <div>
        <label className={labelCls}>Stats (4 items)</label>
        <div className="grid grid-cols-2 gap-3">
          {data.stats.map((s, i) => (
            <div key={i} className="space-y-1.5">
              <input className={inputCls} value={s.value} onChange={(e) => { const n = [...data.stats]; n[i] = { ...n[i], value: e.target.value }; set("stats", n); }} placeholder="12+" />
              <input className={inputCls} value={s.label} onChange={(e) => { const n = [...data.stats]; n[i] = { ...n[i], label: e.target.value }; set("stats", n); }} placeholder="Light Sources" />
            </div>
          ))}
        </div>
      </div>
      <div className={divCls} />
      <Field label="Left Hero Image">
        <CloudinaryUploader resourceType="image" folder="movico/studio" label="Large Left Image" currentUrl={data.heroImage} onUpload={({ url }) => set("heroImage", url)} />
      </Field>
      <Field label="Right Small Image">
        <CloudinaryUploader resourceType="image" folder="movico/studio" label="Small Right Image" currentUrl={data.smallImage} onUpload={({ url }) => set("smallImage", url)} />
      </Field>
      <div className={divCls} />
      <div>
        <label className={labelCls}>Bottom 3 Images</label>
        <div className="space-y-4">
          {data.bottomImages.map((img, i) => (
            <div key={i} className="space-y-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <Field label={`Image ${i + 1} Label`}>
                <input className={inputCls} value={img.label} onChange={(e) => { const n = [...data.bottomImages]; n[i] = { ...n[i], label: e.target.value }; set("bottomImages", n); }} />
              </Field>
              <CloudinaryUploader resourceType="image" folder="movico/studio" label={`Upload Image ${i + 1}`} currentUrl={img.src} onUpload={({ url }) => { const n = [...data.bottomImages]; n[i] = { ...n[i], src: url }; set("bottomImages", n); }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkEditor({ data, update }: { data: StudioContent["work"]; update: (d: StudioContent["work"]) => void }) {
  const set = (k: keyof StudioContent["work"], v: unknown) => update({ ...data, [k]: v });
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      <Field label="Heading"><input className={inputCls} value={data.heading} onChange={(e) => set("heading", e.target.value)} /></Field>
      <Field label="Heading Accent (amber)"><input className={inputCls} value={data.headingAccent} onChange={(e) => set("headingAccent", e.target.value)} /></Field>
      <Field label="Subtext"><textarea className={textareaCls} rows={2} value={data.subtext} onChange={(e) => set("subtext", e.target.value)} /></Field>
      <div className={divCls} />
      <Field label="Inline CTA Heading"><input className={inputCls} value={data.inlineCTAHeading} onChange={(e) => set("inlineCTAHeading", e.target.value)} /></Field>
      <Field label="Inline CTA Subtext"><input className={inputCls} value={data.inlineCTASubtext} onChange={(e) => set("inlineCTASubtext", e.target.value)} /></Field>
      <div className={divCls} />
      <div>
        <label className={labelCls}>Filmstrip Images ({data.images.length})</label>
        <div className="space-y-1.5">
          {data.images.map((img: StudioWorkImage, i) => (
            <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
              <button type="button" onClick={() => setExpandedIdx(expandedIdx === i ? null : i)} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left transition-colors">
                <span className="text-[10px] text-[#d98629]/70 font-mono w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-slate-700 text-xs flex-1 truncate">{img.alt || "Image " + (i + 1)}</p>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${img.wide ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>{img.wide ? "wide" : "normal"}</span>
                {expandedIdx === i ? <ChevronDown size={12} className="text-slate-400 shrink-0" /> : <ChevronRight size={12} className="text-slate-400 shrink-0" />}
                <button type="button" onClick={(e) => { e.stopPropagation(); set("images", data.images.filter((_, idx) => idx !== i)); }} className="text-slate-300 hover:text-red-400 transition-colors">
                  <Trash2 size={11} />
                </button>
              </button>
              {expandedIdx === i && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-3 bg-slate-50">
                  <Field label="Alt Text / Caption">
                    <input className={inputCls} value={img.alt} onChange={(e) => { const n = [...data.images]; n[i] = { ...n[i], alt: e.target.value }; set("images", n); }} />
                  </Field>
                  <div className="flex items-center gap-3">
                    <label className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Wide frame</label>
                    <button type="button" onClick={() => { const n = [...data.images]; n[i] = { ...n[i], wide: !n[i].wide }; set("images", n); }} className={`w-9 h-5 rounded-full transition-all relative ${img.wide ? "bg-[#d98629]" : "bg-slate-300"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${img.wide ? "left-4" : "left-0.5"}`} />
                    </button>
                  </div>
                  <CloudinaryUploader resourceType="image" folder="movico/studio" label="Image" currentUrl={img.src} onUpload={({ url }) => { const n = [...data.images]; n[i] = { ...n[i], src: url }; set("images", n); }} />
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => { set("images", [...data.images, { src: "", alt: "", wide: false }]); setExpandedIdx(data.images.length); }} className={addBtnCls}>
          <Plus size={12} /> Add Image
        </button>
      </div>
    </div>
  );
}

function PackagesEditor({ data, update }: { data: StudioContent["packages"]; update: (d: StudioContent["packages"]) => void }) {
  const set = (k: keyof StudioContent["packages"], v: unknown) => update({ ...data, [k]: v });
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <Field label="Heading Line 1"><input className={inputCls} value={data.headingLine1} onChange={(e) => set("headingLine1", e.target.value)} /></Field>
      <Field label="Heading Line 2 (amber)"><input className={inputCls} value={data.headingLine2} onChange={(e) => set("headingLine2", e.target.value)} /></Field>
      <Field label="Subtext"><textarea className={textareaCls} rows={2} value={data.subtext} onChange={(e) => set("subtext", e.target.value)} /></Field>
      <div className={divCls} />
      <div>
        <label className={labelCls}>Packages</label>
        <div className="space-y-1.5">
          {data.items.map((pkg: StudioPackage, i) => (
            <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
              <button type="button" onClick={() => setExpandedIdx(expandedIdx === i ? null : i)} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left transition-colors">
                <span className="text-[10px] text-[#d98629]/70 font-mono w-5 shrink-0">{pkg.number}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">{pkg.title || "Untitled"}</p>
                  <p className="text-[10px] text-slate-400 truncate">{pkg.tagline}</p>
                </div>
                {pkg.highlight && <span className="text-[9px] bg-[#d98629]/15 text-[#d98629] px-1.5 py-0.5 rounded font-semibold">Premium</span>}
                {expandedIdx === i ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
              </button>
              {expandedIdx === i && (
                <div className="px-3 pb-4 pt-2 border-t border-slate-100 space-y-3 bg-slate-50">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Package Number"><input className={inputCls} value={pkg.number} onChange={(e) => { const n = [...data.items]; n[i] = { ...n[i], number: e.target.value }; set("items", n); }} /></Field>
                    <Field label="Title"><input className={inputCls} value={pkg.title} onChange={(e) => { const n = [...data.items]; n[i] = { ...n[i], title: e.target.value }; set("items", n); }} /></Field>
                  </div>
                  <Field label="Tagline"><input className={inputCls} value={pkg.tagline} onChange={(e) => { const n = [...data.items]; n[i] = { ...n[i], tagline: e.target.value }; set("items", n); }} /></Field>
                  <Field label="Description"><textarea className={textareaCls} rows={3} value={pkg.description} onChange={(e) => { const n = [...data.items]; n[i] = { ...n[i], description: e.target.value }; set("items", n); }} /></Field>
                  <div>
                    <label className={labelCls}>Includes</label>
                    {pkg.includes.map((item, j) => (
                      <div key={j} className="flex gap-2 mb-1.5">
                        <input className={inputCls} value={item} onChange={(e) => { const n = [...data.items]; const inc = [...n[i].includes]; inc[j] = e.target.value; n[i] = { ...n[i], includes: inc }; set("items", n); }} />
                        <button onClick={() => { const n = [...data.items]; n[i] = { ...n[i], includes: n[i].includes.filter((_, idx) => idx !== j) }; set("items", n); }} className="text-slate-300 hover:text-red-400 transition-colors px-1.5">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => { const n = [...data.items]; n[i] = { ...n[i], includes: [...n[i].includes, ""] }; set("items", n); }} className={addBtnCls}><Plus size={11} /> Add Item</button>
                  </div>
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2.5">
                    <div>
                      <p className="text-sm text-slate-900 font-medium">Premium / Highlighted</p>
                      <p className="text-[10px] text-slate-400">Shows amber border & PREMIUM badge</p>
                    </div>
                    <button type="button" onClick={() => { const n = [...data.items]; n[i] = { ...n[i], highlight: !n[i].highlight }; set("items", n); }} className={`w-9 h-5 rounded-full relative transition-all ${pkg.highlight ? "bg-[#d98629]" : "bg-slate-300"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${pkg.highlight ? "left-4" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => { set("items", [...data.items, { number: String(data.items.length + 1).padStart(2, "0"), title: "New Package", tagline: "", description: "", includes: [], highlight: false }]); setExpandedIdx(data.items.length); }} className={addBtnCls}>
          <Plus size={12} /> Add Package
        </button>
      </div>
    </div>
  );
}

function QuoteEditor({ data, update }: { data: StudioContent["quote"]; update: (d: StudioContent["quote"]) => void }) {
  const set = (k: keyof StudioContent["quote"], v: string) => update({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Line 1 (white)"><input className={inputCls} value={data.line1} onChange={(e) => set("line1", e.target.value)} /></Field>
      <Field label="Line 2 (amber)"><input className={inputCls} value={data.line2} onChange={(e) => set("line2", e.target.value)} /></Field>
      <Field label="Line 3 (white)"><input className={inputCls} value={data.line3} onChange={(e) => set("line3", e.target.value)} /></Field>
      <div className={divCls} />
      <Field label="Background Image">
        <CloudinaryUploader resourceType="image" folder="movico/studio" label="Quote Background" currentUrl={data.bgImage} onUpload={({ url }) => set("bgImage", url)} />
      </Field>
    </div>
  );
}

function FinalCTAEditor({ data, update }: { data: StudioContent["finalCTA"]; update: (d: StudioContent["finalCTA"]) => void }) {
  const set = (k: keyof StudioContent["finalCTA"], v: unknown) => update({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Heading Line 1"><input className={inputCls} value={data.headingLine1} onChange={(e) => set("headingLine1", e.target.value)} /></Field>
      <Field label="Heading Line 2 (amber)"><input className={inputCls} value={data.headingLine2} onChange={(e) => set("headingLine2", e.target.value)} /></Field>
      <Field label="Heading Line 3"><input className={inputCls} value={data.headingLine3} onChange={(e) => set("headingLine3", e.target.value)} /></Field>
      <Field label="Body Text"><textarea className={textareaCls} rows={4} value={data.body} onChange={(e) => set("body", e.target.value)} /></Field>
      <div className={divCls} />
      <CTAFields label="Primary CTA" value={data.ctaPrimary} onChange={(v) => set("ctaPrimary", v)} />
      <CTAFields label="Secondary CTA" value={data.ctaSecondary} onChange={(v) => set("ctaSecondary", v)} />
      <div className={divCls} />
      <div>
        <label className={labelCls}>Collage Images (3 total)</label>
        <div className="space-y-3">
          {["Large image (top, spans 2 cols)", "Small image — left", "Small image — right"].map((lbl, i) => (
            <div key={i}>
              <p className="text-[10px] text-slate-400 mb-1">{lbl}</p>
              <CloudinaryUploader resourceType="image" folder="movico/studio" label={`Image ${i + 1}`} currentUrl={data.images[i]} onUpload={({ url }) => { const n = [...data.images]; n[i] = url; set("images", n); }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────── */

type SaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

export default function StudioContentPage() {
  const { sidebarOpen, toggleSidebar } = useAdminLayout();
  const [content, setContent]     = useState<{ studio: StudioContent } | null>(null);
  const [loading, setLoading]     = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [unsavedCount, setUnsavedCount] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [sectionNavExpanded, setSectionNavExpanded] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/cms/content")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setContent({ studio: data.studio ?? defaultContent.studio, ...data });
        else setContent({ studio: defaultContent.studio });
      })
      .catch(() => setContent({ studio: defaultContent.studio }))
      .finally(() => setLoading(false));
  }, []);

  const refreshPreview = useCallback(() => {
    if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
  }, []);

  const save = useCallback(async (data: { studio: StudioContent }) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/cms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaveStatus("saved");
        setUnsavedCount(0);
        refreshPreview();
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
        toast.error("Failed to save");
      }
    } catch {
      setSaveStatus("error");
      toast.error("Network error");
    }
  }, [refreshPreview]);

  function updateStudio(next: StudioContent) {
    if (!content) return;
    const updated = { ...content, studio: next };
    setContent(updated);
    setSaveStatus("unsaved");
    setUnsavedCount((c) => c + 1);
  }

  useEffect(() => {
    if (saveStatus !== "unsaved" || !content) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => save(content), 1500);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [content, saveStatus, save]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Loader2 size={20} className="animate-spin text-slate-400" />
    </div>
  );
  if (!content) return null;

  const s = content.studio;
  const def = sectionDefs.find((x) => x.id === activeSection)!;

  const statusNode = (() => {
    if (saveStatus === "saved")   return <span className="flex items-center gap-1.5 text-green-600 text-xs"><CheckCircle2 size={12} /> All saved</span>;
    if (saveStatus === "saving")  return <span className="flex items-center gap-1.5 text-[#d98629] text-xs animate-pulse"><Loader2 size={12} className="animate-spin" /> Saving…</span>;
    if (saveStatus === "unsaved") return <span className="flex items-center gap-1.5 text-amber-500 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Unsaved ({unsavedCount})</span>;
    if (saveStatus === "error")   return <span className="flex items-center gap-1.5 text-red-500 text-xs"><AlertCircle size={12} /> Save failed</span>;
    return null;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="h-14 border-b border-slate-200 flex items-center px-4 gap-2 shrink-0 bg-white z-10">
        <div className="flex items-center flex-1 min-w-0">
          <span className="text-slate-400 text-xs">Pages /</span>
          <span className="text-slate-900 text-xs font-semibold ml-1">Studio</span>
        </div>
        <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1">
          <button onClick={toggleSidebar} title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className={`p-1.5 rounded-md transition-all ${sidebarOpen ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"}`}>
            {sidebarOpen ? <PanelLeftClose size={13} /> : <PanelLeft size={13} />}
          </button>
          <button onClick={() => setSectionNavExpanded((v) => !v)} title={sectionNavExpanded ? "Collapse section nav" : "Expand section nav"}
            className={`p-1.5 rounded-md transition-all ${sectionNavExpanded ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"}`}>
            {sectionNavExpanded ? <PanelLeftClose size={13} /> : <PanelLeft size={13} />}
          </button>
          <button onClick={() => setShowPreview((v) => !v)} title={showPreview ? "Hide preview" : "Show preview"}
            className={`p-1.5 rounded-md transition-all ${showPreview ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"}`}>
            {showPreview ? <PanelRightClose size={13} /> : <PanelRight size={13} />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {statusNode}
          <button onClick={() => content && save(content)}
            disabled={saveStatus === "saving" || saveStatus === "saved" || saveStatus === "idle"}
            className="flex items-center gap-2 bg-[#d98629] hover:bg-[#c4771e] disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-semibold px-4 py-2 rounded-lg transition-all">
            {saveStatus === "saving" ? <><Loader2 size={12} className="animate-spin" /> Saving…</> : saveStatus === "saved" ? <><CheckCircle2 size={12} /> Saved</> : "Save Changes"}
          </button>
        </div>
        <a href="/studio" target="_blank" rel="noreferrer"
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs border border-slate-200 px-3 py-1.5 rounded-lg hover:border-slate-300 transition-all">
          ↗ View Page
        </a>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {sectionNavExpanded ? (
          <nav className="w-44 shrink-0 border-r border-slate-200 overflow-y-auto bg-slate-50 py-3">
            {sectionDefs.map(({ id, label, description, Icon }) => {
              const isActive = activeSection === id;
              return (
                <button key={id} onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 border-l-2 ${isActive ? "bg-[#d98629]/10 border-[#d98629] text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}>
                  <Icon size={14} className="shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium leading-tight">{label}</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">{description}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        ) : (
          <nav className="w-10 shrink-0 border-r border-slate-200 overflow-y-auto bg-slate-50 py-3 flex flex-col items-center gap-0.5">
            {sectionDefs.map(({ id, label, Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  title={label}
                  className={`group relative w-full flex items-center justify-center py-2.5 transition-all border-l-2 ${
                    isActive
                      ? "border-[#d98629] bg-[#d98629]/10 text-[#d98629]"
                      : "border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={14} />
                  <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap bg-slate-800 text-white text-[11px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        <div className={`${showPreview ? "w-[400px] shrink-0" : "flex-1"} overflow-y-auto p-6 border-r border-slate-200 bg-slate-50`}>
          <div className="mb-6">
            <h2 className="text-slate-900 font-semibold text-base">{def.label}</h2>
            <p className="text-slate-400 text-xs mt-0.5">{def.description}</p>
          </div>
          {activeSection === "hero"     && <HeroEditor     data={s.hero}     update={(d) => updateStudio({ ...s, hero: d })} />}
          {activeSection === "marquee"  && <MarqueeEditor  data={s.marqueeItems} update={(d) => updateStudio({ ...s, marqueeItems: d })} />}
          {activeSection === "space"    && <SpaceEditor    data={s.space}    update={(d) => updateStudio({ ...s, space: d })} />}
          {activeSection === "work"     && <WorkEditor     data={s.work}     update={(d) => updateStudio({ ...s, work: d })} />}
          {activeSection === "packages" && <PackagesEditor data={s.packages} update={(d) => updateStudio({ ...s, packages: d })} />}
          {activeSection === "quote"    && <QuoteEditor    data={s.quote}    update={(d) => updateStudio({ ...s, quote: d })} />}
          {activeSection === "finalcta" && <FinalCTAEditor data={s.finalCTA} update={(d) => updateStudio({ ...s, finalCTA: d })} />}
        </div>

        {showPreview && (
          <ScaledPreviewPane src="/studio" iframeRef={iframeRef} onRefresh={refreshPreview} />
        )}
      </div>
    </div>
  );
}
