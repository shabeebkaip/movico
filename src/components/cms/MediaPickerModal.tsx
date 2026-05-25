"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Search, ImageIcon, Film, CheckCircle2, Loader2, Trash2 } from "lucide-react";

interface MediaAsset {
  id: string;
  url: string;
  publicId: string;
  type: "image" | "video";
  uploadedAt: string;
}

interface Props {
  open: boolean;
  type?: "image" | "video" | "all";
  onSelect: (asset: { url: string; publicId: string }) => void;
  onClose: () => void;
}

export function MediaPickerModal({ open, type = "all", onSelect, onClose }: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/media");
      if (res.ok) setAssets(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) { load(); setSearch(""); setSelected(null); }
  }, [open, load]);

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setDeleting(id);
    await fetch(`/api/cms/media?id=${id}`, { method: "DELETE" });
    setAssets((p) => p.filter((a) => a.id !== id));
    setDeleting(null);
  }

  const filtered = assets.filter((a) => {
    if (type !== "all" && a.type !== type) return false;
    if (search && !a.publicId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Media Library</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">{filtered.length} asset{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#d98629]/30 w-44"
              />
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              <X size={15} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <Loader2 size={20} className="text-slate-400 animate-spin" />
              <span className="text-xs text-slate-400">Loading assets…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <ImageIcon size={20} className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">No assets found</p>
              <p className="text-xs text-slate-400">Upload files via the Media Library page first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => setSelected(asset.id === selected ? null : asset.id)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                    selected === asset.id
                      ? "border-[#d98629] shadow-md shadow-[#d98629]/20"
                      : "border-transparent hover:border-slate-300"
                  } bg-slate-100`}
                >
                  {asset.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset.url} alt={asset.publicId} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-slate-800">
                      <Film size={20} className="text-slate-400" />
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider">Video</span>
                    </div>
                  )}

                  {/* Selected check */}
                  {selected === asset.id && (
                    <div className="absolute inset-0 bg-[#d98629]/10 flex items-center justify-center">
                      <CheckCircle2 size={24} className="text-[#d98629] drop-shadow" />
                    </div>
                  )}

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(asset.id, e)}
                    disabled={deleting === asset.id}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex disabled:opacity-50"
                  >
                    {deleting === asset.id
                      ? <Loader2 size={10} className="text-white animate-spin" />
                      : <Trash2 size={10} className="text-white" />
                    }
                  </button>

                  {/* Type badge */}
                  <span className="absolute bottom-1.5 left-1.5 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-black/60 text-white">
                    {asset.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 shrink-0 bg-slate-50">
          <p className="text-[11px] text-slate-400">
            {selected ? "1 asset selected" : "Click an asset to select it"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!selected}
              onClick={() => {
                const asset = assets.find((a) => a.id === selected);
                if (asset) { onSelect({ url: asset.url, publicId: asset.publicId }); onClose(); }
              }}
              className="px-4 py-2 text-xs font-semibold text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: selected ? "#d98629" : undefined, backgroundColor: !selected ? "#94a3b8" : undefined }}
            >
              Use Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
