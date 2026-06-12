"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Globe, FileText, Code2, BarChart2, Shield, ArrowRightLeft,
  Loader2, Save, Plus, Trash2, CheckCircle2, AlertCircle,
  Eye, EyeOff, ExternalLink, Info, ChevronDown, ChevronRight,
  Search, Share2, Settings2, MapPin, Tag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SEOPageMeta {
  title: string;
  description: string;
  ogImage: string;
  noindex: boolean;
  canonical: string;
}

interface SEORedirect {
  id: string;
  from: string;
  to: string;
  code: 301 | 302;
  enabled: boolean;
}

interface CMSSeo {
  global: {
    titleTemplate: string;
    defaultDescription: string;
    defaultOgImage: string;
    twitterHandle: string;
    twitterCardType: "summary" | "summary_large_image";
  };
  pages: {
    home: SEOPageMeta;
    about: SEOPageMeta;
    contact: SEOPageMeta;
    studio: SEOPageMeta;
    projects: SEOPageMeta;
    services: SEOPageMeta;
  };
  schema: {
    organization: {
      name: string;
      url: string;
      logo: string;
      description: string;
      sameAs: string[];
    };
    localBusiness: {
      enabled: boolean;
      type: string;
      name: string;
      streetAddress: string;
      city: string;
      region: string;
      country: string;
      postalCode: string;
      phone: string;
      email: string;
    };
  };
  analytics: {
    ga4Id: string;
    gtmId: string;
  };
  robots: {
    customContent: string;
    blockAIScrapers: boolean;
  };
  redirects: SEORedirect[];
}

const defaultSeo: CMSSeo = {
  global: {
    titleTemplate: "%s | Movico",
    defaultDescription: "",
    defaultOgImage: "",
    twitterHandle: "",
    twitterCardType: "summary_large_image",
  },
  pages: {
    home:     { title: "", description: "", ogImage: "", noindex: false, canonical: "" },
    about:    { title: "", description: "", ogImage: "", noindex: false, canonical: "" },
    contact:  { title: "", description: "", ogImage: "", noindex: false, canonical: "" },
    studio:   { title: "", description: "", ogImage: "", noindex: false, canonical: "" },
    projects: { title: "", description: "", ogImage: "", noindex: false, canonical: "" },
    services: { title: "", description: "", ogImage: "", noindex: false, canonical: "" },
  },
  schema: {
    organization: { name: "Movico", url: "https://movicoksa.com", logo: "", description: "", sameAs: [] },
    localBusiness: {
      enabled: true, type: "LocalBusiness", name: "Movico",
      streetAddress: "Wadi Laban", city: "Riyadh", region: "Riyadh Region",
      country: "SA", postalCode: "", phone: "", email: "",
    },
  },
  analytics: { ga4Id: "", gtmId: "" },
  robots: {
    customContent: "User-agent: *\nAllow: /\n\nSitemap: https://movicoksa.com/sitemap.xml",
    blockAIScrapers: false,
  },
  redirects: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function charBar(val: string, max: number) {
  const pct = Math.min((val.length / max) * 100, 100);
  if (val.length === 0) return { width: "0%", color: "bg-slate-200" };
  if (val.length <= max * 0.75) return { width: `${pct}%`, color: "bg-emerald-400" };
  if (val.length <= max) return { width: `${pct}%`, color: "bg-amber-400" };
  return { width: "100%", color: "bg-red-400" };
}

function charColor(val: string, max: number) {
  if (val.length === 0) return "text-slate-400";
  if (val.length <= max * 0.75) return "text-emerald-600";
  if (val.length <= max) return "text-amber-600";
  return "text-red-500";
}

// ─── Form atoms ───────────────────────────────────────────────────────────────

function Label({ text, hint }: { text: string; hint?: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="text-sm font-medium text-slate-700">{text}</span>
      {hint && (
        <span title={hint} className="text-slate-400 cursor-help">
          <Info size={12} />
        </span>
      )}
    </div>
  );
}

function Input({ value, onChange, placeholder, maxLength, type = "text" }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; maxLength?: number; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d98629]/20 focus:border-[#d98629] transition-all"
      />
      {maxLength && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${charBar(value, maxLength).color}`}
              style={{ width: charBar(value, maxLength).width }}
            />
          </div>
          <span className={`text-[11px] tabular-nums font-medium ${charColor(value, maxLength)}`}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}

function Textarea({ value, onChange, placeholder, maxLength, rows = 3 }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; maxLength?: number; rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d98629]/20 focus:border-[#d98629] transition-all resize-none"
      />
      {maxLength && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${charBar(value, maxLength).color}`}
              style={{ width: charBar(value, maxLength).width }}
            />
          </div>
          <span className={`text-[11px] tabular-nums font-medium ${charColor(value, maxLength)}`}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label, description }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3 group text-left w-full"
    >
      <div className={`mt-0.5 w-9 h-5 rounded-full transition-colors shrink-0 ${checked ? "bg-[#d98629]" : "bg-slate-200"} relative`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors leading-tight">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
    </button>
  );
}

