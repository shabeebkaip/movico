"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

const pillars = [
  {
    id: 1,
    trigger: "WIN ATTENTION",
    heading: "Built to stop the scroll.",
    body: "We craft every frame to penetrate the brain's natural attention filter. Using cinematic tension, visual rhythm, and strategic hooks — your video commands focus from the first second to the last.",
    cta: "Start a Project",
    video:
      "https://res.cloudinary.com/dm5c31z7w/video/upload/v1769938198/0201_loykmi.mp4",
  },
  {
    id: 2,
    trigger: "TELL YOUR STORY",
    heading: "Complex made effortless.",
    body: "The mind rewards clarity. We shape information flow so your brand narrative feels natural and satisfying to absorb — reducing cognitive load while keeping audiences completely absorbed.",
    cta: "Find Your Audience",
    video:
      "https://res.cloudinary.com/dm5c31z7w/video/upload/v1769938198/0201_loykmi.mp4",
  },
  {
    id: 3,
    trigger: "MOVE YOUR AUDIENCE",
    heading: "Emotion that creates memory.",
    body: "Feeling drives decisions. We design for empathy, reward, and belonging — through tone, rhythm, and authentic human moments that make your stories not just understood but truly felt.",
    cta: "Get Started",
    video:
      "https://res.cloudinary.com/dm5c31z7w/video/upload/v1769938198/0201_loykmi.mp4",
  },
  {
    id: 4,
    trigger: "INSPIRE ACTION",
    heading: "Awareness that converts.",
    body: "Emotion creates energy, and energy drives change. We turn feeling into movement — building personal investment that transforms awareness into measurable, lasting behaviour change.",
    cta: "Learn More",
    video:
      "https://res.cloudinary.com/dm5c31z7w/video/upload/v1769938198/0201_loykmi.mp4",
  },
];

export default function MethodologySection() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSelect = (i: number) => {
    if (i === active) return;
    gsap.to(contentRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setActive(i);
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      },
    });
  };

  const current = pillars[active];

  return (
    <section
      ref={sectionRef}
      className="bg-black text-white py-20 xl:py-32 overflow-hidden"
    >
      <div className="w-11/12 xl:w-10/12 mx-auto">
        {/* Header */}
        <div ref={headingRef} className="max-w-2xl mb-16 xl:mb-24">
          <span className="uppercase tracking-[0.5em] text-[10px] text-white/40 block mb-6">
            Our Methodology
          </span>
          <h2 className="font-display text-4xl md:text-5xl xl:text-6xl font-black uppercase leading-[0.95]">
            Does your video
            <br />
            <span className="text-primary">actually work?</span>
          </h2>
          <p className="text-white/50 mt-6 text-base leading-relaxed max-w-lg">
            We partner with leading creatives, drawing on proven principles of
            how people form memories and make decisions. With science-backed
            production, your content will…
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-20 items-start">
          {/* Left — interactive tab list */}
          <div className="space-y-0">
            {pillars.map((p, i) => (
              <div
                key={p.id}
                onClick={() => handleSelect(i)}
                className="group cursor-pointer border-b border-white/10 py-6 relative"
              >
                {/* Active indicator line */}
                <div
                  className="absolute left-0 top-0 h-full w-[2px] bg-primary transition-all duration-500"
                  style={{ opacity: active === i ? 1 : 0 }}
                />

                <div className="flex items-center justify-between pl-6">
                  <p
                    className={`font-display font-black text-xl md:text-2xl xl:text-3xl uppercase tracking-tight transition-colors duration-300 ${
                      active === i
                        ? "text-white"
                        : "text-white/30 group-hover:text-white/60"
                    }`}
                  >
                    {p.trigger}
                  </p>
                  <span
                    className={`text-primary transition-all duration-300 ${
                      active === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                    }`}
                  >
                    →
                  </span>
                </div>

                {/* Mobile inline content */}
                {active === i && (
                  <div className="xl:hidden pl-6 mt-4 space-y-3">
                    <p className="text-white/55 text-sm leading-relaxed">
                      {p.body}
                    </p>
                    <Link
                      href="#contact"
                      className="text-primary text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
                    >
                      {p.cta} →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right — video + content (desktop only) */}
          <div className="hidden xl:block sticky top-24">
            {/* Video */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-8">
              <video
                ref={videoRef}
                key={current.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={current.video} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div ref={contentRef}>
              <h3 className="font-display text-3xl font-black text-white mb-4">
                {current.heading}
              </h3>
              <p className="text-white/55 text-base leading-relaxed mb-6 max-w-md">
                {current.body}
              </p>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-[0.25em] hover:opacity-70 transition-opacity"
              >
                {current.cta} <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
