"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save, Check, Loader2, Trash2, ExternalLink, ChevronDown } from "lucide-react";
import { CloudinaryUploader } from "@/components/cms/CloudinaryUploader";

interface SEOMeta {
  title: string;
  description: string;
  ogImage: string;
  noindex: boolean;
  canonical: string;
}

interface CMSProject {
  _id?: string;
  slug: string;
  number: string;
  client: string;
  title: string;
  category: string;
  location: string;
  year: string;
  shortDescription: string;
  fullDescription: string;
  result: string;
  tags: string[];
  coverImage: string;
  coverAlt: string;
  images: string[];
  featured: boolean;
  order: number;
  visible: boolean;
  seo?: SEOMeta;
}

const BLANK_SEO: SEOMeta = { title: "", description: "", ogImage: "", noindex: false, canonical: "" };

const BLANK: Omit<CMSProject, "_id"> = {
  slug: "", number: "", client: "", title: "", category: "", location: "",
  year: new Date().getFullYear().toString(), shortDescription: "", fullDescription: "",
  result: "", tags: [], coverImage: "", coverAlt: "", images: [], featured: false, order: 0, visible: true,
  seo: BLANK_SEO,
};

const inputCls =
  "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:border-[#d98629] focus:outline-none transition-colors placeholder:text-slate-400";
const labelCls = "block text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-1.5";

