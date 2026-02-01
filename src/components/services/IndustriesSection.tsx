"use client";
import { motion } from "framer-motion";
import {
  Building2,
  ShoppingCart,
  Briefcase,
  Package,
  Home,
  Heart,
  DollarSign,
} from "lucide-react";

const industries = [
  { icon: Building2, name: "Technology & Startups" },
  { icon: ShoppingCart, name: "Retail & E-commerce" },
  { icon: Briefcase, name: "Professional Services" },
  { icon: Package, name: "Manufacturing & Distribution" },
  { icon: Home, name: "Hospitality & Real Estate" },
  { icon: Heart, name: "Healthcare & Education" },
  { icon: DollarSign, name: "Financial Services" },
];

export default function IndustriesSection({ industriesInView }) {
  return (
    <section className="py-32 bg-secondary/20 border-y border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={industriesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-medium mb-4 block">
              Industry Expertise
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground">
              Industries We <span className="text-gradient-silver">Serve</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <motion.div
                  key={industry.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={industriesInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.6,
                  }}
                  className="glass-card p-6 text-center group hover:bg-primary/5 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    {industry.name}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
