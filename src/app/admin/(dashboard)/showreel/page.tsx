"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit2, Star, StarOff, Loader2,
  ChevronUp, ChevronDown, X, Save, Film, Database,
  Play, Cloud, HardDrive, Link as LinkIcon,
} from "lucide-react";
import { CloudinaryUploader } from "@/components/cms/CloudinaryUploader";

interface CMSVideo {
  _id: string;
  title: string;
  client?: string;
  category: string;
  isHighlight: boolean;
  order: number;
  source: "drive" | "cloudinary";
  driveId?: string;
  cloudinaryVideoPublicId?: string;
  cloudinaryVideoUrl?: string;
  thumbnail?: string;
}

const CATEGORIES = [
  "Event", "Corporate", "Commercial", "Brand Film",
  "Documentary", "Sport", "Showreel", "Portfolio", "Promo", "Other",
];

const blank: Omit<CMSVideo, "_id"> = {
  title: "", client: "", category: "Event", isHighlight: false, order: 0,
  source: "drive", driveId: "", cloudinaryVideoPublicId: "", cloudinaryVideoUrl: "", thumbnail: "",
};

function extractDriveId(input: string): string {
  // Accept full URL or bare ID
  const m = input.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  if (m) return m[1];
  // Also handle ?id= format
  const m2 = input.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (m2) return m2[1];
  return input.trim();
}

function thumb(v: CMSVideo) {
  if (v.thumbnail) return v.thumbnail;
  if (v.source === "drive" && v.driveId)
    return `https://drive.google.com/thumbnail?id=${v.driveId}&sz=w400-h225`;
  if (v.source === "cloudinary" && v.cloudinaryVideoPublicId)
    return `https://res.cloudinary.com/dm5c31z7w/video/upload/so_auto,w_400,h_225,c_fill,q_60/${v.cloudinaryVideoPublicId}.jpg`;
  return null;
}

