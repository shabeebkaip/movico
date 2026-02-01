'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Zap, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: "Verified Opportunities",
    description:
      "Every job posting is verified through personal discussion and validation.",
  },
  {
    icon: Users,
    title: "Trusted Network",
    description:
      "Connect through referrals and personal introductions, not cold applications.",
  },
  {
    icon: Zap,
    title: "Fast Placements",
    description:
      "Network-based matching accelerates the hiring process significantly.",
  },
  {
    icon: TrendingUp,
    title: "GCC Focus",
    description:
      "Specialized in Saudi Arabia and broader GCC market opportunities.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-foreground mb-4">
            Why <span className="text-gradient-silver">OCX Experts</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A network-based platform built on credibility, authentic job
            leads, and personal introductions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all hover:shadow-elevated group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-foreground/5 border border-foreground/10 mb-4 group-hover:bg-foreground/10 transition-colors">
                <benefit.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
