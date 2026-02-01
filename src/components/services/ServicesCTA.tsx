"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ServicesCTA({ ctaInView }) {
  return (
    <section className="py-32 relative overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
              <span className="text-outline">Ready to Experience</span>
              <br />
              <span className="text-foreground">the OCX Difference</span>
              <span className="text-gradient-silver">?</span>
            </h2>

            <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Let's discuss which services can help you achieve your{" "}
              <span className="text-foreground font-medium">
                immediate goals and long-term vision.
              </span>
            </p>

            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 group"
            >
              Schedule a Consultation
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
