"use client";

import { useRef, useState } from "react";
import { Loader2, CheckCircle2, X, Film, ImageIcon, FolderOpen } from "lucide-react";
import { Upload as TusUpload } from "tus-js-client";
import { MediaPickerModal } from "./MediaPickerModal";
import { bunnyVideoUrl, bunnyThumbnailUrl } from "@/lib/bunny-video";

export interface UploadResult {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  alt?: string;
  // Video (Bunny) only — bunnyVideoId is the source of truth for playback;
  // thumbnailUrl is a ready-made poster so callers can pre-fill a thumbnail
  // field without doing their own Bunny URL plumbing.
  bunnyVideoId?: string;
  thumbnailUrl?: string;
  // Cloudinary backup copy of a video (best-effort — uploaded automatically
  // after the Bunny upload succeeds; may be undefined if the backup failed).
  cloudinaryVideoUrl?: string;
  cloudinaryPublicId?: string;
}

type UploadStatus = "idle" | "uploading" | "done" | "error";

interface Props {
  resourceType: "image" | "video";
  folder?: string;
  onUpload: (result: UploadResult) => void;
  label?: string;
  currentUrl?: string;
  showLibraryPicker?: boolean;
  // Lets a parent form (e.g. the showreel VideoPanel) gate its own Save
  // button on the upload actually finishing, instead of just tracking its
  // own `saving` flag — otherwise Save-while-still-uploading persists a
  // record with no bunnyVideoId/thumbnail.
  onStatusChange?: (status: UploadStatus) => void;
}

export function CloudinaryUploader({
  resourceType,
  folder = "movico",
  onUpload,
  label,
  currentUrl,
  showLibraryPicker = true,
  onStatusChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatusRaw] = useState<UploadStatus>("idle");
  const setStatus = (next: UploadStatus) => {
    setStatusRaw(next);
    onStatusChange?.(next);
  };
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);

  async function registerToLibrary(url: string, publicId: string) {
    try {
      await fetch("/api/cms/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: publicId, url, publicId, type: resourceType, alt: "" }),
      });
    } catch {
      // non-blocking — upload already succeeded
    }
  }

  // A TUS byte-upload failure (network drop, browser closed mid-upload, CSP
  // block, etc.) still leaves the video shell created on Bunny by the
  // /api/cms/upload/bunny POST above — clean it up so it doesn't pile up as
  // an orphan zero-byte video in the library.
  function cleanupOrphanBunnyVideo(videoId: string) {
    fetch(`/api/cms/upload/bunny?videoId=${videoId}`, { method: "DELETE" }).catch(() => {
      // non-blocking — the shell is at worst harmless clutter, not corrupt data
    });
  }

  // Shared signed-upload-to-Cloudinary helper — same signature/XHR pattern
  // the image path already uses in handleFile below. Reused for the video
  // backup-copy upload too.
  async function uploadToCloudinary(
    file: File,
    uploadResourceType: "image" | "video",
    onProgress?: (pct: number) => void
  ): Promise<{ url: string; publicId: string }> {
    const sigRes = await fetch("/api/cms/upload/signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder, resource_type: uploadResourceType }),
    });
    const { signature, timestamp, apiKey, cloudName } = await sigRes.json();

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    form.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve({ url: data.secure_url, publicId: data.public_id });
        } else {
          reject(new Error("Upload failed"));
        }
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${uploadResourceType}/upload`);
      xhr.send(form);
    });
  }

  // Best-effort Cloudinary backup of an already-Bunny-uploaded video, per
  // the dual-storage requirement (Bunny = primary, Cloudinary = fallback if
  // Bunny's account balance runs dry). Fire-and-forget: never blocks or
  // fails the caller's already-successful Bunny upload.
  async function backupVideoToCloudinary(
    file: File,
    bunnyResult: { url: string; publicId: string; resourceType: "video"; bunnyVideoId: string; thumbnailUrl: string }
  ) {
    try {
      const { url, publicId } = await uploadToCloudinary(file, "video");
      onUpload({ ...bunnyResult, cloudinaryVideoUrl: url, cloudinaryPublicId: publicId });
    } catch {
      // non-blocking — Bunny copy is already usable without the backup
    }
  }

  async function handleVideoFile(file: File) {
    try {
      const credRes = await fetch("/api/cms/upload/bunny", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: file.name.replace(/\.[^./]+$/, "") }),
      });
      if (!credRes.ok) throw new Error("Failed to get upload credentials");
      const { videoId, libraryId, signature, expirationTime, tusEndpoint, pullZone } = await credRes.json();

      await new Promise<void>((resolve, reject) => {
        const tusUpload = new TusUpload(file, {
          endpoint: tusEndpoint,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          // Bunny TUS auth contract (docs.bunny.net/reference/tus-resumable-uploads):
          // these four go as headers, not metadata.
          headers: {
            AuthorizationSignature: signature,
            AuthorizationExpire: String(expirationTime),
            VideoId: videoId,
            LibraryId: libraryId,
          },
          metadata: {
            filetype: file.type,
            title: file.name,
          },
          onError: (error) => {
            cleanupOrphanBunnyVideo(videoId);
            reject(error);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            if (bytesTotal) setProgress(Math.round((bytesUploaded / bytesTotal) * 100));
          },
          onSuccess: () => resolve(),
        });
        tusUpload.start();
      });

      const url = bunnyVideoUrl(videoId, pullZone, "1080p");
      const thumbnailUrl = bunnyThumbnailUrl(videoId, pullZone);
      const result = { url, publicId: videoId, resourceType: "video" as const, bunnyVideoId: videoId, thumbnailUrl };
      setStatus("done");
      setProgress(100);
      onUpload(result);
      registerToLibrary(url, videoId);
      backupVideoToCloudinary(file, result);
    } catch {
      setStatus("error");
    }
  }

  async function handleFile(file: File) {
    setStatus("uploading");
    setProgress(0);

    if (resourceType === "video") {
      await handleVideoFile(file);
      return;
    }

    try {
      const { url, publicId } = await uploadToCloudinary(file, resourceType, setProgress);
      setStatus("done");
      setProgress(100);
      if (resourceType === "image") setPreview(url);
      onUpload({ url, publicId, resourceType });
      registerToLibrary(url, publicId);
    } catch {
      setStatus("error");
    }
  }

  function handleLibrarySelect({ url, publicId, alt }: { url: string; publicId: string; alt: string }) {
    setPreview(url);
    setStatus("done");
    onUpload({ url, publicId, resourceType, alt });
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

      {/* Library picker link */}
      {showLibraryPicker && (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-white/30 hover:text-[#d98629] transition-colors"
        >
          <FolderOpen size={11} />
          Choose from Media Library
        </button>
      )}

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

      <MediaPickerModal
        open={pickerOpen}
        type={resourceType}
        onSelect={handleLibrarySelect}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}
