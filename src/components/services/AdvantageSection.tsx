"use client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const advantages = [
  {
    title: "Holistic Perspective",
    description:
      "Our accountants understand marketing ROI. Our marketers understand financial constraints. Our recruiters understand operational needs.",
  },
  {
    title: "Seamless Integration",
    description:
      "Services that work together naturally, creating efficiency and consistency across all aspects of your business operations.",
  },
  {
    title: "Strategic Partnership",
    description:
      "We connect the dots across disciplines to deliver solutions that address your challenges comprehensively, not in isolation.",
  },
  {
    title: "Better Outcomes",
    description:
      "Integrated expertise means faster execution, fewer miscommunications, and results that align with your overall business strategy.",
  },
];

export default function AdvantageSection({ advantageInView }) {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={advantageInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-medium mb-4 block">
              The OCX Difference
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-6">
              Integrated <span className="text-gradient-silver">Advantage</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              When you work with OCX, you're not just getting individual
              services—you're gaining a strategic partner who can connect the
              dots across disciplines.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 40 }}
                animate={advantageInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.2 + index * 0.1,
                  duration: 0.8,
                }}
                className="glass-card p-8 group hover:bg-primary/5 transition-all duration-500 relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {advantage.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>
                </div>

                {/* Hover accent */}
                <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