/* ── Video Card ──────────────────────────────────────────────────────────── */
function VideoCard({
  video, onEdit, onDelete, onToggleHighlight, onMove, isFirst, isLast,
}: {
  video: CMSVideo;
  onEdit: (v: CMSVideo) => void;
  onDelete: (id: string) => void;
  onToggleHighlight: (v: CMSVideo) => void;
  onMove: (id: string, dir: "up" | "down") => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const t = thumb(video);

  return (
    <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col">
      {/* Thumbnail */}
      <div className="aspect-video relative bg-[#0f172a] overflow-hidden">
        {t && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center">
              <Play size={16} className="text-white/30 ml-0.5" fill="currentColor" />
            </div>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.15em]">No preview</p>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />

        {/* Source badge */}
        <div className={`absolute top-2.5 left-2.5 flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] font-semibold px-2 py-0.5 rounded-full ${
          video.source === "cloudinary" ? "bg-blue-500/90 text-white" : "bg-emerald-500/90 text-white"
        }`}>
          {video.source === "cloudinary" ? <Cloud size={8} /> : <HardDrive size={8} />}
          {video.source === "cloudinary" ? "Cloud" : "Drive"}
        </div>

        {/* Highlight star */}
        {video.isHighlight && (
          <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-[#d98629] rounded-full flex items-center justify-center shadow">
            <Star size={11} className="text-black" fill="currentColor" />
          </div>
        )}

        {/* Hover edit button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(video)}
            className="flex items-center gap-1.5 bg-white text-slate-900 text-xs font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-[#d98629] hover:text-black transition-all duration-150"
          >
            <Edit2 size={11} /> Edit
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="flex-1 px-3.5 py-3">
        {video.client && (
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-0.5" style={{ color: "#d98629" }}>
            {video.client}
          </p>
        )}
        <p className="text-slate-900 text-sm font-semibold leading-snug truncate">{video.title || "Untitled"}</p>
        <span className="inline-block mt-1.5 text-[9px] uppercase tracking-[0.12em] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {video.category}
        </span>
      </div>

      {/* Action bar */}
      <div className="border-t border-slate-100 px-3 py-2 flex items-center gap-1">
        <button
          onClick={() => onToggleHighlight(video)}
          className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg transition-colors ${
            video.isHighlight
              ? "bg-[#d98629]/10 text-[#d98629] hover:bg-[#d98629]/20"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          }`}
        >
          {video.isHighlight ? <Star size={10} fill="currentColor" /> : <StarOff size={10} />}
          <span className="hidden sm:inline">{video.isHighlight ? "Featured" : "Feature"}</span>
        </button>
        <div className="flex gap-0.5 ml-auto">
          <button onClick={() => onMove(video._id, "up")} disabled={isFirst} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
            <ChevronUp size={13} />
          </button>
          <button onClick={() => onMove(video._id, "down")} disabled={isLast} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
            <ChevronDown size={13} />
          </button>
          <button onClick={() => onDelete(video._id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Add / Edit Panel ────────────────────────────────────────────────────── */
function VideoPanel({
  initial, onSave, onClose, saving,
}: {
  initial: Omit<CMSVideo, "_id"> & { _id?: string };
  onSave: (data: Omit<CMSVideo, "_id"> & { _id?: string }) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  // Store the raw URL input separately for Drive
  const [driveUrlInput, setDriveUrlInput] = useState(
    initial.driveId
      ? `https://drive.google.com/file/d/${initial.driveId}/view`
      : ""
  );

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  function handleDriveInput(raw: string) {
    setDriveUrlInput(raw);
    const id = extractDriveId(raw);
    set("driveId", id);
  }

  const driveIdResolved = extractDriveId(driveUrlInput);
  const driveValid = driveIdResolved.length >= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[460px] h-full bg-white border-l border-slate-200 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="h-14 border-b border-slate-100 flex items-center px-5 justify-between shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Showreel</p>
            <h2 className="text-slate-900 font-bold text-sm leading-tight">{form._id ? "Edit Video" : "Add Video"}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-1.5">Title *</label>
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm focus:border-[#d98629]/60 focus:outline-none transition-colors"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. ESPORTS 2025"
              autoFocus
            />
          </div>

          {/* Client + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-1.5">Client</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm focus:border-[#d98629]/60 focus:outline-none transition-colors"
                value={form.client ?? ""}
                onChange={(e) => set("client", e.target.value)}
                placeholder="e.g. Movico"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-1.5">Category</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm focus:border-[#d98629]/60 focus:outline-none transition-colors"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5">
            <div>
              <p className="text-slate-900 text-sm font-medium">Featured Highlight</p>
              <p className="text-slate-400 text-xs mt-0.5">Shown in the Highlights section on the site</p>
            </div>
            <button
              type="button"
              onClick={() => set("isHighlight", !form.isHighlight)}
              className={`w-11 h-6 rounded-full transition-all duration-200 relative ${form.isHighlight ? "bg-[#d98629]" : "bg-slate-300"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${form.isHighlight ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          {/* Video source */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-2">Where is the video hosted?</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { key: "drive",      label: "Google Drive", sub: "Share link from Drive",  Icon: HardDrive },
                { key: "cloudinary", label: "Cloudinary",   sub: "Upload a video file",    Icon: Cloud     },
              ].map(({ key, label, sub, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("source", key)}
                  className={`flex flex-col items-start gap-1 px-3 py-3 rounded-xl border text-left transition-all ${
                    form.source === key
                      ? "border-[#d98629] bg-[#d98629]/8 text-slate-900"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={13} className={form.source === key ? "text-[#d98629]" : "text-slate-400"} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 pl-5">{sub}</span>
                </button>
              ))}
            </div>

            {form.source === "drive" ? (
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-1.5">
                  Google Drive Share Link
                </label>
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className={`w-full bg-slate-50 border rounded-lg pl-9 pr-3 py-2.5 text-slate-900 text-sm focus:outline-none transition-colors ${
                      driveUrlInput && !driveValid
                        ? "border-red-300 focus:border-red-400"
                        : driveValid
                        ? "border-emerald-300 focus:border-emerald-400"
                        : "border-slate-200 focus:border-[#d98629]/60"
                    }`}
                    value={driveUrlInput}
                    onChange={(e) => handleDriveInput(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view"
                  />
                </div>
                {/* Guidance */}
                <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                  <p className="text-[11px] font-semibold text-blue-700 mb-1">How to get the link:</p>
                  <ol className="text-[11px] text-blue-600 space-y-0.5 list-decimal list-inside">
                    <li>Open your video in Google Drive</li>
                    <li>Click the <strong>Share</strong> button → <strong>Copy link</strong></li>
                    <li>Paste the link here — we&apos;ll do the rest</li>
                  </ol>
                </div>
                {driveValid && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 font-bold text-[9px]">✓</span>
                    Link recognised · ID: <span className="font-mono text-slate-500">{driveIdResolved.slice(0, 12)}…</span>
                  </div>
                )}
              </div>
            ) : (
              <CloudinaryUploader
                resourceType="video"
                folder="movico/videos"
                label="Upload Video"
                currentUrl={form.cloudinaryVideoUrl}
                onUpload={({ url, publicId }) => {
                  set("cloudinaryVideoUrl", url);
                  set("cloudinaryVideoPublicId", publicId);
                }}
              />
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <CloudinaryUploader
              resourceType="image"
              folder="movico/thumbnails"
              label="Custom Thumbnail (optional — auto-generated if empty)"
              currentUrl={form.thumbnail}
              onUpload={({ url }) => set("thumbnail", url)}
            />
            {form.thumbnail && (
              <button type="button" onClick={() => set("thumbnail", "")} className="text-[10px] text-slate-400 hover:text-red-500 mt-1.5 transition-colors">
                Remove thumbnail
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="h-16 border-t border-slate-100 flex items-center px-5 gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 text-sm transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.title.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#d98629] hover:bg-[#c4771e] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-black font-bold text-sm transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving…" : "Save Video"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function ShowreelAdmin() {
  const [videos, setVideos]       = useState<CMSVideo[]>([]);
  const [loading, setLoading]     = useState(true);
  const [seeding, setSeeding]     = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing]     = useState<(Omit<CMSVideo, "_id"> & { _id?: string }) | null>(null);
  const [saving, setSaving]       = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/videos");
      if (res.ok) setVideos(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Build filter options from actual data
  const filters = useMemo(() => {
    const featured = videos.filter((v) => v.isHighlight);
    const cats = Array.from(new Set(videos.map((v) => v.category))).sort();
    return [
      { key: "all",      label: "All",      count: videos.length },
      { key: "featured", label: "⭐ Featured", count: featured.length },
      ...cats.map((cat) => ({
        key: cat,
        label: cat,
        count: videos.filter((v) => v.category === cat).length,
      })),
    ];
  }, [videos]);

  const displayed = useMemo(() => {
    if (activeFilter === "all")      return [...videos].sort((a, b) => a.order - b.order);
    if (activeFilter === "featured") return videos.filter((v) => v.isHighlight).sort((a, b) => a.order - b.order);
    return videos.filter((v) => v.category === activeFilter).sort((a, b) => a.order - b.order);
  }, [videos, activeFilter]);

  async function handleSeed() {
    if (!confirm("Import all static videos into MongoDB? Only runs if DB is empty.")) return;
    setSeeding(true);
    const res  = await fetch("/api/cms/seed-videos", { method: "POST" });
    const data = await res.json();
    if (data.skipped) toast.info(data.message);
    else { toast.success(`Seeded ${data.seeded} videos`); await load(); }
    setSeeding(false);
  }

  async function handleSave(form: Omit<CMSVideo, "_id"> & { _id?: string }) {
    setSaving(true);
    try {
      if (form._id) {
        await fetch(`/api/cms/videos/${form._id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
        });
        toast.success("Video updated");
      } else {
        await fetch("/api/cms/videos", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, order: videos.length }),
        });
        toast.success("Video added");
      }
      await load();
      setPanelOpen(false);
      setEditing(null);
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this video? This cannot be undone.")) return;
    await fetch(`/api/cms/videos/${id}`, { method: "DELETE" });
    toast.success("Video deleted");
    await load();
  }

  async function handleToggleHighlight(video: CMSVideo) {
    await fetch(`/api/cms/videos/${video._id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHighlight: !video.isHighlight }),
    });
    await load();
  }

  async function handleMove(id: string, dir: "up" | "down") {
    const idx     = displayed.findIndex((v) => v._id === id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= displayed.length) return;
    await Promise.all([
      fetch(`/api/cms/videos/${displayed[idx]._id}`,    { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: displayed[swapIdx].order }) }),
      fetch(`/api/cms/videos/${displayed[swapIdx]._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: displayed[idx].order }) }),
    ]);
    await load();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top bar */}
      <header className="h-14 border-b border-slate-200 flex items-center px-6 gap-4 shrink-0 bg-white">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Assets</p>
          <h1 className="text-slate-900 font-bold text-sm leading-tight">Showreel</h1>
        </div>
        <div className="hidden md:flex items-center gap-4 mr-2">
          <div className="text-center">
            <p className="text-slate-900 font-bold text-sm leading-none">{videos.length}</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Total</p>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="text-center">
            <p className="text-[#d98629] font-bold text-sm leading-none">{videos.filter((v) => v.isHighlight).length}</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Featured</p>
          </div>
        </div>
        <button
          onClick={handleSeed} disabled={seeding}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300 text-xs px-3 py-2 rounded-lg transition-all disabled:opacity-40"
        >
          {seeding ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
          Seed from code
        </button>
        <button
          onClick={() => { setEditing({ ...blank }); setPanelOpen(true); }}
          className="flex items-center gap-2 bg-[#d98629] hover:bg-[#c4771e] text-black font-bold text-xs px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={13} /> Add Video
        </button>
      </header>

      {/* Category filter bar */}
      <div className="border-b border-slate-200 bg-white px-6 py-3 overflow-x-auto shrink-0">
        <div className="flex gap-2 w-max">
          {filters.map(({ key, label, count }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-[#d98629] text-black shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                }`}
              >
                {label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-black/15 text-black" : "bg-white text-slate-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={20} className="animate-spin text-slate-400" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-center bg-white border border-slate-200 rounded-xl">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <Film size={22} className="text-slate-300" />
            </div>
            <div>
              <p className="text-slate-600 font-semibold text-sm">No videos{activeFilter !== "all" ? ` in "${activeFilter}"` : " yet"}</p>
              <p className="text-slate-400 text-xs mt-1 max-w-xs">
                {videos.length === 0 ? 'Click "Seed from code" to import, or add one manually.' : "Add a video or change the filter."}
              </p>
            </div>
            {videos.length === 0 && (
              <button
                onClick={() => { setEditing({ ...blank }); setPanelOpen(true); }}
                className="flex items-center gap-2 bg-[#d98629] text-black font-bold text-xs px-4 py-2.5 rounded-lg"
              >
                <Plus size={12} /> Add First Video
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayed.map((v, i) => (
              <VideoCard
                key={v._id}
                video={v}
                onEdit={(vid) => { setEditing(vid); setPanelOpen(true); }}
                onDelete={handleDelete}
                onToggleHighlight={handleToggleHighlight}
                onMove={handleMove}
                isFirst={i === 0}
                isLast={i === displayed.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {panelOpen && editing && (
        <VideoPanel
          initial={editing}
          onSave={handleSave}
          onClose={() => { setPanelOpen(false); setEditing(null); }}
          saving={saving}
        />
      )}
    </div>
  );
}
