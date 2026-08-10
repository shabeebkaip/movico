"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit2, Star, StarOff, Loader2,
  ChevronUp, ChevronDown, X, Save, Film,
  Play, Cloud, Zap,
} from "lucide-react";
import { CloudinaryUploader } from "@/components/cms/CloudinaryUploader";

interface CMSVideo {
  _id: string;
  title: string;
  client?: string;
  category: string;
  isHighlight: boolean;
  order: number;
  cloudinaryVideoPublicId?: string;
  cloudinaryVideoUrl?: string;
  bunnyVideoId?: string;
  thumbnail?: string;
}

const CATEGORIES = [
  "Event", "Corporate", "Commercial", "Brand Film",
  "Documentary", "Sport", "Showreel", "Portfolio", "Promo", "Other",
];

const blank: Omit<CMSVideo, "_id"> = {
  title: "", client: "", category: "Event", isHighlight: false, order: 0,
  cloudinaryVideoPublicId: "", cloudinaryVideoUrl: "", thumbnail: "",
};

function thumb(v: CMSVideo) {
  if (v.thumbnail) return v.thumbnail;
  if (v.cloudinaryVideoUrl) {
    return v.cloudinaryVideoUrl
      .replace("/upload/", "/upload/so_auto,w_400,h_225,c_fill,q_60/")
      .replace(/\.[a-zA-Z0-9]+(\?.*)?$/, ".jpg");
  }
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
  const MAX_THUMB_RETRIES = 8; // backoff caps at 8s/retry, well under the 90s test window
  const [thumbRetry, setThumbRetry] = useState(0);
  const [thumbFailed, setThumbFailed] = useState(false);
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = thumb(video);

  useEffect(() => {
    return () => {
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
  }, []);

  const handleThumbError = () => {
    // functional update reads the latest retry count, avoiding a stale
    // closure if multiple onError events fire in quick succession
    setThumbRetry((n) => {
      if (n >= MAX_THUMB_RETRIES) {
        setThumbFailed(true);
        return n;
      }
      const delay = Math.min(2000 * 2 ** n, 8000);
      retryTimeout.current = setTimeout(() => setThumbRetry((cur) => cur + 1), delay);
      return n;
    });
  };

  const thumbSrc = t ? `${t}${t.includes("?") ? "&" : "?"}r=${thumbRetry}` : null;

  return (
    <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col">
      {/* Thumbnail */}
      <div className="aspect-video relative bg-[#0f172a] overflow-hidden">
        {thumbSrc && !thumbFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbSrc}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleThumbError}
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
        <div className={`absolute top-2.5 left-2.5 flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] font-semibold px-2 py-0.5 rounded-full text-white ${video.bunnyVideoId ? "bg-orange-500/90" : "bg-blue-500/90"}`}>
          {video.bunnyVideoId ? <><Zap size={8} /> Bunny</> : <><Cloud size={8} /> Cloud</>}
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
  const [videoUploadStatus, setVideoUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

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

          {/* Video source — new uploads go to Bunny Stream */}
          <div>
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-2">
              <Zap size={11} /> Video file
            </label>
            <CloudinaryUploader
              resourceType="video"
              folder="movico/videos"
              label="Upload Video"
              currentUrl={form.cloudinaryVideoUrl}
              onStatusChange={setVideoUploadStatus}
              onUpload={({ bunnyVideoId, thumbnailUrl }) => {
                // New video uploads land on Bunny only (no dual-write) — clear
                // any stale Cloudinary pointers so the record's source of truth
                // is unambiguous.
                set("bunnyVideoId", bunnyVideoId);
                set("cloudinaryVideoUrl", "");
                set("cloudinaryVideoPublicId", "");
                setForm((prev) => (prev.thumbnail ? prev : { ...prev, thumbnail: thumbnailUrl ?? prev.thumbnail }));
              }}
            />
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
            disabled={saving || !form.title.trim() || videoUploadStatus === "uploading"}
            title={videoUploadStatus === "uploading" ? "Wait for the video upload to finish" : undefined}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#d98629] hover:bg-[#c4771e] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-black font-bold text-sm transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving…" : videoUploadStatus === "uploading" ? "Uploading video…" : "Save Video"}
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
                {videos.length === 0 ? "Add your first video to get started." : "Add a video or change the filter."}
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
