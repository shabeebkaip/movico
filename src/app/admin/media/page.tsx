"use client";

import { useState } from "react";
import { CloudinaryUploader } from "@/components/cms/CloudinaryUploader";
import { Copy, CheckCircle2, Film, ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UploadedItem {
  id: string;
  url: string;
  publicId: string;
  type: "image" | "video";
  uploadedAt: Date;
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
      className="flex items-center gap-1 px-2 py-1 bg-white/[0.06] hover:bg-white/[0.12] rounded text-[10px] text-white/50 hover:text-white transition-all"
    >
      {copied ? <CheckCircle2 size={10} className="text-green-400" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy URL"}
    </button>
  );
}

export default function MediaLibrary() {
  const [items, setItems] = useState<UploadedItem[]>([]);

  function addItem(url: string, publicId: string, type: "image" | "video") {
    setItems((prev) => [
      { id: publicId, url, publicId, type, uploadedAt: new Date() },
      ...prev,
    ]);
    toast.success(`${type === "image" ? "Image" : "Video"} uploaded successfully`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <header className="h-14 border-b border-white/[0.06] flex items-center px-6 shrink-0">
        <div>
          <h1 className="text-white font-semibold text-sm">Media Library</h1>
          <p className="text-white/30 text-[10px]">Upload images and videos to Cloudinary CDN</p>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left — uploaders */}
        <div className="w-80 shrink-0 border-r border-white/[0.06] p-5 space-y-6 overflow-y-auto">
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/30 mb-3">Upload Image</p>
            <CloudinaryUploader
              resourceType="image"
              folder="movico/media"
              label="Image"
              onUpload={({ url, publicId }) => addItem(url, publicId, "image")}
            />
          </div>

          <div className="border-t border-white/[0.06] pt-6">
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/30 mb-3">Upload Video</p>
            <CloudinaryUploader
              resourceType="video"
              folder="movico/videos"
              label="Video"
              onUpload={({ url, publicId }) => addItem(url, publicId, "video")}
            />
          </div>

          <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-4 text-xs text-white/30 space-y-1.5">
            <p className="font-semibold text-white/50 mb-2">How to use</p>
            <p>1. Upload a file above</p>
            <p>2. Copy the URL from the panel</p>
            <p>3. Paste into the content editor (Video URL / Poster URL fields)</p>
            <p className="text-white/20 pt-1">Files are stored on Cloudinary CDN and served globally at full speed.</p>
          </div>
        </div>

        {/* Right — uploaded items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <ImageIcon size={24} className="text-white/20" />
              </div>
              <p className="text-white/30 text-sm">No uploads this session</p>
              <p className="text-white/20 text-xs max-w-xs">
                Files you upload appear here. Copy their URLs to use them in the content editor or showreel manager.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-[#111111] border border-white/[0.06] rounded-xl overflow-hidden group">
                  {/* Preview */}
                  <div className="aspect-video relative bg-[#0a0a0a]">
                    {item.type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.publicId} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <Film size={28} className="text-white/20" />
                        <span className="text-[10px] text-white/30">Video uploaded</span>
                      </div>
                    )}
                    <span className={`absolute top-2 left-2 text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full ${
                      item.type === "image" ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"
                    }`}>
                      {item.type}
                    </span>
                  </div>

                  {/* URL row */}
                  <div className="p-3 space-y-2">
                    <p className="text-[10px] text-white/30 font-mono truncate">{item.publicId}</p>
                    <div className="flex items-center gap-2">
                      <CopyButton text={item.url} />
                      <button
                        onClick={() => setItems((p) => p.filter((x) => x.id !== item.id))}
                        className="flex items-center gap-1 px-2 py-1 bg-red-500/[0.08] hover:bg-red-500/20 rounded text-[10px] text-red-400/60 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={10} /> Remove
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
