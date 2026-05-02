"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

const highlights = [
  { value: "12+", label: "Light Sources" },
  { value: "5",   label: "Studio Packages" },
  { value: "4K+", label: "Camera Capability" },
  { value: "∞",   label: "Creative Setups" },
];

export default function StudioPromo() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 xl:py-32 px-6 md:px-12 xl:px-20 bg-black overflow-hidden"
    >
      {/* Subtle amber top glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_20%_0%,rgba(217,134,41,0.06),transparent_60%)]" />

      <div className="relative w-11/12 xl:w-10/12 mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[58fr_42fr] gap-8 xl:gap-12 items-center">

          {/* ── Image side ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden"
            style={{ minHeight: 480 }}
          >
            {/* Parallax image */}
            <motion.div
              style={{ y: imgY }}
              className="absolute inset-[-8%] w-[116%] h-[116%]"
            >
              <Image
                src="/studio/1776759672085.jpg"
                alt="Movico Studio — production floor Riyadh"
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 58vw"
              />
            </motion.div>

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/25" />

            {/* Amber viewfinder corners */}
            <div className="absolute top-5 left-5 w-7 h-7 border-t-2 border-l-2 border-primary/50 pointer-events-none" />
            <div className="absolute top-5 right-5 w-7 h-7 border-t-2 border-r-2 border-primary/50 pointer-events-none" />
            <div className="absolute bottom-5 left-5 w-7 h-7 border-b-2 border-l-2 border-primary/50 pointer-events-none" />
            <div className="absolute bottom-5 right-5 w-7 h-7 border-b-2 border-r-2 border-primary/50 pointer-events-none" />

            {/* Bottom caption chip */}
            <div className="absolute bottom-6 left-6">
              <span className="text-[9px] uppercase tracking-[0.45em] text-white/50 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                Movico Studio · Riyadh, KSA
              </span>
            </div>

            {/* Small inset — makeup room */}
            <div
              className="absolute bottom-6 right-6 w-28 xl:w-36 rounded-xl overflow-hidden border border-white/10"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src="/studio/1776759672291.jpg"
                alt="Studio makeup room"
                fill
                className="object-cover"
                style={{ objectPosition: "center top" }}
                sizes="150px"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </motion.div>

          {/* ── Copy side ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Label */}
            <div className="flex items-center gap-4 mb-7">
              <div className="w-8 h-px bg-primary" />
              <span className="text-[10px] uppercase tracking-[0.55em] text-white/35">
                Movico Studio
              </span>
            </div>

            {/* Headline */}
            <h2
              className="font-display font-black uppercase leading-[0.88] text-white mb-6"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 4.2rem)" }}
            >
              The space behind
              <br />
              <span className="text-primary">every frame.</span>
            </h2>

            <p className="text-white/45 text-base leading-relaxed mb-10 max-w-sm">
              A fully equipped production studio in the heart of Riyadh. Rent
              the floor, bring our crew, or hand us the full project — five
              packages built around your vision.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {highlights.map((h) => (
                <div
                  key={h.label}
                  className="border border-white/[0.07] rounded-xl px-4 py-4 bg-white/[0.02]"
                >
                  <p className="font-display font-black text-2xl xl:text-3xl text-primary leading-none mb-1">
                    {h.value}
                  </p>
                  <p className="text-white/35 text-[10px] uppercase tracking-[0.3em]">
                    {h.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/studio"
                className="group inline-flex items-center gap-2.5 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em] px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                Tour the Studio
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/studio#packages"
                className="inline-flex items-center gap-2.5 border border-white/20 text-white/60 text-[11px] font-bold uppercase tracking-[0.25em] px-8 py-4 rounded-full hover:border-primary hover:text-white transition-all duration-300"
              >
                View Packages
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