function Toggle({ on, onToggle, label, sub }: { on: boolean; onToggle: () => void; label: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-slate-900 text-sm font-medium">{label}</p>
        {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative w-10 h-5 rounded-full transition-all duration-200 ${on ? "bg-[#d98629]" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${on ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <h3 className="text-slate-500 text-[11px] uppercase tracking-[0.2em] font-medium">{title}</h3>
      {children}
    </div>
  );
}

export default function ProjectForm({ initialData, projectId }: { initialData?: CMSProject; projectId?: string }) {
  const router = useRouter();
  const isEdit = !!projectId;
  const [form, setForm] = useState<Omit<CMSProject, "_id">>(initialData ? {
    slug: initialData.slug, number: initialData.number, client: initialData.client,
    title: initialData.title, category: initialData.category, location: initialData.location,
    year: initialData.year, shortDescription: initialData.shortDescription,
    fullDescription: initialData.fullDescription, result: initialData.result,
    tags: initialData.tags, coverImage: initialData.coverImage, coverAlt: initialData.coverAlt ?? "", images: initialData.images,
    featured: initialData.featured, order: initialData.order, visible: initialData.visible,
    seo: initialData.seo ?? BLANK_SEO,
  } : BLANK);
  const [seo, setSeoState] = useState<SEOMeta>(initialData?.seo ?? BLANK_SEO);
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(", ") ?? "");
  const [imagesInput, setImagesInput] = useState(initialData?.images.join("\n") ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  function setSeo<K extends keyof SEOMeta>(key: K, value: SEOMeta[K]) {
    setSeoState((prev) => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    if (initialData) {
      setTagsInput(initialData.tags.join(", "));
      setImagesInput(initialData.images.join("\n"));
    }
  }, [initialData]);

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      images: imagesInput.split("\n").map((u) => u.trim()).filter(Boolean),
      seo,
    };
    try {
      const res = isEdit
        ? await fetch(`/api/cms/projects/${projectId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/cms/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (res.ok) {
        toast.success(isEdit ? "Project updated" : "Project created");
        router.push("/admin/content/projects");
      } else {
        toast.error("Failed to save");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEdit || !confirm(`Delete "${form.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/cms/projects/${projectId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Project deleted");
        router.push("/admin/content/projects");
      } else {
        toast.error("Failed to delete");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/content/projects")}
            className="flex items-center gap-2 text-slate-500 hover:text-white text-xs uppercase tracking-[0.15em] transition-colors"
          >
            <ArrowLeft size={13} />
            Projects
          </button>
          <span className="text-white/15">/</span>
          <span className="text-slate-500 text-sm truncate max-w-xs">
            {form.title || (isEdit ? "Edit Project" : "New Project")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && form.slug && (
            <a
              href={`/projects/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs uppercase tracking-[0.12em] px-3 py-2 rounded-lg hover:bg-slate-100 transition-all"
            >
              <ExternalLink size={11} />
              View
            </a>
          )}
          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-xs uppercase tracking-[0.12em] px-3 py-2 rounded-lg hover:bg-red-400/[0.06] transition-all disabled:opacity-40"
            >
              {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !form.title.trim() || !form.slug.trim()}
            className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-[0.15em] px-5 py-2 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ background: "#d98629" }}
          >
            {saving ? <Loader2 size={11} className="animate-spin" /> : isEdit ? <Check size={11} /> : <Save size={11} />}
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </div>

      {/* Page content */}
      <div className="p-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Left column (2/3) ── */}
          <div className="xl:col-span-2 space-y-6">

            {/* Cover Image */}
            <SectionCard title="Cover Image">
              <div className="flex gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className={labelCls}>Paste image URL</label>
                    <input
                      className={inputCls}
                      value={form.coverImage}
                      onChange={(e) => set("coverImage", e.target.value)}
                      placeholder="https://…"
                    />
                  </div>
                  <div className="text-center text-slate-400 text-xs uppercase tracking-[0.15em]">or</div>
                  <CloudinaryUploader
                    resourceType="image"
                    folder="movico/projects"
                    label="Upload from device"
                    currentUrl={undefined}
                    onUpload={({ url, alt }) => { set("coverImage", url); if (alt) set("coverAlt", alt); }}
                  />
                  <div>
                    <label className={labelCls}>Cover image alt text <span className="text-amber-500">*SEO</span></label>
                    <input
                      className={inputCls}
                      value={form.coverAlt}
                      onChange={(e) => set("coverAlt", e.target.value)}
                      placeholder="e.g. LEAP Conference 2024 event coverage by Movico"
                    />
                  </div>
                </div>
                {form.coverImage && (
                  <div className="w-48 h-32 rounded-xl overflow-hidden bg-white/5 shrink-0 self-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.coverImage} alt="cover" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Basic Info */}
            <SectionCard title="Basic Info">
              <div>
                <label className={labelCls}>Title</label>
                <input
                  className={inputCls}
                  value={form.title}
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (!isEdit) set("slug", autoSlug(e.target.value));
                  }}
                  placeholder="LEAP Conference 2024"
                />
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input
                  className={inputCls}
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="leap-conference-2024"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Client</label>
                  <input className={inputCls} value={form.client} onChange={(e) => set("client", e.target.value)} placeholder="LEAP" />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <input className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Event Production" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Location</label>
                  <input className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Riyadh, Saudi Arabia" />
                </div>
                <div>
                  <label className={labelCls}>Year</label>
                  <input className={inputCls} value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2024" />
                </div>
              </div>
            </SectionCard>

            {/* Content */}
            <SectionCard title="Content">
              <div>
                <label className={labelCls}>Short Description</label>
                <textarea
                  className={inputCls}
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => set("shortDescription", e.target.value)}
                  placeholder="One-liner shown on the projects grid card…"
                />
              </div>
              <div>
                <label className={labelCls}>Full Description</label>
                <textarea
                  className={inputCls}
                  rows={6}
                  value={form.fullDescription}
                  onChange={(e) => set("fullDescription", e.target.value)}
                  placeholder="Detailed project story shown on the case study page…"
                />
              </div>
              <div>
                <label className={labelCls}>Result</label>
                <textarea
                  className={inputCls}
                  rows={3}
                  value={form.result}
                  onChange={(e) => set("result", e.target.value)}
                  placeholder="Key outcomes and metrics…"
                />
              </div>
            </SectionCard>

            {/* SEO */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setSeoOpen((v) => !v)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div>
                  <h3 className="text-slate-500 text-[11px] uppercase tracking-[0.2em] font-medium">SEO</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Override meta title, description &amp; OG image</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${seoOpen ? "rotate-180" : ""}`} />
              </button>

              {seoOpen && (
                <div className="px-6 pb-6 space-y-4 border-t border-slate-100">
                  {/* SERP Preview */}
                  <div className="mt-4 bg-slate-950 border border-slate-700 rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-3">Google Preview</p>
                    <div className="space-y-0.5">
                      <p className="text-[13px] leading-snug truncate" style={{ color: "#8ab4f8" }}>
                        {seo.title || (form.title ? `${form.title} — ${form.client} | Movico` : "Page title will appear here")}
                      </p>
                      <p className="text-[11px]" style={{ color: "#bdc1c6" }}>
                        movicoksa.com/projects/{form.slug || "slug"}
                      </p>
                      <p className="text-[12px] leading-relaxed line-clamp-2" style={{ color: "#bdc1c6", opacity: 0.75 }}>
                        {seo.description || form.shortDescription || "Meta description will appear here…"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>
                      SEO Title <span className={`ml-1 ${(seo.title || `${form.title} — ${form.client} | Movico`).length > 60 ? "text-red-400" : "text-slate-400"}`}>
                        {(seo.title || `${form.title} — ${form.client} | Movico`).length}/60
                      </span>
                    </label>
                    <input
                      className={inputCls}
                      value={seo.title}
                      onChange={(e) => setSeo("title", e.target.value)}
                      placeholder={form.title ? `${form.title} — ${form.client} | Movico` : "Leave blank to use default"}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      Meta Description <span className={`ml-1 ${(seo.description || form.shortDescription).length > 160 ? "text-red-400" : "text-slate-400"}`}>
                        {(seo.description || form.shortDescription).length}/160
                      </span>
                    </label>
                    <textarea
                      className={inputCls}
                      rows={3}
                      value={seo.description}
                      onChange={(e) => setSeo("description", e.target.value)}
                      placeholder={form.shortDescription || "Leave blank to use short description"}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>OG Image URL</label>
                    <input
                      className={inputCls}
                      value={seo.ogImage}
                      onChange={(e) => setSeo("ogImage", e.target.value)}
                      placeholder={form.coverImage || "Leave blank to use cover image"}
                    />
                    {(seo.ogImage || form.coverImage) && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 aspect-[1200/630] max-w-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={seo.ogImage || form.coverImage} alt="OG preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={labelCls}>Canonical URL</label>
                    <input
                      className={inputCls}
                      value={seo.canonical}
                      onChange={(e) => setSeo("canonical", e.target.value)}
                      placeholder={`https://movicoksa.com/projects/${form.slug || "slug"}`}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-slate-900 text-sm font-medium">No-index</p>
                      <p className="text-slate-400 text-xs mt-0.5">Hide this page from search engines</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSeo("noindex", !seo.noindex)}
                      className={`relative w-10 h-5 rounded-full transition-all duration-200 ${seo.noindex ? "bg-[#d98629]" : "bg-slate-200"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${seo.noindex ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery */}
            <SectionCard title="Gallery Images">
              <p className="text-slate-400 text-xs -mt-1">These appear in the image grid on the case study page.</p>

              {/* Upload button */}
              <CloudinaryUploader
                resourceType="image"
                folder="movico/projects"
                label="Upload image to gallery"
                currentUrl={undefined}
                onUpload={({ url }) => {
                  setImagesInput((prev) => {
                    const lines = prev.split("\n").map((l) => l.trim()).filter(Boolean);
                    return [...lines, url].join("\n");
                  });
                }}
              />

              {/* Paste URL */}
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  placeholder="Or paste an image URL and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (!val) return;
                      setImagesInput((prev) => {
                        const lines = prev.split("\n").map((l) => l.trim()).filter(Boolean);
                        return [...lines, val].join("\n");
                      });
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>

              {/* Visual grid of added images */}
              {imagesInput.trim() && (
                <div className="grid grid-cols-3 gap-2">
                  {imagesInput.split("\n").map((u) => u.trim()).filter(Boolean).map((url, i) => (
                    <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`gallery ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-200 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setImagesInput((prev) => {
                              const lines = prev.split("\n").map((l) => l.trim()).filter(Boolean);
                              lines.splice(i, 1);
                              return lines.join("\n");
                            });
                          }}
                          className="opacity-0 group-hover:opacity-100 w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-mono bg-black/60 text-slate-500 px-1.5 py-0.5 rounded-full">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* ── Right column (1/3) ── */}
          <div className="space-y-6">

            {/* Status */}
            <SectionCard title="Status">
              <Toggle
                on={form.visible}
                onToggle={() => set("visible", !form.visible)}
                label="Visible"
                sub="Show on the public projects page"
              />
              <div className="h-px bg-white/[0.05]" />
              <Toggle
                on={form.featured}
                onToggle={() => set("featured", !form.featured)}
                label="Show on Homepage"
                sub="Include this project in the homepage work showcase"
              />
            </SectionCard>

            {/* Meta */}
            <SectionCard title="Meta">
              <div>
                <label className={labelCls}>Project Number</label>
                <input className={inputCls} value={form.number} onChange={(e) => set("number", e.target.value)} placeholder="01" />
              </div>
              <div>
                <label className={labelCls}>Tags (comma-separated)</label>
                <input
                  className={inputCls}
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Event Production, Live Coverage"
                />
                {tagsInput.trim() && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tagsInput.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-[0.15em] border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>

          </div>
        </div>
      </div>
    </div>
  );
}
