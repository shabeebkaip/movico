"use client";
import { motion } from "framer-motion";

interface ApproachPoint {
  number: string;
  title: string;
  description: string;
}

interface ApproachSectionProps {
  approachInView: boolean;
  approachPoints: ApproachPoint[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export default function ApproachSection({
  approachInView,
  approachPoints,
  sectionTitle = "Our Approach",
  sectionSubtitle = "How we work",
}: ApproachSectionProps) {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={approachInView ? { opacity: 1, y: 0 } : {}}
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

          <div className="grid md:grid-cols-2 gap-8">
            {approachPoints.map((point, index) => (
              <motion.div
                key={point.number}
                initial={{ opacity: 0, y: 40 }}
                animate={approachInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.2 + index * 0.1,
                  duration: 0.8,
                }}
                className="glass-card p-8 group hover:bg-primary/5 transition-all duration-500 relative overflow-hidden"
              >
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="font-display text-lg font-bold text-primary">
                    {point.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {point.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.description}
                </p>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-primary to-transparent group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
