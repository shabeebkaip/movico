import Image from "next/image";

interface ClientLogoProps {
  src: string;
  alt: string;
  className?: string;
  // "multiply" strips an opaque white background — only correct over a light/white backdrop.
  // Pass "none" over a dark backdrop, where multiply would crush the logo to black.
  blend?: "multiply" | "none";
}

// ponytail: white-bg removal used to be a per-pixel canvas re-encode done in
// the browser on every load (68x). mix-blend-mode:multiply gives the same
// visual result for free since the marquee card behind it is bg-white, and
// is a no-op for logos that are already transparent.
export function ClientLogo({ src, alt, className, blend = "multiply" }: ClientLogoProps) {
  const style = blend === "multiply" ? { mixBlendMode: "multiply" as const } : undefined;

  // SVGs are already tiny vectors — next/image can't optimize them without
  // dangerouslyAllowSVG, and there's nothing to gain by trying.
  if (src.toLowerCase().endsWith(".svg")) {
    return <img src={src} alt={alt} className={className} style={style} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={144}
      height={56}
      loading="eager"
      className={className}
      style={style}
    />
  );
}
