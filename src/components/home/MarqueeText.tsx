"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { MarqueeContent } from "@/lib/cms/types";
import { defaultContent } from "@/lib/cms/types";

const D = defaultContent.home.marquee;

export function MarqueeText({ content = D }: { content?: MarqueeContent }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(rowRef.current, {
        x: "-50%",
        ease: "none",
        duration: 20,
        repeat: -1,
      });
      gsap.fromTo(
        row2Ref.current,
        { x: "-50%" },
        { x: "0%", ease: "none", duration: 25, repeat: -1 }
      );
    });
    return () => ctx.revert();
  }, []);

  const SEP = "   •   ";
  const text1 = content.row1 + SEP;
  const text2 = content.row2 + SEP;
  const copies = 4;

  return (
    <div className="overflow-hidden bg-black py-8 xl:py-12 border-y border-white/5 space-y-4">
      {/* Row 1 */}
      <div
        ref={rowRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{ width: "max-content" }}
      >
        {Array.from({ length: copies }).map((_, i) => (
          <p
            key={i}
            className="font-display font-black text-4xl xl:text-[6rem] leading-none pr-0"
            style={{ color: i % 2 === 0 ? "#ffffff" : "#d98629" }}
          >
            {text1}
          </p>
        ))}
      </div>

      {/* Row 2 — smaller, reversed */}
      <div
        ref={row2Ref}
        className="flex whitespace-nowrap will-change-transform"
        style={{ width: "max-content" }}
      >
        {Array.from({ length: copies }).map((_, i) => (
          <p
            key={i}
            className="font-display font-bold text-xl xl:text-3xl leading-none pr-0 text-white/20"
          >
            {text2}
          </p>
        ))}
      </div>
    </div>
  );
}
