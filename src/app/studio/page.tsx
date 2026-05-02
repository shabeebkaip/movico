"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────── */

const packages = [
  {
    number: "01",
    title: "Studio Floor Rental",
    tagline: "Your space, your rules.",
    description: "A fully equipped professional studio for rent. Ideal for independent creators who need a reliable, ready-to-use environment.",
    includes: ["Spacious studio floor", "Basic lighting setup", "Power access", "Changing area"],
    highlight: false,
  },
  {
    number: "02",
    title: "Floor + Equipment",
    tagline: "Better quality, zero logistics.",
    description: "Professional equipment included. Designed for creators who want elevated quality without managing the overhead.",
    includes: ["Studio floor", "Professional lighting setups", "Camera support equipment", "Grip and accessories"],
    highlight: false,
  },
  {
    number: "03",
    title: "Floor + Production Team",
    tagline: "Bring the vision. We handle the rest.",
    description: "Our experienced crew steps in. Perfect for brands who want a seamlessly guided shoot from start to finish.",
    includes: ["Studio floor", "Equipment setup", "Production crew", "Shoot management support"],
    highlight: false,
  },
  {
    number: "04",
    title: "Production + Post",
    tagline: "Captured and delivered, polished.",
    description: "End-to-end — from shoot floor to final delivery. Your content captured, graded, and ready to publish.",
    includes: ["Studio floor", "Full production team", "Editing and colour grading", "Final output delivery"],
    highlight: false,
  },
  {
    number: "05",
    title: "Premium Package",
    tagline: "From concept to final frame — everything.",
    description: "Full-scale production for high-end campaigns, brand films, and commercials. Every element handled under one roof.",
    includes: ["Studio space", "Professional models", "Complete production team", "Advanced equipment", "Post-production — editing, grading, sound", "Creative direction support"],
    highlight: true,
  },
];

const workImages = [
  { src: "/studio/DSC00405.jpg",  alt: "Fashion shoot — vibrant backdrop", wide: false },
  { src: "/studio/DSC00251.jpg",  alt: "Teal background portrait session", wide: false },
  { src: "/studio/DSC00336.jpg",  alt: "Group brand campaign", wide: true  },
  { src: "/studio/DSC00358.jpg",  alt: "Editorial portrait session", wide: false },
  { src: "/studio/DSC01860.jpg",  alt: "Fashion editorial", wide: false },
  { src: "/studio/DSC00369.jpg",  alt: "Vibrant color session", wide: false },
  { src: "/studio/DSC01903.jpg",  alt: "Lifestyle campaign shoot", wide: true  },
  { src: "/studio/DSC02006.jpg",  alt: "Minimal portrait shoot", wide: false },
  { src: "/studio/DSC00346.jpg",  alt: "Purple editorial session", wide: false },
  { src: "/studio/DSC00269.jpg",  alt: "Content creator shoot", wide: false },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: easing } },
};

/* ─── Page ──────────────────────────────────────────────── */

