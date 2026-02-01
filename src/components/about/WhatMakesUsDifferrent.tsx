import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const WhatMakesUsDifferrent = ({ differenceInView, differenceRef }) => {
  const differentiators = [
    {
      title: "Holistic Perspective",
      description:
        "We see your business as an interconnected system. Our multi-domain expertise allows us to identify opportunities and solve challenges that single-service providers might miss.",
      number: "01",
    },
    {
      title: "Regional Knowledge, Global Standards",
      description:
        "Our team brings international best practices combined with deep understanding of UAE and Saudi Arabian business environments, regulations, and market dynamics.",
      number: "02",
    },
    {
      title: "Seamless Integration",
      description:
        "Working with multiple consultancies creates coordination challenges. With OCX, you get consistent strategy, unified execution, and a single point of accountability.",
      number: "03",
    },
    {
      title: "Practical Excellence",
      description:
        "We're not just theorists. Our team has hands-on experience building and growing businesses, giving us the practical insight to deliver solutions that work in the real world.",
      number: "04",
    },
  ];
  return (
    <section
      ref={differenceRef}
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={differenceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-border/50 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                Our Advantage
              </span>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-foreground mb-4">
              What Makes Us{" "}
              <span className="text-gradient-silver">Different</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our integrated approach sets us apart in the consultancy landscape
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={differenceInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                className="group relative"
              >
                <div className="relative p-8 rounded-2xl bg-card border border-border shadow-elevated hover:shadow-glow transition-all duration-700 h-full overflow-hidden">
                  {/* Large number background */}
                  <div className="absolute -top-8 -right-4 font-display text-9xl font-bold text-border/20 group-hover:text-foreground/10 transition-colors duration-500">
                    {item.number}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Number badge */}
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 border border-border/50 font-display text-sm font-bold text-foreground mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
                      {item.number}
                    </div>

                    <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-3 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Hover accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-foreground to-transparent group-hover:w-full transition-all duration-700" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatMakesUsDifferrent;
