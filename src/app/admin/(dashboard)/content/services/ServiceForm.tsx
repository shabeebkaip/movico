"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft, Save, Check, Loader2, Trash2, ExternalLink,
  Plus, ChevronDown, ChevronRight, Film, Play,
} from "lucide-react";
import { CloudinaryUploader, type UploadResult } from "@/components/cms/CloudinaryUploader";
import type { GalleryItem } from "@/lib/cms/services";

interface CMSService {
  _id?: string;
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  heroTagline: string;
  heroImage?: string;
  overview: string;
  offerings: { title: string; description: string }[];
  process: { step: string; title: string; description: string }[];
  stats?: { value: string; label: string }[];
  gallery?: GalleryItem[];
  icon: string;
  order: number;
  visible: boolean;
}

const ICON_OPTIONS = ["Video", "CalendarDays", "Layers", "LayoutGrid", "Sofa", "Share2", "Camera", "Clapperboard"];

const BLANK: Omit<CMSService, "_id"> = {
  slug: "", number: "", title: "", shortDescription: "", longDescription: "",
  tags: [], heroTagline: "", heroImage: "", overview: "", offerings: [], process: [],
  stats: [], gallery: [],
  icon: ICON_OPTIONS[0], order: 0, visible: true,
};

const inputCls =
  "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:border-[#d98629] focus:outline-none transition-colors placeholder:text-slate-400";
