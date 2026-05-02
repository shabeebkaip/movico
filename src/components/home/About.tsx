"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagicText } from "@/components/ui/magic-text";
import Counter from "@/components/ui/counter";

const stats = [
  { value: 150, suffix: "+", label: "Projects Completed" },
  { value: 60, suffix: "+", label: "Brands Served" },
  { value: 6, suffix: "", label: "Cities in Saudi Arabia" },
  { value: 4, suffix: "+", label: "Years Active" },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 82%",
        },
      });

      gsap.from(rightRef.current?.children ?? [], {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rightRef.current,
          start: "top 78%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-black text-white py-20 xl:py-32 relative overflow-hidden"
    >
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.04] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,#d98629,transparent_70%)]" />
      </div>

      <div className="w-11/12 xl:w-10/12 mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* Left — statement */}
          <div>
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/40 mb-8 block">
              Who We Are
            </span>

            <h2
              ref={headingRef}
              className="font-display text-4xl md:text-5xl xl:text-6xl font-black leading-[0.95] uppercase mb-8"
            >
              Riyadh&apos;s corporate
              <br />
              video company
              <br />
              <span className="text-primary">built for impact</span>
              <br />
              across Saudi Arabia.
            </h2>

            <div className="text-white/70 max-w-md -ml-4">
              <MagicText text="Movico is a Riyadh-based media production studio specialising in corporate videos, event coverage, and brand films — engineered for maximum commercial impact across Saudi Arabia and the GCC." />
            </div>
          </div>

          {/* Right — boxy stats grid */}
          <div ref={rightRef} className="grid grid-cols-2 gap-[2px]">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative flex flex-col justify-between p-8 xl:p-10 border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-500 aspect-square"
              >
                {/* Subtle top-left corner accent */}
                <div className="w-5 h-px bg-primary opacity-60" />

                <div className="mt-auto">
                  <p className="font-display text-[clamp(3rem,6vw,5rem)] font-black text-primary leading-none tabular-nums">
                    <Counter end={stat.value} duration={2200} suffix={stat.suffix} />
                  </p>
                  <p className="text-white/40 text-[11px] uppercase tracking-[0.35em] mt-3">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
