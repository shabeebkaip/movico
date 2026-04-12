"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "Understanding objectives, audience and positioning to define creative direction.",
  },
  {
    number: "02",
    title: "Pre-Production",
    description:
      "Concept development, scripting, casting and logistical planning.",
  },
  {
    number: "03",
    title: "Production",
    description:
      "Cinematography, lighting design and coordinated on-set execution.",
  },
  {
    number: "04",
    title: "Post-Production",
    description: "Editing, grading, sound design and motion refinement.",
  },
  {
    number: "05",
    title: "Distribution",
    description:
      "Platform optimisation and strategic rollout for maximum impact.",
  },
];

const ProcessFlow = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 82%" },
      });

      const cards = stepsRef.current?.children;
      if (cards) {
        gsap.from(cards, {
          y: 80,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 78%",
          },
        });

        // Number count-up effect
        Array.from(cards).forEach((card) => {
          const numEl = card.querySelector(".step-number");
          if (numEl) {
            gsap.from(numEl, {
              opacity: 0,
              scale: 0.5,
              duration: 0.6,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: stepsRef.current,
                start: "top 78%",
              },
            });
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 xl:py-32 bg-white overflow-hidden"
    >
      <div className="w-11/12 xl:w-10/12 mx-auto">
        {/* Header */}
        <div ref={headingRef} className="max-w-2xl mb-16 xl:mb-20">
          <span className="uppercase tracking-[0.5em] text-[10px] text-black/40 block mb-6">
            How We Work
          </span>
          <h2 className="font-display font-black text-5xl md:text-6xl xl:text-7xl uppercase leading-[0.95] text-black">
            Engineered For
            <br />
            <span className="text-primary">Precision.</span>
          </h2>
        </div>

        {/* Steps grid */}
        <div
          ref={stepsRef}
          className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-6 relative"
        >
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {/* Connector line — desktop */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-6 h-px bg-black/10 z-0" />
              )}

              {/* Number */}
              <div className="step-number font-display font-black text-5xl text-primary mb-6">
                {step.number}
              </div>

              <h3 className="font-display font-bold text-xl text-black mb-3 uppercase group-hover:text-primary transition-colors duration-300">
                {step.title}
              </h3>

              <p className="text-black/50 leading-relaxed text-sm">
                {step.description}
              </p>

              {/* Bottom accent line */}
              <div className="mt-6 w-8 h-[2px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;
