"use client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Benefit {
  title: string;
  description: string;
}

interface WhyItMattersSectionProps {
  whyInView: boolean;
  benefits: Benefit[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export default function WhyItMattersSection({
  whyInView,
  benefits,
  sectionTitle = "Why This Matters",
  sectionSubtitle = "The benefits of getting it right",
}: WhyItMattersSectionProps) {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={whyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-medium mb-4 block">
              {sectionSubtitle}
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground">
              {sectionTitle}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                animate={whyInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.2 + index * 0.1,
                  duration: 0.8,
                }}
                className="glass-card p-6 group hover:bg-primary/5 transition-all duration-500 relative overflow-hidden"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-base font-bold text-foreground mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
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
