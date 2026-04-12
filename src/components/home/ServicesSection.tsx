"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const services = [
  {
    number: "01",
    title: "Video Production",
    description:
      "High-impact commercials, branded films, and cinematic storytelling crafted for scale and emotion.",
    image:
      "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
  },
  {
    number: "02",
    title: "Event Production",
    description:
      "Immersive conferences and brand experiences engineered for cultural relevance.",
    image:
      "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
  },
  {
    number: "03",
    title: "Brand Identity",
    description:
      "Strategic brand systems designed for longevity, authority, and regional impact.",
    image:
      "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
  },
  {
    number: "04",
    title: "Spatial & Booth",
    description:
      "Exhibition environments built through architectural storytelling and spatial precision.",
    image:
      "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
  },
  {
    number: "05",
    title: "Interior Design",
    description:
      "Commercial environments visualised through cinematic precision and creative vision.",
    image:
      "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
  },
  {
    number: "06",
    title: "Social & Digital",
    description:
      "Performance-driven content ecosystems built for dominance across every platform.",
    image:
      "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
  },
];

const SCROLL_PER = 500; // px of scroll travel per service step

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const arrowRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const section = sectionRef.current;
        if (!section) return;
        const total = services.length;

        /* ── Initial states ── */
        rowRefs.current.forEach((row, i) => {
          if (!row) return;
          // Inactive rows stay clearly visible — only the active one gets the full highlight
          gsap.set(row, { opacity: i === 0 ? 1 : 0.55 });
        });
        titleRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, {
            color: i === 0 ? "#ffffff" : "rgba(255,255,255,0.6)",
            fontSize: i === 0 ? "clamp(2.5rem,4vw,4rem)" : "clamp(1.4rem,2vw,1.8rem)",
          });
        });
        numRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, { color: i === 0 ? "#d98629" : "rgba(255,255,255,0.35)" });
        });
        descRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 12 });
        });
        arrowRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, { opacity: i === 0 ? 1 : 0, x: i === 0 ? 0 : -8 });
        });
        imgRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, { opacity: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.05 });
        });
        gsap.set(progressRef.current, { scaleY: 0, transformOrigin: "top center" });

        /* ── Pinned timeline ── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            anticipatePin: 1,
            scrub: 1.2,
            start: "top top",
            end: `+=${SCROLL_PER * total}`,
            invalidateOnRefresh: true,
          },
        });

        // Progress bar grows top→bottom
        tl.to(progressRef.current, { scaleY: 1, ease: "none" }, 0);

        const step = 1 / total;

        for (let i = 0; i < total - 1; i++) {
          const t = i * step;
          const fadeOut = t + step * 0.45;
          const fadeIn = t + step * 0.55;

          // Deactivate current row — stays readable, just de-emphasised
          tl.to(rowRefs.current[i], { opacity: 0.55, duration: step * 0.4, ease: "power2.in" }, fadeOut)
            .to(titleRefs.current[i], {
              color: "rgba(255,255,255,0.6)",
              fontSize: "clamp(1.4rem,2vw,1.8rem)",
              duration: step * 0.4,
              ease: "power2.in",
            }, fadeOut)
            .to(numRefs.current[i], { color: "rgba(255,255,255,0.35)", duration: step * 0.4 }, fadeOut)
            .to(descRefs.current[i], { opacity: 0, y: -12, duration: step * 0.35 }, fadeOut)
            .to(arrowRefs.current[i], { opacity: 0, x: -8, duration: step * 0.3 }, fadeOut)
            .to(imgRefs.current[i], { opacity: 0, scale: 1.05, duration: step * 0.5, ease: "power2.in" }, fadeOut);

          // Activate next row
          tl.to(rowRefs.current[i + 1], { opacity: 1, duration: step * 0.4, ease: "power2.out" }, fadeIn)
            .to(titleRefs.current[i + 1], {
              color: "#ffffff",
              fontSize: "clamp(2.5rem,4vw,4rem)",
              duration: step * 0.5,
              ease: "power2.out",
            }, fadeIn)
            .to(numRefs.current[i + 1], { color: "#d98629", duration: step * 0.4, ease: "power2.out" }, fadeIn)
            .to(descRefs.current[i + 1], { opacity: 1, y: 0, duration: step * 0.5, ease: "power2.out" }, fadeIn + step * 0.05)
            .to(arrowRefs.current[i + 1], { opacity: 1, x: 0, duration: step * 0.4, ease: "power2.out" }, fadeIn + step * 0.05)
            .to(imgRefs.current[i + 1], { opacity: 1, scale: 1, duration: step * 0.6, ease: "power2.out" }, fadeIn);
        }
      }, sectionRef);

      return () => ctx.revert();
    }, 120);

    return () => clearTimeout(timer);
  }, []);

  return (
    /* No overflow-hidden on section — GSAP needs to add spacer outside it */
    <section
      ref={sectionRef}
      id="services"
      className="bg-black text-white"
    >
      <div className="h-screen flex flex-col overflow-hidden">
        {/* ── Top header bar ── */}
        <div className="flex-none flex items-end justify-between px-6 md:px-12 xl:px-20 pt-20 pb-10">
          <div>
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/40 block mb-4">
              What We Do
            </span>
            <h2 className="font-display text-5xl md:text-7xl xl:text-8xl uppercase leading-none">
              Our Services
            </h2>
          </div>
          <p className="hidden md:block text-white/35 max-w-xs text-sm leading-relaxed text-right">
            From concept to final delivery — spanning video, live events, brand
            identity, and digital campaigns.
          </p>
        </div>

        {/* ── Body: list + image panel ── */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-0 overflow-hidden px-6 md:px-12 xl:px-20 pb-12">

          {/* Left — service list */}
          <div className="relative flex flex-col justify-center">
            {/* Progress line */}
            <div
              ref={lineRef}
              className="absolute left-0 top-0 bottom-0 w-px bg-white/8"
            >
              <div
                ref={progressRef}
                className="absolute inset-0 bg-primary origin-top"
              />
            </div>

            <div className="pl-6 space-y-0">
              {services.map((service, i) => (
                <div
                  key={service.number}
                  ref={(el) => { rowRefs.current[i] = el; }}
                  className="py-5 border-b border-white/8 last:border-none cursor-default"
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      ref={(el) => { numRefs.current[i] = el; }}
                      className="font-display text-xs w-7 flex-none"
                    >
                      {service.number}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <h3
                          ref={(el) => { titleRefs.current[i] = el; }}
                          className="font-display uppercase leading-none transition-none"
                        >
                          {service.title}
                        </h3>
                        <span
                          ref={(el) => { arrowRefs.current[i] = el; }}
                          className="text-primary flex-none text-lg"
                        >
                          →
                        </span>
                      </div>

                      <p
                        ref={(el) => { descRefs.current[i] = el; }}
                        className="text-white/50 text-sm leading-relaxed mt-2 max-w-lg"
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — stacked images, one visible at a time */}
          <div className="hidden xl:block relative ml-10">
            <div className="relative h-full rounded-2xl overflow-hidden">
              {services.map((service, i) => (
                <div
                  key={service.number}
                  ref={(el) => { imgRefs.current[i] = el; }}
                  className="absolute inset-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-white/50 text-[10px] uppercase tracking-[0.3em]">
                      {service.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
