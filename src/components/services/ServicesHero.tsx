"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Beams from "@/components/ui/beams";

export default function ServicesHero({ heroInView }) {
  const heroRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24"
    >
      {/* Beams Background */}
      <div className="absolute inset-0 z-0">
        <Beams
          beamWidth={3}
          beamHeight={20}
          beamNumber={15}
          lightColor="#ffffff"
          speed={3}
          noiseIntensity={2}
          scale={0.3}
          rotation={20}
        />
      </div>

      {/* Dark overlay for contrast - lighter to show beams better */}
      <div className="absolute inset-0 bg-linear-to-b from-background/70 via-background/50 to-background/70 z-1" />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-30"
      >
        <div className="container mx-auto  px-6">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-linear-to-r from-primary to-transparent" />
            <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-medium drop-shadow-lg">
              Our Services
            </span>
          </motion.div>

          {/* Main headline */}
          <div className="mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.4,
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter leading-[0.9] mb-6 drop-shadow-2xl"
            >
              <span className="text-foreground">Comprehensive</span>
              <br />
              <span className="text-outline">Solutions</span>
              <span className="text-foreground">.</span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="font-body text-lg sm:text-xl md:text-2xl text-foreground/90 max-w-3xl mb-12 leading-relaxed drop-shadow-lg"
          >
            Integrated expertise across{" "}
            <span className="text-foreground font-medium">
              finance, taxation, marketing, recruitment, and strategy.
            </span>
          </motion.p>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent z-0 pointer-events-none" />
    </section>
  );
}
