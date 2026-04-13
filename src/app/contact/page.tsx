"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle } from "lucide-react";
import { MagneticText } from "@/components/ui/morphing-cursor";
import type { Metadata } from "next";

const SERVICES = [
  "Video Production",
  "Event Production",
  "Brand Identity",
  "Spatial & Booth",
  "Interior Design",
  "Social & Digital",
  "Not Sure Yet",
];

const BUDGETS = [
  "Under SAR 20,000",
  "SAR 20,000 – 50,000",
  "SAR 50,000 – 150,000",
  "SAR 150,000+",
  "Prefer to discuss",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 70,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
      gsap.from(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });
      gsap.from(infoRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.35,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await fetch("https://formspree.io/f/movico-contact", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section
        ref={sectionRef}
        className="relative pt-36 pb-20 xl:pt-52 xl:pb-28 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,134,41,0.07),transparent_55%)]" />

        <div className="relative w-11/12 xl:w-10/12 mx-auto">
          <div ref={headingRef}>
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-6">
              Get In Touch
            </span>
            <h1 className="font-display font-black text-5xl md:text-7xl xl:text-[8rem] uppercase leading-[0.9] mb-0 flex flex-col items-start gap-0">
              <MagneticText
                text="Let's Create"
                hoverText="Let's Create"
                className="text-white"
                circleClassName="bg-white"
                innerTextClassName="text-black"
              />
              <MagneticText
                text="Something."
                hoverText="Together."
                className="text-primary"
                circleClassName="bg-primary"
                innerTextClassName="text-white"
              />
            </h1>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-white/8" />

      {/* Form + Info grid */}
      <section className="py-20 xl:py-32">
        <div className="w-11/12 xl:w-10/12 mx-auto grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* Form */}
          <div ref={formRef}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <CheckCircle size={52} className="text-primary mb-6" />
                <h3 className="font-display font-black text-3xl uppercase text-white mb-3">
                  Message Received
                </h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                  We&apos;ll be in touch within 24 hours. Looking forward to
                  working with you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      required
                      className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                    />
                  </div>
                  <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      required
                      className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                    />
                  </div>
                </div>

                <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone / WhatsApp"
                    className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                  />
                </div>

                <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
                  <input
                    type="text"
                    name="company"
                    placeholder="Company / Brand"
                    className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                  />
                </div>

                <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
                  <select
                    name="service"
                    defaultValue=""
                    className="w-full bg-transparent text-white/60 text-sm outline-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-black text-white/60">
                      Service of Interest
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s} className="bg-black text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
                  <select
                    name="budget"
                    defaultValue=""
                    className="w-full bg-transparent text-white/60 text-sm outline-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-black text-white/60">
                      Approximate Budget
                    </option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b} className="bg-black text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
                  <textarea
                    name="message"
                    placeholder="Tell us about your project..."
                    rows={5}
                    className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-primary text-white text-xs font-bold uppercase tracking-[0.25em] px-12 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? "Sending..." : <>Send Message <ArrowRight size={14} /></>}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div ref={infoRef} className="xl:pl-8 space-y-12">
            <p className="text-white/50 text-lg leading-relaxed">
              Go beyond typical with Movico. You&apos;re not just choosing a
              production company — you&apos;re selecting a partner who
              understands your brand and has a genuine interest in crafting
              meaningful, impactful cinematic stories.
            </p>

            <div className="space-y-8">
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
                  Phone / WhatsApp
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
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-2">
                  Business Hours
                </p>
                <p className="text-white/60 text-sm">
                  Sun – Thu &nbsp;·&nbsp; 9:00 AM – 6:00 PM AST
                </p>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4">
                Follow Us
              </p>
              <div className="flex gap-6 text-sm uppercase tracking-[0.2em] text-white/50">
                <a href="#" className="hover:text-primary transition-colors duration-300">
                  Instagram
                </a>
                <a href="#" className="hover:text-primary transition-colors duration-300">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-primary transition-colors duration-300">
                  YouTube
                </a>
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
      </section>
    </main>
  );
}
