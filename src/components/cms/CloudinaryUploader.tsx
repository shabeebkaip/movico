"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, CheckCircle2, X, Film, ImageIcon } from "lucide-react";

interface UploadResult {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
}

interface Props {
  resourceType: "image" | "video";
  folder?: string;
  onUpload: (result: UploadResult) => void;
  label?: string;
  currentUrl?: string;
}

export function CloudinaryUploader({ resourceType, folder = "movico", onUpload, label, currentUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  async function handleFile(file: File) {
    setStatus("uploading");
    setProgress(0);

    try {
      // 1. Get signed upload params from our server
      const sigRes = await fetch("/api/cms/upload/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder, resource_type: resourceType }),
      });
      const { signature, timestamp, apiKey, cloudName } = await sigRes.json();

      // 2. Upload directly to Cloudinary
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      form.append("folder", folder);

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            setStatus("done");
            setProgress(100);
            if (resourceType === "image") setPreview(data.secure_url);
            onUpload({ url: data.secure_url, publicId: data.public_id, resourceType });
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`);
        xhr.send(form);
      });
    } catch {
      setStatus("error");
    }
  }

  const accept = resourceType === "video" ? "video/*" : "image/*";
  const Icon = resourceType === "video" ? Film : ImageIcon;

  return (
    <div className="space-y-2">
      {label && <label className="text-[11px] uppercase tracking-[0.15em] text-white/40">{label}</label>}

      {/* Preview */}
      {preview && resourceType === "image" && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#1a1a1a] group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => { setPreview(null); setStatus("idle"); }}
            className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} className="text-white" />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === "uploading"}
        className="w-full border border-dashed border-white/[0.12] hover:border-[#d98629]/50 rounded-lg px-4 py-4 flex flex-col items-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-[#0a0a0a] hover:bg-[#d98629]/5"
      >
        {status === "uploading" ? (
          <>
            <Loader2 size={18} className="text-[#d98629] animate-spin" />
            <span className="text-xs text-white/50">Uploading… {progress}%</span>
            <div className="w-full bg-white/10 rounded-full h-1 mt-1">
              <div
                className="bg-[#d98629] h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : status === "done" ? (
          <>
            <CheckCircle2 size={18} className="text-green-400" />
            <span className="text-xs text-green-400">Uploaded successfully</span>
            <span className="text-[10px] text-white/30">Click to replace</span>
          </>
        ) : status === "error" ? (
          <>
            <X size={18} className="text-red-400" />
            <span className="text-xs text-red-400">Upload failed — try again</span>
          </>
        ) : (
          <>
            <Icon size={18} className="text-white/30" />
            <span className="text-xs text-white/50">
              {preview ? "Click to replace" : `Click to upload ${resourceType}`}
            </span>
            <span className="text-[10px] text-white/20">
              {resourceType === "video" ? "MP4, MOV, AVI" : "JPG, PNG, WEBP"}
            </span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
