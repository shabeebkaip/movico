'use client';

import { motion } from 'framer-motion';
import { Users, Award, Target, Shield } from 'lucide-react';

interface StatsSectionProps {
  statsRef: React.RefObject<HTMLElement>;
  statsInView: boolean;
}

const stats = [
  { number: "970+", label: "Active Professionals", icon: Users },
  { number: "150+", label: "Successful Placements", icon: Award },
  { number: "GCC", label: "Regional Focus", icon: Target },
  { number: "100%", label: "Verified Jobs", icon: Shield },
];

export default function StatsSection({ statsRef, statsInView }: StatsSectionProps) {
  return (
    <section
      ref={statsRef}
      className="py-20 bg-secondary/20 border-y border-border"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-foreground/5 border border-foreground/10 mb-4">
                <stat.icon className="w-8 h-8 text-foreground" />
              </div>
              <div className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
