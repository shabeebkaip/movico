"use client";

import { useEffect, useState } from "react";
import { CloudinaryUploader } from "@/components/cms/CloudinaryUploader";
import { Copy, CheckCircle2, Film, ImageIcon, Trash2, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface UploadedItem {
  id: string;
  url: string;
  publicId: string;
  type: "image" | "video";
  alt: string;
  uploadedAt: string;
}

function AltInput({ id, initial }: { id: string; initial: string }) {
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (value === initial) return;
    setSaving(true);
    await fetch("/api/cms/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, alt: value }),
    });
    setSaving(false);
    toast.success("Alt text saved");
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-[0.1em] text-slate-400 font-medium">Alt text</label>
        {saving && <Loader2 size={9} className="text-slate-400 animate-spin" />}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        placeholder="Describe this image…"
        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
      />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-500 hover:text-slate-700 transition-all"
    >
      {copied ? <CheckCircle2 size={10} className="text-green-500" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy URL"}
    </button>
  );
}

export default function MediaLibrary() {
  const [items, setItems] = useState<UploadedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function loadAssets() {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/media");
      if (res.ok) setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAssets(); }, []);

  function onUploaded(url: string, publicId: string, type: "image" | "video") {
    // Optimistic prepend — the API also saves it via CloudinaryUploader
    setItems((prev) => {
      if (prev.some((i) => i.id === publicId)) return prev;
      return [{ id: publicId, url, publicId, type, alt: "", uploadedAt: new Date().toISOString() }, ...prev];
    });
    toast.success(`${type === "image" ? "Image" : "Video"} uploaded`);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const res = await fetch(`/api/cms/media?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((p) => p.filter((x) => x.id !== id));
      toast.success("Asset removed");
    } else {
      toast.error("Failed to delete");
    }
    setDeleting(null);
  }

  const filtered = items.filter((i) => filter === "all" || i.type === filter);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6 shrink-0">
        <div className="flex-1">
          <h1 className="text-slate-900 font-semibold text-sm">Media Library</h1>
          <p className="text-slate-400 text-[10px]">All uploaded assets — reuse across any content field</p>
        </div>
        <button
          onClick={loadAssets}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left — uploaders */}
        <div className="w-72 shrink-0 border-r border-slate-200 p-5 space-y-6 overflow-y-auto bg-white">
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-400 mb-3">Upload Image</p>
            <CloudinaryUploader
              resourceType="image"
              folder="movico/media"
              label=""
              showLibraryPicker={false}
              onUpload={({ url, publicId }) => onUploaded(url, publicId, "image")}
            />
          </div>

          <div className="border-t border-slate-200 pt-6">
            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-400 mb-3">Upload Video</p>
            <CloudinaryUploader
              resourceType="video"
              folder="movico/videos"
              label=""
              showLibraryPicker={false}
              onUpload={({ url, publicId }) => onUploaded(url, publicId, "video")}
            />
          </div>

          <div className="border-t border-slate-200 pt-5">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-slate-500 space-y-1.5">
              <p className="font-semibold text-blue-700 mb-2">How to use</p>
              <p>1. Upload a file here</p>
              <p>2. It appears in every image/video field across the CMS</p>
              <p>3. Click <strong>"Choose from Media Library"</strong> in any upload field to pick it</p>
            </div>
          </div>
        </div>

        {/* Right — asset grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 mb-5">
            {(["all", "image", "video"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                  filter === f
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                {f === "all" ? `All (${items.length})` : f === "image" ? `Images (${items.filter(i => i.type === "image").length})` : `Videos (${items.filter(i => i.type === "video").length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loader2 size={20} className="text-slate-400 animate-spin" />
              <span className="text-sm text-slate-400">Loading assets…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                <ImageIcon size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm">No assets yet</p>
              <p className="text-slate-400 text-xs max-w-xs">
                Upload images or videos using the panel on the left. They'll appear here and become available in all content editors.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden group hover:border-slate-300 hover:shadow-sm transition-all">
                  {/* Preview */}
                  <div className="aspect-video relative bg-slate-100">
                    {item.type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.alt || item.publicId} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-800">
                        <Film size={24} className="text-slate-400" />
                        <span className="text-[10px] text-slate-400">Video</span>
                      </div>
                    )}
                    <span className={`absolute top-2 left-2 text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full font-medium ${
                      item.type === "image"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      {item.type}
                    </span>
                  </div>

                  {/* Meta + actions */}
                  <div className="p-3 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-slate-400 font-mono truncate flex-1">{item.publicId.split("/").pop()}</p>
                      {item.type === "image" && !item.alt && (
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.1em] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                          <AlertTriangle size={8} />
                          No alt
                        </span>
                      )}
                    </div>

                    {item.type === "image" && (
                      <AltInput id={item.id} initial={item.alt ?? ""} />
                    )}

                    <div className="flex items-center gap-2">
                      <CopyButton text={item.url} />
                      <button
                        disabled={deleting === item.id}
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-[10px] text-red-400 hover:text-red-600 transition-all disabled:opacity-50"
                      >
                        {deleting === item.id
                          ? <Loader2 size={10} className="animate-spin" />
                          : <Trash2 size={10} />
                        }
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