function SelectField({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#d98629]/20 focus:border-[#d98629] transition-all appearance-none"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ─── SERP Preview ─────────────────────────────────────────────────────────────

function SerpPreview({ title, description, slug }: { title: string; description: string; slug: string }) {
  const t = title || "Page Title";
  const d = description || "Page description will appear here. Write something compelling to get more clicks from search results.";
  const url = slug ? `movicoksa.com › ${slug}` : "movicoksa.com";

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="w-4 h-4 rounded-sm overflow-hidden flex items-center justify-center bg-slate-300">
          <span className="text-[7px] font-black text-white">G</span>
        </div>
        <span className="text-xs font-medium text-slate-500">Google Search Preview</span>
      </div>
      <div className="p-4 font-sans">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "#d98629" }}>
            <span className="text-[8px] font-black text-black">M</span>
          </div>
          <div>
            <p className="text-[13px] font-medium text-slate-800 leading-none">Movico</p>
            <p className="text-[11px] text-slate-500 leading-none mt-0.5">{url}</p>
          </div>
        </div>
        <p className="text-[18px] text-[#1a0dab] leading-snug line-clamp-1 cursor-pointer hover:underline mt-1">
          {t}
        </p>
        <p className="text-[13px] text-[#4d5156] leading-relaxed mt-1 line-clamp-2">
          {d}
        </p>
      </div>
    </div>
  );
}

// ─── OG Preview ───────────────────────────────────────────────────────────────

function OgPreview({ title, description, image }: { title: string; description: string; image: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
        <Share2 size={12} className="text-slate-400" />
        <span className="text-xs font-medium text-slate-500">Social Preview</span>
      </div>
      <div className="aspect-[1200/630] bg-slate-100 relative">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300">
            <Share2 size={22} />
            <span className="text-xs">No image set</span>
          </div>
        )}
      </div>
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">movicoksa.com</p>
        <p className="text-[13px] font-semibold text-slate-800 line-clamp-1 mt-0.5">{title || "Page Title"}</p>
        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{description || "Page description"}</p>
      </div>
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ icon, iconBg, iconColor, title, description, children }: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: iconBg }}>
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SLUGS: Record<keyof CMSSeo["pages"], string> = {
  home: "", about: "about", contact: "contact",
  studio: "studio", projects: "projects", services: "services",
};

const PAGE_LABELS: Record<keyof CMSSeo["pages"], string> = {
  home: "Home", about: "About", contact: "Contact",
  studio: "Studio", projects: "Projects", services: "Services",
};

const TABS = [
  { id: "global",    label: "Global",     icon: Globe,          desc: "Title template & defaults" },
  { id: "pages",     label: "Pages",      icon: FileText,       desc: "Per-page metadata" },
  { id: "schema",    label: "Schema",     icon: Code2,          desc: "Structured data" },
  { id: "analytics", label: "Analytics",  icon: BarChart2,      desc: "GA4 & Tag Manager" },
  { id: "robots",    label: "Robots",     icon: Shield,         desc: "Crawling rules" },
  { id: "redirects", label: "Redirects",  icon: ArrowRightLeft, desc: "301/302 manager" },
] as const;

