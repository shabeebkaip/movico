"use client";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ClientType {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface WhoBenefitsSectionProps {
  whoInView: boolean;
  clientTypes: ClientType[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export default function WhoBenefitsSection({
  whoInView,
  clientTypes,
  sectionTitle = "Who Benefits",
  sectionSubtitle = "Ideal for",
}: WhoBenefitsSectionProps) {
  return (
    <section className="py-32 bg-secondary/20 border-y border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={whoInView ? { opacity: 1, y: 0 } : {}}
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientTypes.map((client, index) => {
              const Icon = client.icon;
              return (
                <motion.div
                  key={client.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={whoInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.6,
                  }}
                  className="glass-card p-6 group hover:bg-primary/5 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mb-2">
                    {client.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {client.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
