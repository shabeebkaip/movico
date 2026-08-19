"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import type { HeroContent } from "@/lib/cms/types";
import { defaultContent } from "@/lib/cms/types";

const D = defaultContent.home.hero;

export function HeroSection({ content = D }: { content?: HeroContent }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(labelRef.current, { y: 20, duration: 0.8 }, 0.3)
        .from(line1Ref.current, { y: 110, duration: 1.1 }, 0.5)
        .from(line2Ref.current, { y: 110, duration: 1.1 }, 0.65)
        .from(subRef.current, { y: 30, duration: 0.9 }, 0.85)
        .from(ctaRef.current, { y: 20, duration: 0.8 }, 0.95);

      gsap.to(scrollRef.current, {
        y: 12,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: "power1.inOut",
        delay: 2.5,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-black"
    >
      {/* Full-screen background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={content.posterUrl}
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src={content.videoUrl} type="video/mp4" />
      </video>

      {/* Multi-layer overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent" />

      {/* Content — bottom-left aligned like casualfilms */}
      <div className="relative z-10 flex flex-col justify-end h-screen pb-10 md:pb-20 px-6 md:px-12 xl:px-20">
        <div className="max-w-6xl">
          <p
            ref={labelRef}
            className="text-white/50 uppercase tracking-[0.5em] text-[10px] md:text-xs mb-6"
          >
            {content.label}
          </p>

          {/* Overflow-hidden containers for upward reveal */}
          <div className="overflow-hidden mb-1">
            <h1
              ref={line1Ref}
              className="font-display font-black text-white text-[clamp(1.7rem,9vw,7rem)] sm:text-[clamp(2.2rem,8vw,7rem)] leading-[0.9] uppercase"
            >
              {content.headlineLine1}
            </h1>
          </div>
          <div className="overflow-hidden mb-10">
            <div
              ref={line2Ref}
              className="font-display font-black text-primary text-[clamp(1.7rem,9vw,7rem)] sm:text-[clamp(2.2rem,8vw,7rem)] leading-[0.85] uppercase"
            >
              <div className="flex items-baseline gap-0">
                <AnimatedTextCycle
                  words={content.cyclePhrases}
                  interval={3000}
                  className="text-[clamp(1.7rem,9vw,7rem)] sm:text-[clamp(2.2rem,8vw,7rem)] leading-[0.85]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16">
            <p
              ref={subRef}
              className="text-white/55 text-sm md:text-base max-w-xs md:max-w-sm leading-relaxed"
            >
              {content.subtitle}
            </p>

            <div ref={ctaRef} className="flex items-center gap-5">
              <Link
                href={content.ctaPrimary.href}
                className="bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] px-6 py-3.5 md:px-8 md:py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                {content.ctaPrimary.text}
              </Link>
              <Link
                href={content.ctaSecondary.href}
                className="text-white/60 text-xs uppercase tracking-[0.2em] hover:text-white transition-colors duration-300 flex items-center gap-2 group"
              >
                <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-300">
                  ▶
                </span>
                {content.ctaSecondary.text}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="hidden md:flex absolute bottom-8 right-8 md:right-12 xl:right-20 flex-col items-center gap-3 opacity-50"
      >
        <div className="w-px h-16 bg-white/40" />
        <ArrowDown size={16} className="text-white" />
      </div>
    </section>
  );
}

export default HeroSection;
