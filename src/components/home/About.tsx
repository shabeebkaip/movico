"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { MagicText } from "@/components/ui/magic-text";

const stats = [
  { value: 120, suffix: "+", label: "Productions" },
  { value: 50, suffix: "+", label: "Brands" },
  { value: 4, suffix: "+", label: "Years" },
  { value: 15, suffix: "+", label: "Awards" },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading word reveal
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

      // bodyRef removed — MagicText handles its own scroll animation

      // Counter animation for each stat
      counterRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = stats[i].value;
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
            },
          }
        );
      });

      gsap.from(statsRef.current?.children ?? [], {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
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
      {/* Decorative shape */}
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
              We produce videos
              <br />
              that target the
              <br />
              <span className="text-primary">neural systems</span>
              <br />
              behind attention,
              <br />
              memory &amp; action.
            </h2>

            <div className="text-white/70 max-w-md -ml-4">
              <MagicText text="Movico is a Riyadh-based cinematic production studio. We build high-impact video, events, and brand experiences — engineered for cultural resonance and maximum commercial impact across Saudi Arabia and the region." />
            </div>
          </div>

          {/* Right — image + stats */}
          <div className="space-y-10">
            {/* Decorative image block */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg"
                alt="Movico production"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white text-xs uppercase tracking-[0.3em] opacity-60">
                  Production in the Field
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div
              ref={statsRef}
              className="grid grid-cols-4 gap-4"
            >
              {stats.map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl md:text-4xl font-black text-primary leading-none">
                    <span
                      ref={(el) => {
                        counterRefs.current[i] = el;
                      }}
                    >
                      0
                    </span>
                    {stat.suffix}
                  </p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
