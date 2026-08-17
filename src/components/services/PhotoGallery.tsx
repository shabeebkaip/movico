"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, Play, X } from "lucide-react";
import type { GalleryItem } from "@/lib/cms/services";
import { cloudinaryVideoDelivery } from "@/lib/video-delivery";

// Repeating span pattern for a curated, asymmetric mosaic — big "hero" tile
// every 8 photos, mixed with wide/tall/square tiles in between. Works for
// any gallery length (6 photos or 32) since it just cycles by index.
const TILE_PATTERN = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
];

// Bunny→Cloudinary playback fallback for a single video gallery item —
// mirrors the imgFailed idiom in VideoGallery.tsx, but for a <video> src
// instead of an <img>/<Image> src. Local to this component (not a generic
// abstraction) since PhotoGallery is the only caller.
function LightboxVideo({ item }: { item: Extract<GalleryItem, { type: "video" }> }) {
  const [bunnyFailed, setBunnyFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackSrc = cloudinaryVideoDelivery(item.cloudinaryVideoUrl, 1920);
  const src = bunnyFailed && fallbackSrc ? fallbackSrc : item.url;

  // Mutating a <video>'s src attribute doesn't reliably restart the
  // resource-selection algorithm across browsers — explicit load() after a
  // src swap is the documented-safe way to force the fallback to attempt.
  useEffect(() => {
    videoRef.current?.load();
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={item.thumbnailUrl}
      controls
      autoPlay
      playsInline
      className="w-full h-full object-contain"
      onError={() => {
        if (!bunnyFailed && fallbackSrc) setBunnyFailed(true);
      }}
    />
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const total = items.length;
  const item = items[index];

  const goPrev = useCallback(
    () => onNavigate((index - 1 + total) % total),
    [index, total, onNavigate]
  );
  const goNext = useCallback(
    () => onNavigate((index + 1) % total),
    [index, total, onNavigate]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <div className="absolute inset-0 bg-black/97 backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,134,41,0.06),transparent_65%)] pointer-events-none" />

      {/* Close */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 backdrop-blur-sm"
      >
        <X size={16} />
      </button>

      {/* Counter */}
      <span className="absolute top-8 left-6 z-10 text-[10px] uppercase tracking-[0.3em] text-white/40">
        {index + 1} / {total}
      </span>

      {/* Prev */}
      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous item"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Next */}
      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next item"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Media */}
      <div
        className="relative w-full h-[72vh] md:h-[82vh] max-w-6xl mx-4 md:mx-16
                    shadow-[0_0_0_1px_rgba(217,134,41,0.25),0_0_80px_rgba(217,134,41,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/60 z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/60 z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/60 z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/60 z-10 pointer-events-none" />
        {item.type === "video" ? (
          // Keyed by url so switching between video items resets the
          // Bunny/Cloudinary fallback state instead of reusing stale state.
          <LightboxVideo key={item.url} item={item} />
        ) : (
          <Image
            src={item.url}
            alt=""
            fill
            className="object-contain"
            sizes="90vw"
            priority
          />
        )}
      </div>
    </div>
  );
}

export default function PhotoGallery({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-rows-[140px] md:auto-rows-[160px] xl:auto-rows-[190px] grid-flow-dense gap-2">
        {items.map((item, i) => (
          <button
            key={item.url + i}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={
              item.type === "video"
                ? `Play video ${i + 1} of ${items.length}`
                : `View photo ${i + 1} of ${items.length}`
            }
            className={`relative overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              TILE_PATTERN[i % TILE_PATTERN.length]
            }`}
          >
            {item.type === "video" ? (
              item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  alt=""
                  fill
                  loading={i < 4 ? "eager" : "lazy"}
                  // Bunny's pull zone rejects the Image Optimizer's
                  // referer-less server-side fetch — thumbnailUrl is always
                  // Bunny-hosted for gallery video items, so skip it here.
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
              )
            ) : (
              <Image
                src={item.url}
                alt=""
                fill
                loading={i < 4 ? "eager" : "lazy"}
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            {item.type === "video" ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <Play size={16} fill="white" className="text-white ml-0.5" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Expand size={14} className="text-white" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          items={items}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </>
  );
}
