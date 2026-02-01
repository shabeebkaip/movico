"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface OverviewSectionProps {
  overviewInView: boolean;
  title: string;
  description: string;
}

export default function OverviewSection({
  overviewInView,
  title,
  description,
}: OverviewSectionProps) {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={overviewInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                Overview
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter mb-8 text-foreground">
              {title}
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
