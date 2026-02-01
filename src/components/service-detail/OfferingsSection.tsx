"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Offering {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface OfferingsSectionProps {
  offeringsInView: boolean;
  offerings: Offering[];
  sectionTitle?: string;
  columns?: 2 | 3;
}

export default function OfferingsSection({
  offeringsInView,
  offerings,
  sectionTitle = "What We Offer",
  columns = 3,
}: OfferingsSectionProps) {
  const { scrollYProgress } = useScroll();

  const gridClass = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="py-32 bg-secondary/20 border-y border-border relative overflow-hidden">
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [100, -100]),
        }}
        className="absolute -top-40 -right-40 w-150 h-150 rounded-full bg-primary/5 blur-orb"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={offeringsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-center text-foreground">
              {sectionTitle}
            </h2>
          </motion.div>

          <div className={`grid ${gridClass} gap-6`}>
            {offerings.map((offering, index) => {
              const Icon = offering.icon;
              return (
                <motion.div
                  key={offering.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={offeringsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.8,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="glass-card p-8 group hover:bg-primary/5 transition-all duration-500 relative overflow-hidden"
                >
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">
                    {offering.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {offering.description}
                  </p>

                  {/* Hover effect line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-primary to-transparent group-hover:w-full transition-all duration-700" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
