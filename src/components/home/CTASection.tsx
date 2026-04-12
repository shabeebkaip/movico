"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 82%" },
      });
      gsap.from(formRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: formRef.current, start: "top 80%" },
      });
      gsap.from(contentRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-black text-white overflow-hidden py-20 xl:py-32"
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      >
        <source
          src="https://res.cloudinary.com/dm5c31z7w/video/upload/v1769938198/0201_loykmi.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-linear-to-b from-black via-black/80 to-black" />

      <div className="relative z-10 w-11/12 xl:w-10/12 mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 xl:mb-20">
          <span className="uppercase tracking-[0.5em] text-[10px] text-white/40 block mb-6">
            Get In Touch
          </span>
          <h2
            ref={headingRef}
            className="font-display font-black text-5xl md:text-7xl xl:text-[8rem] uppercase leading-[0.9] text-white"
          >
            Let&apos;s Create
            <br />
            <span className="text-primary">Something.</span>
          </h2>
        </div>

        {/* Two-column: Form + Copy */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-20 items-start">
          {/* Form */}
          <div ref={formRef}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-b border-white/20 pb-3 group focus-within:border-primary transition-colors duration-300">
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    required
                    className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                  />
                </div>
                <div className="border-b border-white/20 pb-3 group focus-within:border-primary transition-colors duration-300">
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    required
                    className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                  />
                </div>
              </div>
              <div className="border-b border-white/20 pb-3 group focus-within:border-primary transition-colors duration-300">
                <input
                  type="tel"
                  placeholder="Phone"
                  name="phone"
                  className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                />
              </div>
              <div className="border-b border-white/20 pb-3 group focus-within:border-primary transition-colors duration-300">
                <input
                  type="text"
                  placeholder="Company / Brand"
                  name="company"
                  className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                />
              </div>
              <div className="border-b border-white/20 pb-3 group focus-within:border-primary transition-colors duration-300">
                <textarea
                  placeholder="Tell us about your project"
                  name="message"
                  rows={4}
                  className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-primary text-white text-xs font-bold uppercase tracking-[0.25em] px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 mt-4"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Copy block */}
          <div ref={contentRef} className="xl:pl-8 space-y-10">
            <div>
              <p className="text-white/55 text-lg leading-relaxed mb-8">
                Go beyond typical with Movico. You&apos;re not just choosing a
                production company — you&apos;re selecting a partner who
                understands your brand and has a genuine interest in crafting
                meaningful, impactful cinematic stories.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-2">
                  Email
                </p>
                <a
                  href="mailto:info@movicoksa.com"
                  className="text-white hover:text-primary transition-colors duration-300"
                >
                  info@movicoksa.com
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-2">
                  Phone
                </p>
                <a
                  href="tel:+966536660125"
                  className="text-white hover:text-primary transition-colors duration-300"
                >
                  +966 53 666 0125
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-2">
                  Location
                </p>
                <p className="text-white">Wadi Laban, Riyadh, Saudi Arabia</p>
              </div>
            </div>

            {/* NPS badge */}
            <div className="border border-white/10 rounded-2xl p-6 inline-block">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">
                Client Satisfaction
              </p>
              <p className="font-display font-black text-5xl text-primary">
                98<span className="text-2xl">%</span>
              </p>
              <p className="text-white/40 text-xs mt-1">Would recommend us</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
