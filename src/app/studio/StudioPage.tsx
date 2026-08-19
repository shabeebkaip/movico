"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { defaultContent } from "@/lib/cms/types";
import type { StudioContent } from "@/lib/cms/types";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: easing } },
};

// CSS `columns` only *estimates* a balanced height per column — with few,
// uneven-aspect-ratio images that estimate is often wrong and leaves whole
// columns empty. True masonry (each item goes to the currently-shortest
// column) isn't natively supported by stable browsers, so we round-robin
// items into N explicit flex columns instead — deterministic, never leaves
// a gap, since each column is just its own items stacked top to bottom.
function useColumnCount(breakpoints: { base: number; sm?: number; lg?: number; xl?: number }) {
  const [count, setCount] = useState(breakpoints.base);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (breakpoints.xl && w >= 1280) return setCount(breakpoints.xl);
      if (breakpoints.lg && w >= 1024) return setCount(breakpoints.lg);
      if (breakpoints.sm && w >= 640) return setCount(breakpoints.sm);
      setCount(breakpoints.base);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return count;
}

function MasonryGrid<T>({
  items,
  columns,
  gapClassName,
  renderItem,
}: {
  items: T[];
  columns: number;
  gapClassName: string;
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  const cols: T[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => cols[i % columns].push(item));
  return (
    <div className={`flex ${gapClassName}`}>
      {cols.map((col, ci) => (
        <div key={ci} className={`flex-1 flex flex-col ${gapClassName}`}>
          {col.map((item, i) => renderItem(item, i * columns + ci))}
        </div>
      ))}
    </div>
  );
}

export default function StudioPage() {
  const [s, setS] = useState<StudioContent>(defaultContent.studio);

  useEffect(() => {
    fetch("/api/cms/content")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.studio) setS(data.studio); })
      .catch(() => {});
  }, []);

  // Don't rely on the browser/router's native hash scroll-into-view — it's
  // unreliable here (async Satoshi font swap + whileInView mounts can still
  // shift layout after paint). Wait until the target's position stops moving
  // for a few reads, then scroll to it ourselves. Bounded so it can't hang.
  //
  // ponytail: setTimeout, not requestAnimationFrame — rAF is throttled/fully
  // paused in backgrounded/hidden tabs (e.g. cmd-click opening this link in a
  // new background tab), which would silently strand this poll forever.
  // setTimeout keeps firing (just coarser) in hidden tabs, so this completes
  // regardless of tab focus.
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    let timer = 0;
    let lastTop = NaN;
    let stableReads = 0;
    let attempt = 0;
    const INTERVAL_MS = 80;
    const MAX_ATTEMPTS = 20; // ~1.6s ceiling

    const tick = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      stableReads = top === lastTop ? stableReads + 1 : 0;
      lastTop = top;
      attempt++;
      if (stableReads >= 3 || attempt >= MAX_ATTEMPTS) {
        // Explicit "instant", not "smooth"/"auto" — the global CSS sets
        // `scroll-behavior: smooth` (src/index.css), and smooth-scroll
        // animation is gated by the same rendering pipeline as
        // requestAnimationFrame, so it silently never completes in a
        // hidden/backgrounded tab. "instant" bypasses that entirely.
        el.scrollIntoView({ behavior: "instant", block: "start" });
        return;
      }
      timer = window.setTimeout(tick, INTERVAL_MS);
    };
    timer = window.setTimeout(tick, INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY     = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY    = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textOpac = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const spacePhotoCols = useColumnCount({ base: 1, sm: 2, xl: 3 });
  const workPhotoCols  = useColumnCount({ base: 2, sm: 3, lg: 4 });
  const ctaPhotoCols   = useColumnCount({ base: 1, sm: 3 });

  return (
    <main className="bg-black text-white">

      {/* § 1  HERO */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden flex flex-col justify-end">
        <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110 origin-center">
          <Image
            src={s.hero.heroImage || "/studio/1776759672415.jpg"}
            alt="Movico Studio — main production floor, Riyadh"
            fill priority className="object-cover" sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent" />
        <div className="absolute left-0 right-0 h-px pointer-events-none" style={{ top: "62%", background: "linear-gradient(90deg,transparent 0%,rgba(217,134,41,0.35) 20%,rgba(217,134,41,0.35) 80%,transparent 100%)" }} />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none select-none" style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}>
          <span className="font-display font-black text-[11px] uppercase tracking-[0.6em] text-white/10">Movico Studio · Riyadh · KSA</span>
        </div>
        <motion.div style={{ y: textY, opacity: textOpac }} className="relative z-10 px-6 md:px-12 xl:px-20 pb-16 xl:pb-24">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-5xl">
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.55em] text-white/40 mb-7">
              Movico Studio · Riyadh, Saudi Arabia
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-display font-black uppercase leading-[0.86] mb-8" style={{ fontSize: "clamp(3rem, 9vw, 8.5rem)" }}>
              {s.hero.headlineLine1}
              <br />
              <span style={{ color: "#d98629" }}>{s.hero.headlineLine2}</span>
              <br />
              {s.hero.headlineLine3}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/55 text-base md:text-lg max-w-lg leading-relaxed mb-10">
              {s.hero.subtitle}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link href={s.hero.ctaPrimary.href} className="group relative bg-[#d98629] text-white text-[11px] font-bold uppercase tracking-[0.25em] px-8 py-4 rounded-full overflow-hidden transition-all duration-500 inline-flex items-center gap-2.5 hover:bg-white hover:text-black">
                {s.hero.ctaPrimary.text}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href={s.hero.ctaSecondary.href} className="text-[11px] font-bold uppercase tracking-[0.25em] px-8 py-4 rounded-full border border-white/25 text-white/70 hover:border-[#d98629] hover:text-white transition-all duration-300">
                {s.hero.ctaSecondary.text}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-8 right-6 md:right-12 xl:right-20 z-10 hidden md:flex items-center gap-7">
          {["Riyadh, KSA", "Available Daily", "5 Packages"].map((t) => (
            <span key={t} className="text-[9px] uppercase tracking-[0.4em] text-white/30">{t}</span>
          ))}
        </div>
      </section>

      {/* § 2  SCROLLING MARQUEE */}
      <div className="border-y border-white/8 py-4 overflow-hidden bg-[#080808]">
        <div className="flex whitespace-nowrap animate-marquee-studio will-change-transform">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 mr-8 text-[10px] uppercase tracking-[0.5em] text-white/25">
              {s.marqueeItems.map((item, j) => (
                <span key={j} className="flex items-center gap-8">
                  <span>{item}</span>
                  <span className="text-[#d98629] text-xs">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* § 3  THE SPACE */}
      <section className="py-20 xl:py-28 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex items-center gap-4 mb-12">
            <div className="w-8 h-px bg-[#d98629]" />
            <span className="text-[10px] uppercase tracking-[0.55em] text-white/35">The Space</span>
          </motion.div>

          {/* Headline + stats — its own full-width block, never paired side-by-side against a photo, so no photo's height is ever hostage to how long this text runs */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: easing }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 xl:mb-12">
            <div>
              <h2 className="font-display font-black uppercase leading-[0.9] text-white mb-5" style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}>
                {s.space.headingLine1}
                <br />
                <span style={{ color: "#d98629" }}>{s.space.headingLine2}</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-sm">{s.space.description}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:w-1/2">
              {s.space.stats.map((stat) => (
                <div key={stat.label} className="border border-white/8 rounded-xl p-4">
                  <p className="font-display font-black text-2xl text-[#d98629] leading-none mb-1">{stat.value}</p>
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Full photo set — one masonry gallery, every shot at its own natural aspect ratio, nothing cropped, no gaps regardless of orientation mix. Admin can add/remove any number of photos here. */}
          <MasonryGrid
            items={s.space.photos}
            columns={spacePhotoCols}
            gapClassName="gap-4 xl:gap-5"
            renderItem={(img, i) => (
              <motion.div key={img.src} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.08, duration: 0.7, ease: easing }} className="relative rounded-xl overflow-hidden group">
                <Image src={img.src} alt={img.label} width={0} height={0} sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw" className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-white">{img.label}</span>
                </div>
              </motion.div>
            )}
          />
        </div>
      </section>

      {/* § 4  WORK FILMSTRIP */}
      <section className="pb-20 xl:pb-28">
        <div className="px-6 md:px-12 xl:px-20 mb-10">
          <div className="w-11/12 xl:w-10/12 mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-[#d98629]" />
                <span className="text-[10px] uppercase tracking-[0.55em] text-white/35">Shot Here</span>
              </div>
              <h2 className="font-display font-black uppercase leading-[0.9] text-white" style={{ fontSize: "clamp(2.2rem, 5vw, 5rem)" }}>
                {s.work.heading}
                <br />
                <span style={{ color: "#d98629" }}>{s.work.headingAccent}</span>
              </h2>
            </motion.div>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs md:text-right">{s.work.subtext}</p>
          </div>
        </div>

        <div className="px-6 md:px-12 xl:px-20">
          <MasonryGrid
            items={s.work.images}
            columns={workPhotoCols}
            gapClassName="gap-2 xl:gap-3"
            renderItem={(img, i) => (
              <motion.div key={img.src + i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: (i % 8) * 0.05, duration: 0.7, ease: easing }} className="relative rounded-xl overflow-hidden group">
                <Image src={img.src} alt={img.alt} width={0} height={0} sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <p className="text-[9px] uppercase tracking-[0.35em] text-white/70">{img.alt}</p>
                </div>
                <div className="absolute top-3 right-3 text-[9px] font-mono text-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </motion.div>
            )}
          />
        </div>

        <div className="px-6 md:px-12 xl:px-20 mt-10">
          <div className="w-11/12 xl:w-10/12 mx-auto">
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl overflow-hidden px-8 py-7" style={{ background: "linear-gradient(135deg,rgba(217,134,41,0.08) 0%,rgba(217,134,41,0.02) 100%)", border: "1px solid rgba(217,134,41,0.2)" }}>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d98629] rounded-full" />
              <div>
                <p className="font-display font-black text-xl xl:text-2xl uppercase text-white mb-1">{s.work.inlineCTAHeading}</p>
                <p className="text-white/40 text-sm">{s.work.inlineCTASubtext}</p>
              </div>
              <Link href="/contact?service=studio" className="shrink-0 bg-[#d98629] text-white text-[11px] font-bold uppercase tracking-[0.25em] px-8 py-3.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2">
                Book a Session <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* § 5  PACKAGES */}
      <section id="packages" className="relative py-20 xl:py-28 px-6 md:px-12 xl:px-20 border-t border-white/8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.8) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(217,134,41,0.055),transparent_60%)]" />
        <div className="relative w-11/12 xl:w-10/12 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16 xl:mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-[#d98629]" />
                <span className="text-[10px] uppercase tracking-[0.55em] text-white/35">Studio Packages</span>
              </div>
              <h2 className="font-display font-black uppercase leading-[0.9] text-white" style={{ fontSize: "clamp(2.2rem, 5vw, 5rem)" }}>
                {s.packages.headingLine1}
                <br />
                <span style={{ color: "#d98629" }}>{s.packages.headingLine2}</span>
              </h2>
            </motion.div>
            <p className="text-white/35 text-sm max-w-xs leading-relaxed md:text-right">{s.packages.subtext}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
            {s.packages.items.map((pkg, i) => (
              <motion.div key={pkg.number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.6 }} className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:border-white/20 ${pkg.highlight ? "border-[#d98629]/50 bg-[rgba(217,134,41,0.04)]" : "border-white/[0.07] bg-[#080808]"}`}>
                {pkg.highlight && <div className="h-[2px] bg-[#d98629] w-full" />}
                <div className="flex flex-col flex-1 p-6 xl:p-8">
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-display font-black leading-none ${pkg.highlight ? "text-[#d98629]" : "text-white/15"}`} style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}>{pkg.number}</span>
                    {pkg.highlight && <span className="text-[9px] font-bold tracking-[0.4em] bg-[#d98629] text-white px-2.5 py-1 rounded-full">PREMIUM</span>}
                  </div>
                  <h3 className="font-display font-black uppercase text-white leading-tight mb-1" style={{ fontSize: "clamp(1rem, 1.8vw, 1.35rem)" }}>{pkg.title}</h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/35 mb-4">{pkg.tagline}</p>
                  <p className="text-white/45 text-sm leading-relaxed mb-6">{pkg.description}</p>
                  <div className="flex flex-col gap-2.5 mb-8 flex-1">
                    {pkg.includes.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <Check size={12} className="text-[#d98629] shrink-0" />
                        <span className="text-white/60 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`/contact?service=studio&package=${pkg.number}`} className={`inline-flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] px-6 py-3.5 rounded-full transition-all duration-300 ${pkg.highlight ? "bg-[#d98629] text-white hover:bg-white hover:text-black" : "border border-white/20 text-white/60 hover:border-[#d98629] hover:text-white"}`}>
                    Book this package <ArrowUpRight size={11} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* § 6  QUOTE BREAK */}
      <section className="relative py-24 xl:py-36 px-6 md:px-12 xl:px-20 border-t border-white/8 overflow-hidden">
        <Image src={s.quote.bgImage || "/studio/1776759672622.jpg"} alt="Movico Studio atmosphere" fill className="object-cover opacity-10" sizes="100vw" />
        <div className="absolute inset-0 bg-black/60" />
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="relative z-10 w-11/12 xl:w-10/12 mx-auto">
          <p className="font-display font-black uppercase leading-[0.88] text-white" style={{ fontSize: "clamp(2rem, 7vw, 7rem)" }}>
            <span className="text-white">{s.quote.line1}</span>
            <br />
            <span style={{ color: "#d98629" }}>{s.quote.line2}</span>
            <br />
            <span className="text-white">{s.quote.line3}</span>
          </p>
        </motion.div>
      </section>

      {/* § 7  FINAL CTA */}
      <section className="py-20 xl:py-28 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          {/* Text card — full width, standalone, not paired against the photos below */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: easing }} className="bg-[#080808] border border-white/[0.06] rounded-2xl p-8 xl:p-12 mb-4 xl:mb-5">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-px bg-[#d98629]" />
                  <span className="text-[10px] uppercase tracking-[0.55em] text-white/35">Let&apos;s Create</span>
                </div>
                <h2 className="font-display font-black uppercase leading-[0.88] text-white mb-6" style={{ fontSize: "clamp(2.2rem, 4vw, 4rem)" }}>
                  {s.finalCTA.headingLine1}
                  <br />
                  <span style={{ color: "#d98629" }}>{s.finalCTA.headingLine2}</span>
                  <br />
                  {s.finalCTA.headingLine3}
                </h2>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm">{s.finalCTA.body}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href={s.finalCTA.ctaPrimary.href} className="group flex-1 bg-[#d98629] text-white text-[11px] font-bold uppercase tracking-[0.25em] px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center justify-center gap-2">
                  {s.finalCTA.ctaPrimary.text}
                  <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href={s.finalCTA.ctaSecondary.href} className="flex-1 border border-white/15 text-white/60 text-[11px] font-bold uppercase tracking-[0.25em] px-8 py-4 rounded-full hover:border-[#d98629] hover:text-white transition-all duration-300 inline-flex items-center justify-center">
                  {s.finalCTA.ctaSecondary.text}
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Photo set — masonry, uncropped. Admin can add/remove any number of photos here. */}
          <MasonryGrid
            items={s.finalCTA.images}
            columns={ctaPhotoCols}
            gapClassName="gap-4 xl:gap-5"
            renderItem={(src, i) => (
              <motion.div key={src + i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.08, duration: 0.7, ease: easing }} className="relative rounded-xl overflow-hidden group">
                <Image src={src} alt="Movico Studio" width={0} height={0} sizes="(max-width:640px) 100vw, 33vw" className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" />
              </motion.div>
            )}
          />
        </div>
      </section>

    </main>
  );
}
