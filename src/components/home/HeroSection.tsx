"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Cinematic motion
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]); // slow push-in

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-black pt-32"
    >
      {/* Video Background */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          className="w-full h-full object-cover"
          style={{ willChange: 'transform' }}
        >
          <source src="https://res.cloudinary.com/dm5c31z7w/video/upload/v1769938198/0201_loykmi.mp4" type="video/mp4" />
        </video>

        {/* Base Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Left Cinematic Gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.85))]" />

        {/* Subtle Film Grain */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop')]" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 container mx-auto px-6"
      >
        <div className="max-w-5xl">

          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="uppercase tracking-[0.5em] text-xs text-white/60 font-medium"
          >
            Riyadh Based Production Studio
          </motion.span>

          {/* Cinematic Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 font-display text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-bold leading-[0.85] tracking-[-0.02em] text-white"
          >
            Cinematic Production
            <br />
            <span className="text-primary">Built For Impact</span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed font-light"
          >
            From high-impact commercials to immersive brand films,
            we produce stories engineered for emotion, scale,
            and unforgettable presence.
          </motion.p>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 flex flex-col sm:flex-row gap-6 items-start"
          >
            <Button
              size="xl"
              className="group bg-primary text-white px-10 py-6 text-lg font-semibold tracking-wide"
            >
              <Play className="mr-3 w-5 h-5" />
              Watch Showreel
            </Button>

            <Button
              size="xl"
              variant="ghost"
              className="text-white/70 hover:text-white text-lg"
            >
              Start a Production
              <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Studio Meta Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-24 border-t border-white/10 pt-8 flex flex-wrap gap-10 text-xs text-white/50 uppercase tracking-widest"
          >
            <span>Established 2020</span>
            <span>120+ Productions</span>
            <span>50+ Brands</span>
            <span>Riyadh, Saudi Arabia</span>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
