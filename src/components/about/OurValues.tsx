import React from "react";
import { motion } from "framer-motion";
import { Shield, Award, Users, Lightbulb, TrendingUp } from "lucide-react";

const OurValues = ({ valuesRef, valuesInView }) => {
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description:
        "We build trust through transparency, ethical practices, and honest communication in everything we do.",
      number: "01",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We're committed to delivering the highest quality services, meeting global standards while exceeding client expectations.",
      number: "02",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "Success is a partnership. We work closely with our clients, understanding their unique challenges and co-creating solutions.",
      number: "03",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Markets evolve, and so do we. We continuously adapt our approaches, leveraging new tools and strategies to keep clients ahead.",
      number: "04",
    },
    {
      icon: TrendingUp,
      title: "Results Focus",
      description:
        "Every engagement is measured by tangible outcomes—whether it's improved efficiency, increased revenue, or reduced risk.",
      number: "05",
    },
  ];
  return (
    <section
      ref={valuesRef}
      className="py-24 lg:py-32 bg-secondary/20 border-y border-border/50 relative overflow-hidden"
    >
      {/* Background dots */}
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-border/50 backdrop-blur-sm mb-6">
              <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                Core Principles
              </span>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-foreground mb-4">
              Our <span className="text-gradient-silver">Values</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First row - 3 cards */}
            {values.slice(0, 3).map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={valuesInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group"
                >
                  <div className="relative p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-foreground/20 shadow-elevated hover:shadow-glow transition-all duration-700 h-full overflow-hidden">
                    {/* Number watermark */}
                    <div className="absolute top-2 right-2 font-display text-6xl font-bold text-border/10 group-hover:text-foreground/5 transition-colors">
                      {value.number}
                    </div>

                    {/* Icon */}
                    <div className="relative w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center mb-4 group-hover:bg-foreground/10 transition-colors">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>

                    <h3 className="font-display text-xl font-bold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Second row - 2 cards spanning wider */}
            {values.slice(3).map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={valuesInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`group ${index === 0 ? "md:col-span-2" : ""}`}
                >
                  <div className="relative p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-foreground/20 shadow-elevated hover:shadow-glow transition-all duration-700 h-full overflow-hidden">
                    {/* Number watermark */}
                    <div className="absolute top-2 right-2 font-display text-6xl font-bold text-border/10 group-hover:text-foreground/5 transition-colors">
                      {value.number}
                    </div>

                    {/* Icon */}
                    <div className="relative w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center mb-4 group-hover:bg-foreground/10 transition-colors">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>

                    <h3 className="font-display text-xl font-bold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurValues;
