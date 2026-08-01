"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Background/decorative <video> that doesn't fetch or play until it's
 * ~200px from entering the viewport. Renders identically to a plain
 * `<video autoPlay muted loop playsInline>` once in view.
 */
export default function LazyVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={inView ? src : undefined}
      autoPlay={inView}
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
  );
}
