import React from "react";
import { motion, useInView } from "framer-motion";

import { Sparkles } from "lucide-react";

const Hero = ({ heroRef, heroInView }) => {
  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden border-b border-border h-screen flex items-center justify-center pt-20 md:pt-24"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/contact-hero.jpg"
          alt="Contact OCX"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-linear-to-b from-background/95 via-background/60 to-background/60" />
        {/* Additional black overlay for more darkness */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-30">
        <div className=" text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/20 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span className="text-xs font-semibold tracking-wider uppercase text-foreground drop-shadow-lg">
                Get in Touch
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.2,
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.95] mb-8 drop-shadow-2xl"
          >
            Let's Start a{" "}
            <br />
            <span className="text-gradient-silver">Conversation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg lg:text-xl text-foreground/90 leading-relaxed max-w-3xl mx-auto drop-shadow-lg"
          >
            Ready to grow? We're here to help you turn challenges into
            opportunities.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
