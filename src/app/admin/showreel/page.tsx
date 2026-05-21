"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit2, Star, StarOff, Loader2,
  ChevronUp, ChevronDown, X, Save, Film, Database, Play,
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

const CATEGORIES = ["Event", "Corporate", "Commercial", "Brand Film", "Documentary", "Sport", "Showreel", "Portfolio", "Promo", "Other"];

const blank: Omit<CMSVideo, "_id"> = {
  title: "",
  client: "",
  category: "Event",
  isHighlight: false,
  order: 0,
  source: "drive",
  driveId: "",
  cloudinaryVideoPublicId: "",
  cloudinaryVideoUrl: "",
  thumbnail: "",
};

function thumb(v: CMSVideo) {
  if (v.thumbnail) return v.thumbnail;
  if (v.source === "drive" && v.driveId) return `https://drive.google.com/thumbnail?id=${v.driveId}&sz=w400-h225`;
  if (v.source === "cloudinary" && v.cloudinaryVideoPublicId) {
    return `https://res.cloudinary.com/dm5c31z7w/video/upload/so_auto,w_400,h_225,c_fill,q_60/${v.cloudinaryVideoPublicId}.jpg`;
  }
  return null;
}

/* ── Video Card ──────────────────────────────────────── */
function VideoCard({
  video,
  onEdit,
  onDelete,
  onToggleHighlight,
  onMove,
  isFirst,
  isLast,
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
    <div className="group relative bg-[#111111] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.12] transition-all duration-200">
      {/* Thumbnail */}
      <div className="aspect-video relative bg-[#0a0a0a]">
        {t && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t} alt={video.title} className="w-full h-full object-cover" onError={() => setImgFailed(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play size={24} className="text-white/10" />
          </div>
        )}
        {/* Source badge */}
        <span className={`absolute top-2 left-2 text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full font-medium ${
          video.source === "cloudinary" ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"
        }`}>
          {video.source === "cloudinary" ? "Cloudinary" : "Drive"}
        </span>
        {/* Category */}
        <span className="absolute top-2 right-2 text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-black/60 text-white/50">
          {video.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        {video.client && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#d98629]/70 mb-0.5">{video.client}</p>
        )}
        <p className="text-white text-sm font-semibold leading-tight truncate">{video.title}</p>
      </div>

      {/* Actions — visible on hover */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(video)}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-[11px] transition-colors"
        >
          <Edit2 size={10} /> Edit
        </button>
        <button
          onClick={() => onToggleHighlight(video)}
          title={video.isHighlight ? "Remove from Highlights" : "Make Highlight"}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
            video.isHighlight
              ? "bg-[#d98629]/20 text-[#d98629] hover:bg-[#d98629]/30"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          {video.isHighlight ? <Star size={10} fill="currentColor" /> : <StarOff size={10} />}
          {video.isHighlight ? "Featured" : "Feature"}
        </button>
        <div className="flex gap-0.5 ml-auto">
          <button
            onClick={() => onMove(video._id, "up")}
            disabled={isFirst}
            className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronUp size={12} />
          </button>
          <button
            onClick={() => onMove(video._id, "down")}
            disabled={isLast}
            className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown size={12} />
          </button>
          <button
            onClick={() => onDelete(video._id)}
            className="w-6 h-6 bg-red-500/10 hover:bg-red-500/25 rounded flex items-center justify-center text-red-400 transition-colors"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Add / Edit Panel ────────────────────────────────── */
function VideoPanel({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial: Omit<CMSVideo, "_id"> & { _id?: string };
  onSave: (data: Omit<CMSVideo, "_id"> & { _id?: string }) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[480px] h-full bg-[#0f0f0f] border-l border-white/[0.08] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="h-14 border-b border-white/[0.06] flex items-center px-5 justify-between shrink-0">
          <h2 className="text-white font-semibold text-sm">{form._id ? "Edit Video" : "Add Video"}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Title *</label>
            <input
              className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#d98629]/50 focus:outline-none"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="ESPORTS 2025"
            />
          </div>

          {/* Client + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Client</label>
              <input
                className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#d98629]/50 focus:outline-none"
                value={form.client ?? ""}
                onChange={(e) => set("client", e.target.value)}
                placeholder="Movico"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Category</label>
              <select
                className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#d98629]/50 focus:outline-none"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Is Highlight */}
          <div className="flex items-center justify-between bg-[#1a1a1a] rounded-lg px-4 py-3">
            <div>
              <p className="text-white text-sm font-medium">Featured Highlight</p>
              <p className="text-white/40 text-xs mt-0.5">Shows in the top Highlights row</p>
            </div>
            <button
              type="button"
              onClick={() => set("isHighlight", !form.isHighlight)}
              className={`w-11 h-6 rounded-full transition-all duration-200 relative ${form.isHighlight ? "bg-[#d98629]" : "bg-white/10"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${form.isHighlight ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          {/* Video Source */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-2">Video Source</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => set("source", "drive")}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                  form.source === "drive"
                    ? "border-[#d98629] bg-[#d98629]/10 text-white"
                    : "border-white/[0.08] text-white/40 hover:border-white/20"
                }`}
              >
                <Database size={14} /> Google Drive
              </button>
              <button
                type="button"
                onClick={() => set("source", "cloudinary")}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                  form.source === "cloudinary"
                    ? "border-[#d98629] bg-[#d98629]/10 text-white"
                    : "border-white/[0.08] text-white/40 hover:border-white/20"
                }`}
              >
                <Film size={14} /> Cloudinary
              </button>
            </div>

            {form.source === "drive" ? (
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Google Drive File ID</label>
                <input
                  className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:border-[#d98629]/50 focus:outline-none"
                  value={form.driveId ?? ""}
                  onChange={(e) => set("driveId", e.target.value)}
                  placeholder="1R4ByejlmrlOI4HK2BLB-w9Xh6J2soDtZ"
                />
                <p className="text-[10px] text-white/25 mt-1">From the Drive share link: drive.google.com/file/d/<strong>FILE_ID</strong>/view</p>
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
              label="Thumbnail (optional — auto-generated if empty)"
              currentUrl={form.thumbnail}
              onUpload={({ url }) => set("thumbnail", url)}
            />
            {form.thumbnail && (
              <button
                type="button"
                onClick={() => set("thumbnail", "")}
                className="text-[10px] text-white/30 hover:text-red-400 mt-1 transition-colors"
              >
                Remove thumbnail
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="h-16 border-t border-white/[0.06] flex items-center px-5 gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-white/[0.08] rounded-lg text-white/50 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.title}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#d98629] hover:bg-[#c4771e] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-black font-semibold text-sm transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving…" : "Save Video"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────── */
export default function ShowreelAdmin() {
  const [videos, setVideos] = useState<CMSVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<(Omit<CMSVideo, "_id"> & { _id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"highlights" | "all">("highlights");

  const load = useCallback(async () => {
    const res = await fetch("/api/cms/videos");
    if (res.ok) setVideos(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const highlights = videos.filter((v) => v.isHighlight).sort((a, b) => a.order - b.order);
  const works = videos.filter((v) => !v.isHighlight).sort((a, b) => a.order - b.order);
  const displayed = activeTab === "highlights" ? highlights : works;

  async function handleSeed() {
    if (!confirm("This will import all videos from the static code into MongoDB. Only runs if DB is empty. Continue?")) return;
    setSeeding(true);
    const res = await fetch("/api/cms/seed-videos", { method: "POST" });
    const data = await res.json();
    if (data.skipped) {
      toast.info(data.message);
    } else {
      toast.success(`Seeded ${data.seeded} videos into MongoDB`);
      await load();
    }
    setSeeding(false);
  }

  async function handleSave(form: Omit<CMSVideo, "_id"> & { _id?: string }) {
    setSaving(true);
    try {
      if (form._id) {
        await fetch(`/api/cms/videos/${form._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Video updated");
      } else {
        const nextOrder = (activeTab === "highlights" ? highlights : works).length;
        await fetch("/api/cms/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, order: nextOrder }),
        });
        toast.success("Video added");
      }
      await load();
      setPanelOpen(false);
      setEditing(null);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this video? This cannot be undone.")) return;
    await fetch(`/api/cms/videos/${id}`, { method: "DELETE" });
    toast.success("Video deleted");
    await load();
  }

  async function handleToggleHighlight(video: CMSVideo) {
    await fetch(`/api/cms/videos/${video._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHighlight: !video.isHighlight }),
    });
    await load();
  }

  async function handleMove(id: string, dir: "up" | "down") {
    const list = activeTab === "highlights" ? highlights : works;
    const idx = list.findIndex((v) => v._id === id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return;

    await Promise.all([
      fetch(`/api/cms/videos/${list[idx]._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: list[swapIdx].order }),
      }),
      fetch(`/api/cms/videos/${list[swapIdx]._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: list[idx].order }),
      }),
    ]);
    await load();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Top bar */}
      <header className="h-14 border-b border-white/[0.06] flex items-center px-6 gap-4 shrink-0 bg-[#0a0a0a]">
        <div className="flex-1">
          <h1 className="text-white font-semibold text-sm">Showreel Manager</h1>
          <p className="text-white/30 text-[10px]">{videos.length} videos total</p>
        </div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="flex items-center gap-2 text-white/50 hover:text-white border border-white/[0.08] hover:border-white/20 text-xs px-3 py-2 rounded-lg transition-all disabled:opacity-40"
        >
          {seeding ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
          Seed from code
        </button>
        <button
          onClick={() => {
            setEditing({ ...blank, isHighlight: activeTab === "highlights" });
            setPanelOpen(true);
          }}
          className="flex items-center gap-2 bg-[#d98629] hover:bg-[#c4771e] text-black font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={14} /> Add Video
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/[0.06] px-6 flex gap-1 shrink-0 bg-[#0a0a0a]">
        {[
          { key: "highlights", label: "Highlights", count: highlights.length },
          { key: "all", label: "Video Works", count: works.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as "highlights" | "all")}
            className={`flex items-center gap-2 px-4 py-3 text-xs border-b-2 transition-all ${
              activeTab === key
                ? "border-[#d98629] text-white"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            {label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === key ? "bg-[#d98629]/20 text-[#d98629]" : "bg-white/[0.06] text-white/30"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={20} className="animate-spin text-white/30" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Film size={32} className="text-white/10" />
            <div className="text-center">
              <p className="text-white/30 text-sm">No videos yet</p>
              <p className="text-white/20 text-xs mt-1">
                {videos.length === 0 ? "Click \"Seed from code\" to import existing videos, or add one manually." : "Add a video or move one here."}
              </p>
            </div>
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

      {/* Panel */}
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
