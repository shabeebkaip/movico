"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    num: "01",
    trigger: "Win Attention",
    body: "We craft every frame to penetrate the brain's natural attention filter. Cinematic tension, visual rhythm, and strategic hooks — your video commands focus from second one.",
  },
  {
    num: "02",
    trigger: "Tell Your Story",
    body: "We shape your brand narrative so it feels natural and satisfying to absorb — reducing cognitive load while keeping audiences completely engaged.",
  },
  {
    num: "03",
    trigger: "Move Your Audience",
    body: "Emotion drives decisions. We design for empathy and authentic human moments that make your stories not just understood — but truly felt.",
  },
  {
    num: "04",
    trigger: "Inspire Action",
    body: "We turn feeling into movement — building personal investment that transforms awareness into measurable, lasting behaviour change.",
  },
];

export default function MethodologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 80%" },
      });

      const cards = cardsRef.current?.querySelectorAll(".pillar-card");
      if (cards) {
        gsap.from(cards, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 75%" },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-black text-white py-20 xl:py-32 overflow-hidden"
    >
      <div className="w-11/12 xl:w-10/12 mx-auto">

        {/* Header */}
        <div ref={headingRef} className="mb-16 xl:mb-20 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
          <div>
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-5">
              Our Methodology
            </span>
            <h2 className="font-display text-5xl md:text-6xl xl:text-7xl font-black uppercase leading-[0.9]">
              Does your video
              <br />
              <span className="text-primary">actually work?</span>
            </h2>
          </div>
          <div className="xl:max-w-xs xl:text-right">
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Science-backed production built around how people form memories, feel emotion, and make decisions.
            </p>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-[0.25em] hover:opacity-70 transition-opacity"
            >
              Start a Project <span>→</span>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-0" />

        {/* 4-pillar grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="pillar-card group relative border-r border-white/10 last:border-r-0 md:even:border-r-0 xl:even:border-r xl:last:border-r-0 py-10 px-8 hover:bg-white/[0.03] transition-colors duration-500 cursor-default"
            >
              {/* Large background number */}
              <span className="absolute top-6 right-6 font-display font-black text-[5rem] xl:text-[6rem] leading-none text-white/[0.04] select-none pointer-events-none group-hover:text-primary/10 transition-colors duration-500">
                {p.num}
              </span>

              {/* Step number */}
              <span className="font-display font-black text-primary text-sm tracking-widest block mb-6">
                {p.num}
              </span>

              {/* Heading */}
              <h3 className="font-display font-black text-2xl xl:text-3xl uppercase leading-tight text-white mb-4 group-hover:text-primary transition-colors duration-300">
                {p.trigger}
              </h3>

              {/* Divider line */}
              <div className="w-8 h-[2px] bg-primary mb-5 group-hover:w-12 transition-all duration-300" />

              {/* Body */}
              <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-300">
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom border */}
        <div className="w-full h-px bg-white/10" />
      </div>
    </section>
  );
}