const labelCls = "block text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-1.5";
const addBtnCls = "w-full mt-2 flex items-center justify-center gap-2 border border-slate-200 text-slate-500 text-xs rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-700 transition-all";

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
        className={`relative w-10 h-5 rounded-full transition-all duration-200 ${on ? "bg-[#d98629]" : "bg-slate-200"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${on ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SectionCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <div>
        <h3 className="text-slate-500 text-[11px] uppercase tracking-[0.2em] font-medium">{title}</h3>
        {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export default function ServiceForm({ initialData, serviceId, defaultOrder }: { initialData?: CMSService; serviceId?: string; defaultOrder?: number }) {
  const router = useRouter();
  const isEdit = !!serviceId;
  const [form, setForm] = useState<Omit<CMSService, "_id">>(initialData ? {
    slug: initialData.slug, number: initialData.number, title: initialData.title,
    shortDescription: initialData.shortDescription, longDescription: initialData.longDescription,
    tags: initialData.tags, heroTagline: initialData.heroTagline, heroImage: initialData.heroImage ?? "",
    overview: initialData.overview, offerings: initialData.offerings, process: initialData.process,
    stats: initialData.stats ?? [], gallery: initialData.gallery ?? [],
    icon: initialData.icon, order: initialData.order, visible: initialData.visible,
  } : { ...BLANK, order: defaultOrder ?? BLANK.order });
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [expandedOffering, setExpandedOffering] = useState<number | null>(null);
  const [expandedProcess, setExpandedProcess] = useState<number | null>(null);
  const [expandedStat, setExpandedStat] = useState<number | null>(null);

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // CloudinaryUploader fires onUpload TWICE for a video (Bunny result first,
  // then a Cloudinary-backup merge shortly after) — use a functional update
  // keyed on bunnyVideoId so the second call updates the same gallery item
  // instead of appending a duplicate, regardless of any renders in between.
  function upsertGalleryVideo(result: UploadResult) {
    setForm((prev) => {
      const gallery = prev.gallery ?? [];
      const idx = result.bunnyVideoId
        ? gallery.findIndex((g) => g.type === "video" && g.bunnyVideoId === result.bunnyVideoId)
        : -1;
      if (idx >= 0) {
        const next = [...gallery];
        const prevItem = next[idx];
        if (prevItem.type === "video") {
          next[idx] = { ...prevItem, cloudinaryVideoUrl: result.cloudinaryVideoUrl, cloudinaryPublicId: result.cloudinaryPublicId };
        }
        return { ...prev, gallery: next };
      }
      const item: GalleryItem = {
        type: "video",
        url: result.url,
        bunnyVideoId: result.bunnyVideoId,
        thumbnailUrl: result.thumbnailUrl,
        cloudinaryVideoUrl: result.cloudinaryVideoUrl,
        cloudinaryPublicId: result.cloudinaryPublicId,
      };
      return { ...prev, gallery: [...gallery, item] };
    });
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
    };
    try {
      const res = isEdit
        ? await fetch(`/api/cms/services/${serviceId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/cms/services", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (res.ok) {
        toast.success(isEdit ? "Service updated" : "Service created");
        router.push("/admin/content/services");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to save");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEdit || !confirm(`Delete "${form.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/cms/services/${serviceId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Service deleted");
        router.push("/admin/content/services");
      } else {
        toast.error("Failed to delete");
      }
    } finally {
      setDeleting(false);
    }
  }

  const gallery = form.gallery ?? [];
  const stats = form.stats ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/content/services")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs uppercase tracking-[0.15em] transition-colors"
          >
            <ArrowLeft size={13} />
            Services
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 text-sm truncate max-w-xs">
            {form.title || (isEdit ? "Edit Service" : "New Service")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && form.slug && (
            <a
              href={`/services/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-900 text-xs uppercase tracking-[0.12em] px-3 py-2 rounded-lg hover:bg-slate-100 transition-all"
            >
              <ExternalLink size={11} />
              View
            </a>
          )}
          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 text-xs uppercase tracking-[0.12em] px-3 py-2 rounded-lg hover:bg-red-50 transition-all disabled:opacity-40"
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
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Service"}
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Left column (2/3) ── */}
          <div className="xl:col-span-2 space-y-6">

            {/* Hero Image */}
            <SectionCard title="Hero Image">
              <div className="flex gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className={labelCls}>Paste image URL</label>
                    <input
                      className={inputCls}
                      value={form.heroImage}
                      onChange={(e) => set("heroImage", e.target.value)}
                      placeholder="https://…"
                    />
                  </div>
                  <div className="text-center text-slate-400 text-xs uppercase tracking-[0.15em]">or</div>
                  <CloudinaryUploader
                    resourceType="image"
                    folder="movico/services"
                    label="Upload from device"
                    currentUrl={undefined}
                    onUpload={({ url }) => set("heroImage", url)}
                  />
                </div>
                {form.heroImage && (
                  <div className="w-48 h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0 self-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.heroImage} alt="hero" className="w-full h-full object-cover" />
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
                  placeholder="Video Production"
                />
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input
                  className={inputCls}
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="video-production"
                />
              </div>
              <div>
                <label className={labelCls}>Hero Tagline</label>
                <input
                  className={inputCls}
                  value={form.heroTagline}
                  onChange={(e) => set("heroTagline", e.target.value)}
                  placeholder="Every frame, a statement."
                />
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
                  placeholder="One-liner shown on the services grid card…"
                />
              </div>
              <div>
                <label className={labelCls}>Long Description</label>
                <textarea
                  className={inputCls}
                  rows={4}
                  value={form.longDescription}
                  onChange={(e) => set("longDescription", e.target.value)}
                  placeholder="Detailed description shown on the service page…"
                />
              </div>
              <div>
                <label className={labelCls}>Overview</label>
                <textarea
                  className={inputCls}
                  rows={5}
                  value={form.overview}
                  onChange={(e) => set("overview", e.target.value)}
                  placeholder="Overview copy for the service page…"
                />
              </div>
            </SectionCard>

            {/* Offerings */}
            <SectionCard title="Offerings" sub="What's included in this service">
              <div className="space-y-1.5">
                {form.offerings.map((item, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedOffering(expandedOffering === i ? null : i)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left transition-colors"
                    >
                      <span className="text-[10px] text-[#d98629]/70 font-mono w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <p className="text-slate-700 text-xs flex-1 truncate">{item.title || "Untitled offering"}</p>
                      {expandedOffering === i ? <ChevronDown size={12} className="text-slate-400 shrink-0" /> : <ChevronRight size={12} className="text-slate-400 shrink-0" />}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); set("offerings", form.offerings.filter((_, idx) => idx !== i)); }}
                        className="text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={11} />
                      </button>
                    </button>
                    {expandedOffering === i && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-3 bg-slate-50">
                        <div>
                          <label className={labelCls}>Title</label>
                          <input
                            className={inputCls}
                            value={item.title}
                            onChange={(e) => { const n = [...form.offerings]; n[i] = { ...n[i], title: e.target.value }; set("offerings", n); }}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Description</label>
                          <textarea
                            className={inputCls}
                            rows={2}
                            value={item.description}
                            onChange={(e) => { const n = [...form.offerings]; n[i] = { ...n[i], description: e.target.value }; set("offerings", n); }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => { set("offerings", [...form.offerings, { title: "", description: "" }]); setExpandedOffering(form.offerings.length); }}
                className={addBtnCls}
              >
                <Plus size={12} /> Add Offering
              </button>
            </SectionCard>

            {/* Process */}
            <SectionCard title="Process" sub="Step-by-step workflow shown on the service page">
              <div className="space-y-1.5">
                {form.process.map((item, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedProcess(expandedProcess === i ? null : i)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left transition-colors"
                    >
                      <span className="text-[10px] text-[#d98629]/70 font-mono w-6 shrink-0">{item.step || String(i + 1).padStart(2, "0")}</span>
                      <p className="text-slate-700 text-xs flex-1 truncate">{item.title || "Untitled step"}</p>
                      {expandedProcess === i ? <ChevronDown size={12} className="text-slate-400 shrink-0" /> : <ChevronRight size={12} className="text-slate-400 shrink-0" />}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); set("process", form.process.filter((_, idx) => idx !== i)); }}
                        className="text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={11} />
                      </button>
                    </button>
                    {expandedProcess === i && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-3 bg-slate-50">
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className={labelCls}>Step</label>
                            <input
                              className={inputCls}
                              value={item.step}
                              onChange={(e) => { const n = [...form.process]; n[i] = { ...n[i], step: e.target.value }; set("process", n); }}
                              placeholder="01"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className={labelCls}>Title</label>
                            <input
                              className={inputCls}
                              value={item.title}
                              onChange={(e) => { const n = [...form.process]; n[i] = { ...n[i], title: e.target.value }; set("process", n); }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Description</label>
                          <textarea
                            className={inputCls}
                            rows={2}
                            value={item.description}
                            onChange={(e) => { const n = [...form.process]; n[i] = { ...n[i], description: e.target.value }; set("process", n); }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => { set("process", [...form.process, { step: String(form.process.length + 1).padStart(2, "0"), title: "", description: "" }]); setExpandedProcess(form.process.length); }}
                className={addBtnCls}
              >
                <Plus size={12} /> Add Step
              </button>
            </SectionCard>

            {/* Stats */}
            <SectionCard title="Stats" sub="Optional — shown as highlight numbers on the service page">
              <div className="space-y-1.5">
                {stats.map((item, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedStat(expandedStat === i ? null : i)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left transition-colors"
                    >
                      <span className="text-[10px] text-[#d98629]/70 font-mono w-10 shrink-0 truncate">{item.value || "—"}</span>
                      <p className="text-slate-700 text-xs flex-1 truncate">{item.label || "Untitled stat"}</p>
                      {expandedStat === i ? <ChevronDown size={12} className="text-slate-400 shrink-0" /> : <ChevronRight size={12} className="text-slate-400 shrink-0" />}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); set("stats", stats.filter((_, idx) => idx !== i)); }}
                        className="text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={11} />
                      </button>
                    </button>
                    {expandedStat === i && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-100 grid grid-cols-2 gap-3 bg-slate-50">
                        <div>
                          <label className={labelCls}>Value</label>
                          <input
                            className={inputCls}
                            value={item.value}
                            onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], value: e.target.value }; set("stats", n); }}
                            placeholder="200+"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Label</label>
                          <input
                            className={inputCls}
                            value={item.label}
                            onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], label: e.target.value }; set("stats", n); }}
                            placeholder="Videos Produced"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => { set("stats", [...stats, { value: "", label: "" }]); setExpandedStat(stats.length); }}
                className={addBtnCls}
              >
                <Plus size={12} /> Add Stat
              </button>
            </SectionCard>

            {/* Gallery */}
            <SectionCard title="Gallery" sub="Images and videos shown in the gallery on the service page.">
              <div className="grid grid-cols-2 gap-3">
                <CloudinaryUploader
                  resourceType="image"
                  folder="movico/services"
                  label="Add Image"
                  currentUrl={undefined}
                  onUpload={({ url }) => set("gallery", [...gallery, { type: "image", url }])}
                />
                <CloudinaryUploader
                  resourceType="video"
                  folder="movico/services"
                  label="Add Video"
                  currentUrl={undefined}
                  onUpload={upsertGalleryVideo}
                />
              </div>

              <div className="flex gap-2">
                <input
                  className={inputCls}
                  placeholder="Or paste an image URL and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (!val) return;
                      set("gallery", [...gallery, { type: "image", url: val }]);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>

              {gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {gallery.map((item, i) => {
                    const thumb = item.type === "video" ? item.thumbnailUrl : item.url;
                    return (
                      <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt={`gallery ${i + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200">
                            <Film size={20} className="text-slate-400" />
                          </div>
                        )}
                        {item.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                            <div className="w-8 h-8 rounded-full bg-black/60 border border-white/30 flex items-center justify-center">
                              <Play size={13} fill="white" className="text-white ml-0.5" />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-200 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => set("gallery", gallery.filter((_, idx) => idx !== i))}
                            className="opacity-0 group-hover:opacity-100 w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <span className="absolute top-1.5 left-1.5 text-[9px] font-mono bg-black/60 text-white/80 px-1.5 py-0.5 rounded-full">
                          {i + 1}
                        </span>
                      </div>
                    );
                  })}
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
                sub="Show on the public services page"
              />
            </SectionCard>

            {/* Meta */}
            <SectionCard title="Meta">
              <div>
                <label className={labelCls}>Service Number</label>
                <input className={inputCls} value={form.number} onChange={(e) => set("number", e.target.value)} placeholder="01" />
              </div>
              <div>
                <label className={labelCls}>Icon</label>
                <select
                  className={inputCls}
                  value={form.icon}
                  onChange={(e) => set("icon", e.target.value)}
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Order</label>
                <input
                  type="number"
                  className={inputCls}
                  value={form.order}
                  onChange={(e) => set("order", Number(e.target.value))}
                />
              </div>
              <div>
                <label className={labelCls}>Tags (comma-separated)</label>
                <input
                  className={inputCls}
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Brand Films, Commercials"
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
