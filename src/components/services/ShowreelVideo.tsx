"use client";

import { useEffect, useRef, useState } from "react";
import { cloudinaryVideoDelivery } from "@/lib/video-delivery";

// Bunny→Cloudinary playback fallback for the service-page showreel, same
// idiom as PhotoGallery's LightboxVideo (per-item failed-state, not a
// generic abstraction — this is the only caller).
export function ShowreelVideo({
  bunnyUrl,
  poster,
  cloudinaryVideoUrl,
}: {
  bunnyUrl: string;
  poster?: string;
  cloudinaryVideoUrl?: string;
}) {
  const [bunnyFailed, setBunnyFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackSrc = cloudinaryVideoDelivery(cloudinaryVideoUrl, 1920);
  const src = bunnyFailed && fallbackSrc ? fallbackSrc : bunnyUrl;

  // Explicit load() after a src swap — changing the src attribute alone
  // doesn't reliably restart resource selection across browsers.
  useEffect(() => {
    videoRef.current?.load();
  }, [src]);

  return (
    <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => {
          if (!bunnyFailed && fallbackSrc) setBunnyFailed(true);
        }}
      />
    </div>
  );
}
