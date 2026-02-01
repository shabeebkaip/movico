import React from "react";
import { motion, useInView } from "framer-motion";

const WhatHappensNext = ({ processRef, processInView, processSteps }) => {
  return (
    <section
      ref={processRef}
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-border/50 backdrop-blur-sm mb-6">
              <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                Our Process
              </span>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-foreground mb-4">
              What Happens <span className="text-gradient-silver">Next</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                className="group relative"
              >
                <div className="relative p-8 rounded-2xl bg-card border border-border shadow-elevated hover:shadow-glow transition-all duration-700 h-full overflow-hidden">
                  {/* Large number background */}
                  <div className="absolute -top-8 -right-4 font-display text-9xl font-bold text-border/20 group-hover:text-foreground/10 transition-colors duration-500">
                    {step.number}
                  </div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-foreground/5 border border-border/50 font-display text-sm font-bold text-foreground mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
                      {step.number}
                    </div>

                    <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-3 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-foreground to-transparent group-hover:w-full transition-all duration-700" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatHappensNext;
