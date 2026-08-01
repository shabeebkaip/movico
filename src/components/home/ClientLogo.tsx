import Image from "next/image";

interface ClientLogoProps {
  src: string;
  alt: string;
  className?: string;
}

// ponytail: white-bg removal used to be a per-pixel canvas re-encode done in
// the browser on every load (68x). mix-blend-mode:multiply gives the same
// visual result for free since the marquee card behind it is bg-white, and
// is a no-op for logos that are already transparent.
export function ClientLogo({ src, alt, className }: ClientLogoProps) {
  // SVGs are already tiny vectors — next/image can't optimize them without
  // dangerouslyAllowSVG, and there's nothing to gain by trying.
  if (src.toLowerCase().endsWith(".svg")) {
    return <img src={src} alt={alt} className={className} style={{ mixBlendMode: "multiply" }} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={144}
      height={56}
      className={className}
      style={{ mixBlendMode: "multiply" }}
    />
  );
}