export default function StudioPage() {
  const heroRef    = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY       = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY      = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textOpac   = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <main className="bg-black text-white">

      {/* ══════════════════════════════════════════════════
          § 1  HERO
      ══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden flex flex-col justify-end"
      >
        {/* Parallax image */}
        <motion.div
          style={{ y: imgY }}
          className="absolute inset-0 scale-110 origin-center"
        >
          <Image
            src="/studio/1776759672415.jpg"
            alt="Movico Studio — main production floor, Riyadh"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent" />

        {/* Viewfinder amber line */}
        <div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ top: "62%", background: "linear-gradient(90deg, transparent 0%, rgba(217,134,41,0.35) 20%, rgba(217,134,41,0.35) 80%, transparent 100%)" }}
        />

        {/* Vertical "STUDIO" watermark */}
        <div
          className="absolute left-5 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none select-none"
          style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}
        >
          <span className="font-display font-black text-[11px] uppercase tracking-[0.6em] text-white/10">
            Movico Studio · Riyadh · KSA
          </span>
        </div>

        {/* Content */}
        <motion.div
          style={{ y: textY, opacity: textOpac }}
          className="relative z-10 px-6 md:px-12 xl:px-20 pb-16 xl:pb-24"
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-5xl"
          >
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.55em] text-white/40 mb-7">
              Movico Studio · Riyadh, Saudi Arabia
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-display font-black uppercase leading-[0.86] mb-8"
              style={{ fontSize: "clamp(3rem, 9vw, 8.5rem)" }}
            >
              Every great visual
              <br />
              <span style={{ color: "#d98629" }}>begins in the</span>
              <br />
              right space.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-white/55 text-base md:text-lg max-w-lg leading-relaxed mb-10"
            >
              Built for creators, brands, and storytellers. From controlled
              lighting environments to complete production support — the studio
              adapts to your vision, not the other way around.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link
                href="/contact?service=studio"
                className="group relative bg-[#d98629] text-white text-[11px] font-bold uppercase tracking-[0.25em] px-8 py-4 rounded-full overflow-hidden transition-all duration-500 inline-flex items-center gap-2.5 hover:bg-white hover:text-black"
              >
                Book the Studio
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="#packages"
                className="text-[11px] font-bold uppercase tracking-[0.25em] px-8 py-4 rounded-full border border-white/25 text-white/70 hover:border-[#d98629] hover:text-white transition-all duration-300"
              >
                View Packages
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom-right stat strip */}
        <div className="absolute bottom-8 right-6 md:right-12 xl:right-20 z-10 hidden md:flex items-center gap-7">
          {["Riyadh, KSA", "Available Daily", "5 Packages"].map((s) => (
            <span key={s} className="text-[9px] uppercase tracking-[0.4em] text-white/30">{s}</span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 2  SCROLLING FACT MARQUEE
      ══════════════════════════════════════════════════ */}
      <div className="border-y border-white/8 py-4 overflow-hidden bg-[#080808]">
        <div className="flex whitespace-nowrap animate-marquee-studio will-change-transform">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 mr-8 text-[10px] uppercase tracking-[0.5em] text-white/25">
              <span>Full Lighting Control</span>
              <span className="text-[#d98629] text-xs">·</span>
              <span>4K+ Camera Equipment</span>
              <span className="text-[#d98629] text-xs">·</span>
              <span>5 Studio Packages</span>
              <span className="text-[#d98629] text-xs">·</span>
              <span>Riyadh, KSA</span>
              <span className="text-[#d98629] text-xs">·</span>
              <span>Open Daily</span>
              <span className="text-[#d98629] text-xs">·</span>
              <span>Professional Crew Available</span>
              <span className="text-[#d98629] text-xs">·</span>
              <span>Post-Production In-House</span>
              <span className="text-[#d98629] text-xs">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          § 3  THE SPACE — editorial split layout
      ══════════════════════════════════════════════════ */}
      <section className="py-20 xl:py-28 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-8 h-px bg-[#d98629]" />
            <span className="text-[10px] uppercase tracking-[0.55em] text-white/35">The Space</span>
          </motion.div>

          {/* Asymmetric: 55/45 split */}
          <div className="grid grid-cols-1 xl:grid-cols-[55fr_45fr] gap-4 xl:gap-5 mb-4 xl:mb-5">

            {/* Left — tall hero interior */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl overflow-hidden group"
              style={{ minHeight: 480 }}
            >
              <Image
                src="/studio/1776759672085.jpg"
                alt="Studio main floor — warm setup"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-103"
                sizes="(max-width: 1280px) 100vw, 55vw"
              />
              {/* Amber crop-mark corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#d98629]/40 pointer-events-none" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#d98629]/40 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#d98629]/40 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#d98629]/40 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="text-[9px] uppercase tracking-[0.4em] text-white/50 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">Main Studio Floor</span>
              </div>
            </motion.div>

            {/* Right — stacked smaller + headline */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="flex flex-col gap-4 xl:gap-5"
            >
              {/* Headline card */}
              <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-8 xl:p-10 flex flex-col justify-between flex-1">
                <div>
                  <h2
                    className="font-display font-black uppercase leading-[0.9] text-white mb-5"
                    style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                  >
                    Step inside
                    <br />
                    <span style={{ color: "#d98629" }}>the studio.</span>
                  </h2>
                  <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                    Designed from the ground up for premium production. Flexible
                    setups, full lighting control, and every tool on-hand.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    { n: "12+", l: "Light Sources" },
                    { n: "5",   l: "Backdrop Colours" },
                    { n: "4K",  l: "Camera Capability" },
                    { n: "∞",   l: "Creative Setups" },
                  ].map((s) => (
                    <div key={s.l} className="border border-white/8 rounded-xl p-4">
                      <p className="font-display font-black text-2xl text-[#d98629] leading-none mb-1">{s.n}</p>
                      <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Small image */}
              <div className="relative rounded-2xl overflow-hidden group" style={{ height: 240 }}>
                <Image
                  src="/studio/1776759672394.jpg"
                  alt="Studio lounge and backdrop area"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: "center 60%" }}
                  sizes="45vw"
                />
              </div>
            </motion.div>
          </div>

          {/* Three-up row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-5">
            {[
              { src: "/studio/1776759672182.jpg", label: "Lighting Corner",  pos: "center center" },
              { src: "/studio/1776759672064.jpg", label: "Cyclorama Floor",  pos: "center 30%"    },
              { src: "/studio/1776759672332.jpg", label: "Backdrop Zone",    pos: "center center" },
            ].map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-xl overflow-hidden group"
                style={{ height: 260 }}
              >
                <Image
                  src={img.src}
                  alt={img.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: img.pos }}
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-white">{img.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 4  WORK FILMSTRIP — horizontal scroll
      ══════════════════════════════════════════════════ */}
      <section className="pb-20 xl:pb-28">

        {/* Heading */}
        <div className="px-6 md:px-12 xl:px-20 mb-10">
          <div className="w-11/12 xl:w-10/12 mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-[#d98629]" />
                <span className="text-[10px] uppercase tracking-[0.55em] text-white/35">Shot Here</span>
              </div>
              <h2
                className="font-display font-black uppercase leading-[0.9] text-white"
                style={{ fontSize: "clamp(2.2rem, 5vw, 5rem)" }}
              >
                This is what
                <br />
                <span style={{ color: "#d98629" }}>you can create.</span>
              </h2>
            </motion.div>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs md:text-right">
              Every image below was produced inside Movico Studio — by brands,
              creators, and campaigns just like yours.
            </p>
          </div>
        </div>

        {/* Horizontal filmstrip */}
        <div
          className="flex gap-2 xl:gap-3 overflow-x-auto px-6 md:px-12 xl:px-20 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {workImages.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex-none rounded-xl overflow-hidden group ${
                img.wide ? "w-64 md:w-80" : "w-44 md:w-56"
              }`}
              style={{ height: 420 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="300px"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <p className="text-[9px] uppercase tracking-[0.35em] text-white/70">{img.alt}</p>
              </div>
              {/* Frame number — film contact sheet aesthetic */}
              <div className="absolute top-3 right-3 text-[9px] font-mono text-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {String(i + 1).padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Inline booking nudge */}
        <div className="px-6 md:px-12 xl:px-20 mt-10">
          <div className="w-11/12 xl:w-10/12 mx-auto">
            <div
              className="relative flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl overflow-hidden px-8 py-7"
              style={{ background: "linear-gradient(135deg, rgba(217,134,41,0.08) 0%, rgba(217,134,41,0.02) 100%)", border: "1px solid rgba(217,134,41,0.2)" }}
            >
              {/* Amber glow */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d98629] rounded-full" />
              <div>
                <p className="font-display font-black text-xl xl:text-2xl uppercase text-white mb-1">
                  Ready to create yours?
                </p>
                <p className="text-white/40 text-sm">Walk in with your vision. Walk out with content.</p>
              </div>
              <Link
                href="/contact?service=studio"
                className="shrink-0 bg-[#d98629] text-white text-[11px] font-bold uppercase tracking-[0.25em] px-8 py-3.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2"
              >
                Book a Session <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 5  PACKAGES — luxury menu accordion
      ══════════════════════════════════════════════════ */}
      <section
        id="packages"
        className="relative py-20 xl:py-28 px-6 md:px-12 xl:px-20 border-t border-white/8 overflow-hidden"
      >
        {/* Dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Top amber glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(217,134,41,0.055),transparent_60%)]" />

        <div className="relative w-11/12 xl:w-10/12 mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16 xl:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-[#d98629]" />
                <span className="text-[10px] uppercase tracking-[0.55em] text-white/35">Studio Packages</span>
              </div>
              <h2
                className="font-display font-black uppercase leading-[0.9] text-white"
                style={{ fontSize: "clamp(2.2rem, 5vw, 5rem)" }}
              >
                Flexible solutions
                <br />
                <span style={{ color: "#d98629" }}>for every shoot.</span>
              </h2>
            </motion.div>
            <p className="text-white/35 text-sm max-w-xs leading-relaxed md:text-right">
              Five packages, one studio. Every option can be customised — just ask.
            </p>
          </div>

          {/* Package cards — all details always visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.6 }}
                className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:border-white/20 ${
                  pkg.highlight
                    ? "border-[#d98629]/50 bg-[rgba(217,134,41,0.04)]"
                    : "border-white/[0.07] bg-[#080808]"
                }`}
              >
                {/* Amber top bar for premium */}
                {pkg.highlight && (
                  <div className="h-[2px] bg-[#d98629] w-full" />
                )}

                <div className="flex flex-col flex-1 p-6 xl:p-8">
                  {/* Number + badge */}
                  <div className="flex items-start justify-between mb-5">
                    <span
                      className={`font-display font-black leading-none ${
                        pkg.highlight ? "text-[#d98629]" : "text-white/15"
                      }`}
                      style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}
                    >
                      {pkg.number}
                    </span>
                    {pkg.highlight && (
                      <span className="text-[9px] font-bold tracking-[0.4em] bg-[#d98629] text-white px-2.5 py-1 rounded-full">
                        PREMIUM
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black uppercase text-white leading-tight mb-1" style={{ fontSize: "clamp(1rem, 1.8vw, 1.35rem)" }}>
                    {pkg.title}
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/35 mb-4">{pkg.tagline}</p>

                  {/* Description */}
                  <p className="text-white/45 text-sm leading-relaxed mb-6">{pkg.description}</p>

                  {/* Includes list */}
                  <div className="flex flex-col gap-2.5 mb-8 flex-1">
                    {pkg.includes.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <Check size={12} className="text-[#d98629] shrink-0" />
                        <span className="text-white/60 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA — always visible */}
                  <Link
                    href={`/contact?service=studio&package=${pkg.number}`}
                    className={`inline-flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] px-6 py-3.5 rounded-full transition-all duration-300 ${
                      pkg.highlight
                        ? "bg-[#d98629] text-white hover:bg-white hover:text-black"
                        : "border border-white/20 text-white/60 hover:border-[#d98629] hover:text-white"
                    }`}
                  >
                    Book this package <ArrowUpRight size={11} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 6  TYPOGRAPHIC QUOTE BREAK
      ══════════════════════════════════════════════════ */}
      <section className="relative py-24 xl:py-36 px-6 md:px-12 xl:px-20 border-t border-white/8 overflow-hidden">
        {/* Studio image — darkened */}
        <Image
          src="/studio/1776759672622.jpg"
          alt="Movico Studio atmosphere"
          fill
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative z-10 w-11/12 xl:w-10/12 mx-auto"
        >
          <p
            className="font-display font-black uppercase leading-[0.88] text-white"
            style={{ fontSize: "clamp(2rem, 7vw, 7rem)" }}
          >
            From a single frame
            <br />
            <span className="text-white/20">to a complete story —</span>
            <br />
            <span style={{ color: "#d98629" }}>Movico Studio</span>
            <br />
            <span className="text-white">is where your vision</span>
            <br />
            <span className="text-white/20">becomes </span>
            <span className="text-white">real.</span>
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 7  FINAL CTA — split image + copy
      ══════════════════════════════════════════════════ */}
      <section className="py-20 xl:py-28 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-5 items-stretch">

            {/* Image side — 2×2 collage with amber overlay on first */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-3 xl:gap-4"
            >
              {/* Large image with amber overlay */}
              <div className="col-span-2 relative rounded-2xl overflow-hidden group" style={{ height: 280 }}>
                <Image src="/studio/1776759672291.jpg" alt="Hollywood vanity makeup room" fill className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: "center top" }} sizes="50vw" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(217,134,41,0.20) 0%, transparent 70%)" }} />
              </div>
              {/* Two smaller */}
              <div className="relative rounded-xl overflow-hidden group" style={{ height: 200 }}>
                <Image src="/studio/DSC01860.jpg" alt="Fashion session" fill className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: "center 15%" }} sizes="25vw" />
              </div>
              <div className="relative rounded-xl overflow-hidden group" style={{ height: 200 }}>
                <Image src="/studio/1776759672218.jpg" alt="Studio bar counter setup" fill className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: "center top" }} sizes="25vw" />
              </div>
            </motion.div>

            {/* Copy + CTA side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="bg-[#080808] border border-white/[0.06] rounded-2xl p-8 xl:p-12 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-px bg-[#d98629]" />
                  <span className="text-[10px] uppercase tracking-[0.55em] text-white/35">Let&apos;s Create</span>
                </div>
                <h2
                  className="font-display font-black uppercase leading-[0.88] text-white mb-6"
                  style={{ fontSize: "clamp(2.2rem, 4vw, 4rem)" }}
                >
                  Your shoot.
                  <br />
                  <span style={{ color: "#d98629" }}>Our studio.</span>
                  <br />
                  Let&apos;s go.
                </h2>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                  Whether you&apos;re a brand, a creator, or an agency — Movico Studio
                  is equipped to make your next project look exceptional. Book a
                  session or talk to us about a full production package.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <Link
                  href="/contact?service=studio"
                  className="group flex-1 bg-[#d98629] text-white text-[11px] font-bold uppercase tracking-[0.25em] px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  Book the Studio
                  <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#packages"
                  className="flex-1 border border-white/15 text-white/60 text-[11px] font-bold uppercase tracking-[0.25em] px-8 py-4 rounded-full hover:border-[#d98629] hover:text-white transition-all duration-300 inline-flex items-center justify-center"
                >
                  See Packages
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </main>
  );
}
