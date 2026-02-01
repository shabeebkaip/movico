import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const GetInTouch = ({ ctaRef, ctaInView }) => {
  return (
    <section
      ref={ctaRef}
      className="py-24 lg:py-32 bg-secondary/20 border-t border-border relative overflow-hidden"
    >
      {/* Animated grid */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-80 h-80 rounded-full bg-foreground/5 blur-3xl"
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-border/50 backdrop-blur-sm mb-8">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                Get Started
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
              Let's Build Something <br className="hidden sm:block" />
              <span className="text-gradient-silver">Great Together</span>
            </h2>

            <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover how OCX's integrated approach can unlock new
              possibilities for your business.
            </p>

            <motion.a
              href="/contact#form"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 shadow-elevated hover:shadow-glow transition-all duration-300 group"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
