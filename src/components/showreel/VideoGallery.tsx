"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { type VideoItem, driveThumb, driveEmbed } from "@/lib/showreel-data";

/* ─── helpers ───────────────────────────────────────── */
function groupByCategory(videos: VideoItem[]) {
  return videos.reduce<Record<string, VideoItem[]>>((acc, v) => {
    (acc[v.category] ??= []).push(v);
    return acc;
  }, {});
}

/* ─── VideoCard ─────────────────────────────────────── */
function VideoCard({
  video,
  onPlay,
}: {
  video: VideoItem;
  onPlay: (v: VideoItem) => void;
}) {
  return (
    <button
      onClick={() => onPlay(video)}
      className="group/card shrink-0 relative w-[240px] md:w-[280px] xl:w-[320px] aspect-video overflow-hidden rounded-sm cursor-pointer focus:outline-none"
    >
      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={driveThumb(video.id)}
        alt={video.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
      />

      {/* Always-on dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

      {/* Category chip */}
      <span className="absolute top-2.5 right-2.5 text-[9px] uppercase tracking-[0.2em] bg-black/70 text-white/60 px-2 py-0.5 backdrop-blur-sm rounded-full">
        {video.category}
      </span>

      {/* Play + info (slides up on hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(217,134,41,0.6)]">
            <Play size={10} fill="white" className="text-white ml-0.5" />
          </div>
        </div>
        {video.client && (
          <p className="text-white/50 text-[9px] uppercase tracking-[0.25em] leading-none mb-0.5">
            {video.client}
          </p>
        )}
        <h3 className="font-display font-black text-xs xl:text-sm uppercase text-white leading-tight">
          {video.title}
        </h3>
      </div>

      {/* Always-on title at bottom (dimmed) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 group-hover/card:opacity-0 transition-opacity duration-200">
        <p className="font-display font-black text-xs uppercase text-white/70 leading-tight truncate">
          {video.title}
        </p>
      </div>
    </button>
  );
}

/* ─── ScrollRow ─────────────────────────────────────── */
function ScrollRow({
  title,
  videos,
  onPlay,
}: {
  title: string;
  videos: VideoItem[];
  onPlay: (v: VideoItem) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") =>
    ref.current?.scrollBy({ left: dir === "right" ? 900 : -900, behavior: "smooth" });

  return (
    <div className="mb-10 group/row">
      {/* Row header */}
      <div className="flex items-center gap-3 px-4 md:px-8 xl:px-14 mb-3">
        <h2 className="font-display font-black text-sm xl:text-base uppercase tracking-widest text-white">
          {title}
        </h2>
        <span className="text-white/25 text-[9px] uppercase tracking-widest mt-0.5">
          {videos.length} {videos.length === 1 ? "film" : "films"}
        </span>
      </div>

      {/* Scrollable track */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/80 border border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-primary hover:border-primary transition-all duration-300 shadow-lg"
        >
          <ChevronLeft size={16} className="text-white" />
        </button>

        <div
          ref={ref}
          className="flex gap-2 overflow-x-auto no-scrollbar px-4 md:px-8 xl:px-14 pb-1"
        >
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} onPlay={onPlay} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/80 border border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-primary hover:border-primary transition-all duration-300 shadow-lg"
        >
          <ChevronRight size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}

/* ─── VideoModal ────────────────────────────────────── */
function VideoModal({
  video,
  onClose,
}: {
  video: VideoItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/97 backdrop-blur-2xl" />

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,134,41,0.06),transparent_65%)] pointer-events-none" />

      {/* Close button — fixed top-right */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 backdrop-blur-sm"
      >
        <X size={16} />
      </button>

      {/* Content */}
      <div
        className="relative w-full max-w-6xl px-4 md:px-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-4 mb-5">
          {/* Orange accent line */}
          <div className="w-[3px] h-12 bg-primary rounded-full shrink-0" />
          <div>
            {video.client && (
              <p className="text-primary text-[10px] uppercase tracking-[0.45em] mb-0.5 font-semibold">
                {video.client}
              </p>
            )}
            <h2 className="font-display font-black text-2xl xl:text-4xl uppercase text-white leading-none">
              {video.title}
            </h2>
          </div>
          <span className="ml-auto text-[9px] uppercase tracking-[0.35em] text-white/20 border border-white/10 px-3 py-1 rounded-full">
            {video.category}
          </span>
        </div>

        {/* Player frame */}
        <div className="relative aspect-video bg-black rounded-sm overflow-hidden
                        shadow-[0_0_0_1px_rgba(217,134,41,0.25),0_0_80px_rgba(217,134,41,0.08)]">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/60 z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/60 z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/60 z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/60 z-10 pointer-events-none" />

          <iframe
            src={`${driveEmbed(video.id)}?autoplay=1`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>

        {/* CTA strip */}
        <div className="mt-4 border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-display font-black text-base xl:text-xl uppercase text-white leading-tight mb-1">
              Want a film like this <span className="text-primary">for your brand?</span>
            </p>
            <p className="text-white/40 text-xs leading-relaxed">
              We respond within 24 hours. No commitment required.
            </p>
          </div>
          <Link
            href="/contact"
            onClick={onClose}
            className="shrink-0 inline-flex items-center gap-2 bg-primary text-white text-xs font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(217,134,41,0.4)] hover:shadow-none animate-pulse"
          >
            Start a Project <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────── */
export default function VideoGallery({
  highlights,
  works,
}: {
  highlights: VideoItem[];
  works: VideoItem[];
}) {
  const [active, setActive] = useState<VideoItem | null>(null);
  const close = useCallback(() => setActive(null), []);

  const featured = highlights[0];
  const categoryGroups = groupByCategory(works);
  const categoryOrder = ["Event", "Corporate", "Commercial", "Brand Film", "Documentary", "Sport"];

  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO — full-bleed featured film
      ══════════════════════════════════════════════ */}
      <section className="relative w-full h-[75vh] xl:h-[85vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={driveThumb(featured.id)}
          alt={featured.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Left-to-right fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
        {/* Bottom fade into content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        {/* Hero content */}
        <div className="absolute bottom-24 xl:bottom-36 left-4 md:left-8 xl:left-14 max-w-2xl">
          <p className="text-primary text-[10px] uppercase tracking-[0.4em] mb-3 font-semibold">
            {featured.client && `${featured.client} · `}{featured.category}
          </p>
          <h1 className="font-display font-black text-4xl md:text-6xl xl:text-7xl uppercase text-white leading-[0.9] mb-6">
            {featured.title}
          </h1>
          <p className="text-white/50 text-sm mb-8 max-w-md leading-relaxed">
            Movico's latest featured film — cinematic storytelling built for Saudi Arabia's most ambitious brands.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActive(featured)}
              className="inline-flex items-center gap-3 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] px-8 py-3.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Play size={14} fill="currentColor" /> Watch Now
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm text-white font-bold text-xs uppercase tracking-[0.2em] px-8 py-3.5 rounded-full hover:bg-white/25 border border-white/20 transition-all duration-300"
            >
              <Info size={14} /> Start a Project
            </Link>
          </div>
        </div>

        {/* Total count badge */}
        <div className="absolute top-28 right-4 md:right-8 xl:right-14 text-right">
          <div className="font-display font-black text-5xl xl:text-6xl text-white/[0.06] leading-none select-none">
            {highlights.length + works.length}
          </div>
          <div className="text-white/20 text-[9px] uppercase tracking-[0.3em]">Films</div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTENT — rows overlap the hero slightly
      ══════════════════════════════════════════════ */}
      <div className="relative -mt-32 z-10 pb-20">

        {/* ── Highlights row ── */}
        <div className="mb-14">
          <ScrollRow
            title="✦ Highlights"
            videos={highlights}
            onPlay={setActive}
          />
        </div>

        {/* ── Inline CTA strip ── */}
        <div className="mx-4 md:mx-8 xl:mx-14 mb-14 border border-primary/20 bg-primary/5 rounded-sm px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-white/60 text-sm leading-relaxed max-w-lg">
            Seen enough? Our team produces films, commercials, and brand content across Saudi Arabia and the GCC.
          </p>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] px-7 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            Start a Project <ArrowRight size={12} />
          </Link>
        </div>

        {/* ── Video works by category ── */}
        <div className="mb-6 px-4 md:px-8 xl:px-14">
          <span className="text-white/20 text-[10px] uppercase tracking-[0.5em]">
            Video Works · {works.length} films
          </span>
        </div>

        {categoryOrder.map((cat) => {
          const vids = categoryGroups[cat];
          if (!vids || vids.length === 0) return null;
          return (
            <ScrollRow
              key={cat}
              title={cat}
              videos={vids}
              onPlay={setActive}
            />
          );
        })}

        {/* Any categories not in the order array */}
        {Object.entries(categoryGroups)
          .filter(([cat]) => !categoryOrder.includes(cat))
          .map(([cat, vids]) => (
            <ScrollRow key={cat} title={cat} videos={vids} onPlay={setActive} />
          ))}

        {/* ── Final CTA ── */}
        <div className="mx-4 md:mx-8 xl:mx-14 mt-10 bg-primary/5 border border-primary/20 px-10 py-14 text-center">
          <span className="text-white/25 text-[10px] uppercase tracking-[0.5em] block mb-4">
            Ready to Create
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-white mb-6 leading-tight">
            Let's make your <span className="text-primary">next film.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300"
            >
              Get in Touch <ArrowRight size={14} />
            </Link>
            <Link
              href="/services/video-production"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:border-white transition-all duration-300"
            >
              Our Services
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      {active && <VideoModal video={active} onClose={close} />}
    </>
  );
}
