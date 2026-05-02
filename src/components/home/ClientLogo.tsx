"use client";

import { useEffect, useState } from "react";

interface ClientLogoProps {
  src: string;
  alt: string;
  className?: string;
  removeWhiteBg?: boolean;
}

export function ClientLogo({ src, alt, className, removeWhiteBg }: ClientLogoProps) {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!removeWhiteBg) return;

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Make near-white pixels transparent
        if (r > 220 && g > 220 && b > 220) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedSrc(canvas.toDataURL("image/png"));
    };
    img.src = src;
  }, [src, removeWhiteBg]);

  const finalSrc = removeWhiteBg ? (processedSrc ?? src) : src;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={finalSrc} alt={alt} className={className} />;
}