type TabId = typeof TABS[number]["id"];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SeoPage() {
  const [seo, setSeo] = useState<CMSSeo>(defaultSeo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("pages");
  const [activePage, setActivePage] = useState<keyof CMSSeo["pages"]>("home");
  const [sameAsInput, setSameAsInput] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ org: true });

  useEffect(() => {
    fetch("/api/cms/seo")
      .then((r) => r.json())
      .then((data) => { setSeo(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/cms/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seo),
      });
      if (!res.ok) throw new Error();
      toast.success("SEO settings saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [seo]);

  const patchSeo = (path: (string | number)[], value: unknown) => {
    setSeo((prev) => {
      const next = structuredClone(prev);
      let obj: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i] as string] as Record<string, unknown>;
      obj[path[path.length - 1] as string] = value;
      return next;
    });
  };

  const toggleSection = (key: string) =>
    setExpandedSections((p) => ({ ...p, [key]: !p[key] }));

  const addRedirect = () => {
    setSeo((p) => ({
      ...p,
      redirects: [...p.redirects, { id: crypto.randomUUID(), from: "", to: "", code: 301, enabled: true }],
    }));
  };

  const updateRedirect = (id: string, patch: Partial<SEORedirect>) =>
    setSeo((p) => ({ ...p, redirects: p.redirects.map((r) => r.id === id ? { ...r, ...patch } : r) }));

  const removeRedirect = (id: string) =>
    setSeo((p) => ({ ...p, redirects: p.redirects.filter((r) => r.id !== id) }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-slate-400" />
      </div>
    );
  }

  const pageScore = (key: keyof CMSSeo["pages"]) => {
    const p = seo.pages[key];
    return (p.title ? 1 : 0) + (p.description ? 1 : 0);
  };

  const totalPagesOptimized = (Object.keys(seo.pages) as Array<keyof CMSSeo["pages"]>)
    .filter((k) => pageScore(k) === 2).length;

  const patchPage = (key: keyof CMSSeo["pages"], patch: Partial<SEOPageMeta>) =>
    setSeo((p) => ({ ...p, pages: { ...p.pages, [key]: { ...p.pages[key], ...patch } } }));

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5 font-medium">
              Search Engine Optimization
            </p>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SEO Settings</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-3 py-2 transition-colors"
            >
              <ExternalLink size={12} />
              View Site
            </a>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 hover:brightness-95 active:scale-[0.98]"
              style={{ background: "#d98629", color: "#000" }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-[220px_1fr] gap-6 items-start">

          {/* ── Left nav ── */}
          <div className="sticky top-6 space-y-3">
            <nav className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {TABS.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all border-b border-slate-100 last:border-0 group ${
                    activeTab === id
                      ? "bg-amber-50 text-[#d98629]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    size={14}
                    className={`shrink-0 transition-colors ${activeTab === id ? "text-[#d98629]" : "text-slate-400 group-hover:text-slate-600"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-none ${activeTab === id ? "text-[#d98629]" : ""}`}>{label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{desc}</p>
                  </div>
                  {activeTab === id && <ChevronRight size={12} className="text-[#d98629]/50 shrink-0" />}
                </button>
              ))}
            </nav>

            {/* Page coverage */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Page Coverage</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-slate-900">
                  {totalPagesOptimized}
                  <span className="text-sm font-normal text-slate-400">/{Object.keys(seo.pages).length}</span>
                </p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  totalPagesOptimized === 6 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {totalPagesOptimized === 6 ? "All done" : "Incomplete"}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d98629] rounded-full transition-all duration-500"
                  style={{ width: `${(totalPagesOptimized / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Quick Links</p>
              <div className="space-y-2">
                {[
                  { label: "Search Console", href: "https://search.google.com/search-console" },
                  { label: "robots.txt", href: "/robots.txt" },
                  { label: "sitemap.xml", href: "/sitemap.xml" },
                ].map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-[#d98629] transition-colors py-0.5"
                  >
                    <ExternalLink size={10} className="shrink-0" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right content ── */}
          <div className="space-y-5 min-w-0">

            {/* ══ GLOBAL ══ */}
            {activeTab === "global" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Global SEO Defaults</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Applied site-wide unless a page overrides them.</p>
                </div>

                <SectionCard
                  icon={<Tag size={15} />}
                  iconBg="#fef3e2"
                  iconColor="#d98629"
                  title="Title Template"
                  description="Format used for every page's browser tab and search title"
                >
                  <div>
                    <Label text="Title Template" hint='Use %s where the page name goes. E.g. "%s | Movico"' />
                    <Input
                      value={seo.global.titleTemplate}
                      onChange={(v) => patchSeo(["global", "titleTemplate"], v)}
                      placeholder="%s | Movico"
                    />
                    {seo.global.titleTemplate && (
                      <p className="text-xs text-slate-500 mt-1.5">
                        Preview: <span className="text-slate-700 font-medium">{seo.global.titleTemplate.replace("%s", "About Us")}</span>
                      </p>
                    )}
                  </div>
                </SectionCard>

                <SectionCard
                  icon={<FileText size={15} />}
                  iconBg="#e0f2fe"
                  iconColor="#0ea5e9"
                  title="Default Meta Description"
                  description="Fallback description for pages without a custom one"
                >
                  <div>
                    <Label text="Default Description" hint="Shown in search results for pages that don't have a custom description." />
                    <Textarea
                      value={seo.global.defaultDescription}
                      onChange={(v) => patchSeo(["global", "defaultDescription"], v)}
                      placeholder="A compelling default description for your site…"
                      maxLength={160}
                    />
                  </div>
                </SectionCard>

                <SectionCard
                  icon={<Share2 size={15} />}
                  iconBg="#f3e8ff"
                  iconColor="#9333ea"
                  title="Social Sharing Defaults"
                  description="Fallback image and Twitter settings for social cards"
                >
                  <div>
                    <Label text="Default OG Image URL" hint="Used when sharing pages without a custom OG image." />
                    <Input
                      value={seo.global.defaultOgImage}
                      onChange={(v) => patchSeo(["global", "defaultOgImage"], v)}
                      placeholder="https://res.cloudinary.com/..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label text="Twitter / X Handle" hint="Your @handle, without the @" />
                      <Input
                        value={seo.global.twitterHandle}
                        onChange={(v) => patchSeo(["global", "twitterHandle"], v)}
                        placeholder="movicoKSA"
                      />
                    </div>
                    <div>
                      <Label text="Twitter Card Type" />
                      <SelectField
                        value={seo.global.twitterCardType}
                        onChange={(v) => patchSeo(["global", "twitterCardType"], v)}
                        options={[
                          { value: "summary_large_image", label: "Large Image (recommended)" },
                          { value: "summary", label: "Small Image" },
                        ]}
                      />
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ══ PAGES ══ */}
            {activeTab === "pages" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Per-Page SEO</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Customize title, description, and social image for each page.</p>
                </div>

                {/* Page pills */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(seo.pages) as Array<keyof CMSSeo["pages"]>).map((key) => {
                      const score = pageScore(key);
                      const isActive = activePage === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setActivePage(key)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                            isActive
                              ? "bg-amber-50 border-[#d98629]/30 text-[#d98629] shadow-sm"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full shrink-0 ${
                            score === 2 ? "bg-emerald-500" : score === 1 ? "bg-amber-400" : "bg-slate-300"
                          }`} />
                          {PAGE_LABELS[key]}
                          {seo.pages[key].noindex && (
                            <EyeOff size={10} className="text-slate-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Editor — two columns */}
                <div className="grid grid-cols-[1fr_300px] gap-4 items-start">
                  {/* Forms */}
                  <div className="space-y-4">
                    <SectionCard
                      icon={<Search size={14} />}
                      iconBg="#eff6ff"
                      iconColor="#3b82f6"
                      title="Search Engine"
                      description={`How the ${PAGE_LABELS[activePage]} page appears in Google`}
                    >
                      <div>
                        <Label text="SEO Title" hint="50–60 characters is ideal for Google." />
                        <Input
                          value={seo.pages[activePage].title}
                          onChange={(v) => patchPage(activePage, { title: v })}
                          placeholder="Leave empty to use the global title template"
                          maxLength={60}
                        />
                      </div>
                      <div>
                        <Label text="Meta Description" hint="120–160 characters. The snippet shown under your link in Google." />
                        <Textarea
                          value={seo.pages[activePage].description}
                          onChange={(v) => patchPage(activePage, { description: v })}
                          placeholder="Write a compelling description to improve click-through rate…"
                          maxLength={160}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label text="Canonical URL" hint="Prevents duplicate content penalties. Leave empty to auto-use this page's URL." />
                        <Input
                          value={seo.pages[activePage].canonical}
                          onChange={(v) => patchPage(activePage, { canonical: v })}
                          placeholder={`https://movicoksa.com/${PAGE_SLUGS[activePage]}`}
                        />
                      </div>
                      <div className="pt-1 border-t border-slate-100">
                        <Toggle
                          checked={seo.pages[activePage].noindex}
                          onChange={(v) => patchPage(activePage, { noindex: v })}
                          label="Hide from search engines"
                          description="Sets noindex, nofollow — this page won't appear in Google."
                        />
                        {seo.pages[activePage].noindex && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                            <AlertCircle size={12} className="shrink-0" />
                            This page is hidden from search engines.
                          </div>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard
                      icon={<Share2 size={14} />}
                      iconBg="#faf5ff"
                      iconColor="#9333ea"
                      title="Social Sharing"
                      description="Image shown when this page is shared on social media"
                    >
                      <div>
                        <Label text="OG Image URL" hint="Ideal: 1200×630px JPG or PNG from your Media Library." />
                        <Input
                          value={seo.pages[activePage].ogImage}
                          onChange={(v) => patchPage(activePage, { ogImage: v })}
                          placeholder="https://res.cloudinary.com/..."
                        />
                        <p className="text-xs text-slate-400 mt-1.5">Recommended: 1200×630px · JPG or PNG</p>
                      </div>
                    </SectionCard>
                  </div>

                  {/* Sticky previews */}
                  <div className="sticky top-6 space-y-3">
                    <SerpPreview
                      title={seo.pages[activePage].title}
                      description={seo.pages[activePage].description}
                      slug={PAGE_SLUGS[activePage]}
                    />
                    <OgPreview
                      title={seo.pages[activePage].title}
                      description={seo.pages[activePage].description}
                      image={seo.pages[activePage].ogImage}
                    />
                    <div className={`rounded-xl border px-4 py-3 flex items-center gap-2 text-sm font-medium ${
                      pageScore(activePage) === 2
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : pageScore(activePage) === 1
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}>
                      {pageScore(activePage) === 2
                        ? <CheckCircle2 size={14} />
                        : <AlertCircle size={14} />}
                      {pageScore(activePage) === 2
                        ? "SEO Ready"
                        : pageScore(activePage) === 1
                        ? "Missing description"
                        : "Title & description missing"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ SCHEMA ══ */}
            {activeTab === "schema" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Structured Data</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Helps Google understand your business and unlock rich results.</p>
                </div>

                {/* Organization */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection("org")}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 shrink-0">
                        <Settings2 size={14} className="text-[#d98629]" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-slate-900">Organization Schema</p>
                        <p className="text-xs text-slate-400 mt-0.5">Business identity for Google Knowledge Graph</p>
                      </div>
                      <span className="text-[10px] font-semibold text-[#d98629] bg-amber-50 border border-[#d98629]/20 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    </div>
                    {expandedSections.org
                      ? <ChevronDown size={14} className="text-slate-400 shrink-0" />
                      : <ChevronRight size={14} className="text-slate-400 shrink-0" />}
                  </button>
                  {expandedSections.org && (
                    <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label text="Organization Name" />
                          <Input value={seo.schema.organization.name} onChange={(v) => patchSeo(["schema", "organization", "name"], v)} placeholder="Movico" />
                        </div>
                        <div>
                          <Label text="Website URL" />
                          <Input value={seo.schema.organization.url} onChange={(v) => patchSeo(["schema", "organization", "url"], v)} placeholder="https://movicoksa.com" />
                        </div>
                      </div>
                      <div>
                        <Label text="Logo URL" />
                        <Input value={seo.schema.organization.logo} onChange={(v) => patchSeo(["schema", "organization", "logo"], v)} placeholder="https://movicoksa.com/logo.webp" />
                      </div>
                      <div>
                        <Label text="Description" />
                        <Textarea value={seo.schema.organization.description} onChange={(v) => patchSeo(["schema", "organization", "description"], v)} placeholder="Brief description of the organization…" rows={2} />
                      </div>
                      <div>
                        <Label text="Social Profiles (sameAs)" hint="All your social URLs help Google build your knowledge panel." />
                        <div className="space-y-2">
                          {seo.schema.organization.sameAs.map((url, i) => (
                            <div key={i} className="flex gap-2">
                              <input
                                value={url}
                                onChange={(e) => {
                                  const arr = [...seo.schema.organization.sameAs];
                                  arr[i] = e.target.value;
                                  patchSeo(["schema", "organization", "sameAs"], arr);
                                }}
                                placeholder="https://instagram.com/movicoksa"
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d98629]/20 focus:border-[#d98629] transition-all"
                              />
                              <button
                                onClick={() => patchSeo(["schema", "organization", "sameAs"], seo.schema.organization.sameAs.filter((_, j) => j !== i))}
                                className="px-3 text-slate-400 hover:text-red-500 transition-colors border border-slate-200 rounded-lg hover:border-red-200 hover:bg-red-50"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <input
                              value={sameAsInput}
                              onChange={(e) => setSameAsInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && sameAsInput.trim()) {
                                  patchSeo(["schema", "organization", "sameAs"], [...seo.schema.organization.sameAs, sameAsInput.trim()]);
                                  setSameAsInput("");
                                }
                              }}
                              placeholder="Paste a social URL and press Enter…"
                              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d98629]/20 focus:border-[#d98629] transition-all"
                            />
                            <button
                              onClick={() => {
                                if (sameAsInput.trim()) {
                                  patchSeo(["schema", "organization", "sameAs"], [...seo.schema.organization.sameAs, sameAsInput.trim()]);
                                  setSameAsInput("");
                                }
                              }}
                              className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 border border-slate-200 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Local Business */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection("lb")}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 shrink-0">
                        <MapPin size={14} className="text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-slate-900">Local Business Schema</p>
                        <p className="text-xs text-slate-400 mt-0.5">Location & contact for local search</p>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <Toggle
                        checked={seo.schema.localBusiness.enabled}
                        onChange={(v) => patchSeo(["schema", "localBusiness", "enabled"], v)}
                        label=""
                      />
                      {expandedSections.lb
                        ? <ChevronDown size={14} className="text-slate-400" />
                        : <ChevronRight size={14} className="text-slate-400" />}
                    </div>
                  </button>
                  {expandedSections.lb && (
                    <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label text="Business Name" />
                          <Input value={seo.schema.localBusiness.name} onChange={(v) => patchSeo(["schema", "localBusiness", "name"], v)} placeholder="Movico" />
                        </div>
                        <div>
                          <Label text="Business Type" hint='E.g. "VideoProductionCompany", "LocalBusiness"' />
                          <Input value={seo.schema.localBusiness.type} onChange={(v) => patchSeo(["schema", "localBusiness", "type"], v)} placeholder="LocalBusiness" />
                        </div>
                        <div>
                          <Label text="Phone" />
                          <Input value={seo.schema.localBusiness.phone} onChange={(v) => patchSeo(["schema", "localBusiness", "phone"], v)} placeholder="+966536660125" />
                        </div>
                        <div>
                          <Label text="Email" />
                          <Input value={seo.schema.localBusiness.email} onChange={(v) => patchSeo(["schema", "localBusiness", "email"], v)} placeholder="info@movicoksa.com" type="email" />
                        </div>
                      </div>
                      <div>
                        <Label text="Street Address" />
                        <Input value={seo.schema.localBusiness.streetAddress} onChange={(v) => patchSeo(["schema", "localBusiness", "streetAddress"], v)} placeholder="Wadi Laban" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label text="City" />
                          <Input value={seo.schema.localBusiness.city} onChange={(v) => patchSeo(["schema", "localBusiness", "city"], v)} placeholder="Riyadh" />
                        </div>
                        <div>
                          <Label text="Region" />
                          <Input value={seo.schema.localBusiness.region} onChange={(v) => patchSeo(["schema", "localBusiness", "region"], v)} placeholder="Riyadh Region" />
                        </div>
                        <div>
                          <Label text="Country Code" />
                          <Input value={seo.schema.localBusiness.country} onChange={(v) => patchSeo(["schema", "localBusiness", "country"], v)} placeholder="SA" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══ ANALYTICS ══ */}
            {activeTab === "analytics" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Analytics & Tag Manager</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Connect Google Analytics and Tag Manager.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-800 mb-1.5">How it works</p>
                  <ul className="text-xs text-blue-700/80 space-y-1 list-disc list-inside">
                    <li>If both are set, only GTM loads — configure GA4 inside GTM</li>
                    <li>Use GTM for flexibility across multiple tags</li>
                    <li>Use GA4 alone for a simpler direct integration</li>
                  </ul>
                </div>

                <SectionCard
                  icon={<BarChart2 size={15} />}
                  iconBg="#fef9c3"
                  iconColor="#ca8a04"
                  title="Google Tag Manager"
                  description="Recommended if you manage multiple tracking tags"
                >
                  <div>
                    <Label text="GTM Container ID" hint="Found in GTM under your container settings. Format: GTM-XXXXXXX" />
                    <Input
                      value={seo.analytics.gtmId}
                      onChange={(v) => patchSeo(["analytics", "gtmId"], v)}
                      placeholder="GTM-XXXXXXX"
                    />
                    {seo.analytics.gtmId && (
                      <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5 font-medium">
                        <CheckCircle2 size={11} /> GTM active — injected on all pages
                      </p>
                    )}
                  </div>
                </SectionCard>

                <SectionCard
                  icon={<Globe size={15} />}
                  iconBg="#dcfce7"
                  iconColor="#16a34a"
                  title="Google Analytics 4"
                  description="Direct GA4 integration without Tag Manager"
                >
                  <div>
                    <Label text="GA4 Measurement ID" hint="Found in GA4 › Admin › Data Streams. Format: G-XXXXXXXXXX" />
                    <Input
                      value={seo.analytics.ga4Id}
                      onChange={(v) => patchSeo(["analytics", "ga4Id"], v)}
                      placeholder="G-XXXXXXXXXX"
                    />
                    {seo.analytics.ga4Id && seo.analytics.gtmId && (
                      <p className="text-xs text-amber-600 flex items-center gap-1 mt-1.5 font-medium">
                        <AlertCircle size={11} /> GTM is active — configure GA4 inside GTM instead
                      </p>
                    )}
                    {seo.analytics.ga4Id && !seo.analytics.gtmId && (
                      <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5 font-medium">
                        <CheckCircle2 size={11} /> GA4 active — injected directly on all pages
                      </p>
                    )}
                  </div>
                </SectionCard>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Open in Google</p>
                  <div className="flex flex-wrap gap-5">
                    {[
                      { label: "Tag Manager", href: "https://tagmanager.google.com" },
                      { label: "Analytics", href: "https://analytics.google.com" },
                      { label: "Search Console", href: "https://search.google.com/search-console" },
                    ].map(({ label, href }) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-[#d98629] hover:underline font-medium"
                      >
                        <ExternalLink size={12} /> {label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ ROBOTS ══ */}
            {activeTab === "robots" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Robots & Crawling</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Control how search engines and AI crawlers access your site.</p>
                </div>

                <SectionCard
                  icon={<Shield size={15} />}
                  iconBg="#fef2f2"
                  iconColor="#ef4444"
                  title="AI Crawler Blocking"
                  description="Prevent AI companies from training on your content"
                >
                  <Toggle
                    checked={seo.robots.blockAIScrapers}
                    onChange={(v) => patchSeo(["robots", "blockAIScrapers"], v)}
                    label="Block AI training bots"
                    description="Adds Disallow rules for GPTBot, ClaudeBot, CCBot, PerplexityBot. Your site still appears in search results."
                  />
                </SectionCard>

                <SectionCard
                  icon={<FileText size={15} />}
                  iconBg="#f0fdf4"
                  iconColor="#16a34a"
                  title="robots.txt Content"
                  description="Exact content served at /robots.txt — AI blocker rules are appended automatically"
                >
                  <Textarea
                    value={seo.robots.customContent}
                    onChange={(v) => patchSeo(["robots", "customContent"], v)}
                    rows={10}
                  />
                  <div className="flex gap-5 pt-1">
                    <a href="/robots.txt" target="_blank" className="flex items-center gap-1.5 text-sm text-[#d98629] hover:underline font-medium">
                      <Eye size={12} /> Preview robots.txt
                    </a>
                    <a href="/sitemap.xml" target="_blank" className="flex items-center gap-1.5 text-sm text-[#d98629] hover:underline font-medium">
                      <Eye size={12} /> Preview sitemap.xml
                    </a>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ══ REDIRECTS ══ */}
            {activeTab === "redirects" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Redirect Manager</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Redirect old URLs to preserve SEO value and fix broken links.</p>
                  </div>
                  <button
                    onClick={addRedirect}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  >
                    <Plus size={13} /> Add Redirect
                  </button>
                </div>

                {seo.redirects.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl py-16 text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <ArrowRightLeft size={20} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">No redirects yet</p>
                    <p className="text-xs text-slate-400 mt-1">Click &ldquo;Add Redirect&rdquo; to create your first one.</p>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[1fr_1fr_120px_60px_48px] gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">From (old URL)</p>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">To (new URL)</p>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Type</p>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Active</p>
                      <span />
                    </div>
                    <div className="divide-y divide-slate-100">
                      {seo.redirects.map((r) => (
                        <div
                          key={r.id}
                          className={`grid grid-cols-[1fr_1fr_120px_60px_48px] gap-3 items-center px-5 py-3.5 transition-colors ${
                            r.enabled ? "bg-white hover:bg-slate-50/50" : "bg-slate-50 opacity-60"
                          }`}
                        >
                          <input
                            value={r.from}
                            onChange={(e) => updateRedirect(r.id, { from: e.target.value })}
                            placeholder="/old-page"
                            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none w-full"
                          />
                          <input
                            value={r.to}
                            onChange={(e) => updateRedirect(r.id, { to: e.target.value })}
                            placeholder="/new-page"
                            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none w-full"
                          />
                          <select
                            value={r.code}
                            onChange={(e) => updateRedirect(r.id, { code: Number(e.target.value) as 301 | 302 })}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#d98629] transition-colors"
                          >
                            <option value={301}>301 Permanent</option>
                            <option value={302}>302 Temporary</option>
                          </select>
                          <button
                            onClick={() => updateRedirect(r.id, { enabled: !r.enabled })}
                            className={`flex items-center justify-center transition-colors ${r.enabled ? "text-emerald-500 hover:text-emerald-600" : "text-slate-300 hover:text-slate-500"}`}
                          >
                            {r.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            onClick={() => removeRedirect(r.id)}
                            className="flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs text-amber-700">
                    <strong>Note:</strong> Use <strong>301</strong> for permanent moves (passes SEO value) and <strong>302</strong> for temporary ones. Redirects apply within 60 seconds of saving.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
