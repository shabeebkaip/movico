"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function LandingHero({
  videoUrl,
  posterUrl,
}: {
  videoUrl: string;
  posterUrl: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative pt-40 pb-24 xl:pt-56 xl:pb-32 px-6 md:px-12 xl:px-20 overflow-hidden min-h-[85vh] flex items-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={posterUrl}
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/75 to-black/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,134,41,0.1),transparent_65%)]" />

      <div className="relative w-11/12 xl:w-10/12 mx-auto text-center">
        <motion.span
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          custom={0}
          variants={fadeUp}
          className="uppercase tracking-[0.5em] text-[10px] text-primary block mb-6"
        >
          Free Discovery Call — No Obligation
        </motion.span>

        <motion.h1
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          custom={1}
          variants={fadeUp}
          className="font-display font-black text-5xl md:text-7xl xl:text-[8rem] uppercase leading-[0.9] mb-8"
        >
          Premium Video
          <br />
          Production in
          <br />
          <span className="text-primary">Saudi Arabia</span>
        </motion.h1>

        <motion.p
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          custom={2}
          variants={fadeUp}
          className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Movico is Riyadh&apos;s leading creative production company — trusted by Nokia, Saudi Aramco, Philips, and more. Tell us about your project and we&apos;ll show you exactly how we can help.
        </motion.p>

        <motion.div
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          custom={3}
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#booking"
            className="bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-white hover:text-black active:scale-97 transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            Book a Discovery Call <ArrowRight size={14} />
          </a>
          <Link
            href="/#showreel"
            className="border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:border-primary hover:text-primary active:scale-97 transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            <Play size={12} /> Watch Our Reel
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
