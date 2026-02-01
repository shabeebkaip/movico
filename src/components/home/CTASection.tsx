"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section id="contact" className="relative py-40 bg-black overflow-hidden">

      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-cinematic pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[0.95] max-w-5xl mx-auto"
        >
          Ready to Produce
          <br />
          <span className="text-primary">Something Unforgettable?</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-16"
        >
          <Button className="btn-primary px-10 py-4 text-sm uppercase tracking-widest">
            Start a Production
            <ArrowRight className="ml-3 w-4 h-4" />
          </Button>
        </motion.div>

      </div>
    </section>
  );
};

export default CTASection;
