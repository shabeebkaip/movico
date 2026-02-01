import React from "react";
import { motion } from "framer-motion";

const GetInTouch = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-secondary/20 border-y border-border">
      <div className="absolute inset-0 bg-dots opacity-30" />

      {/* Animated background orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                Get Started
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter mb-6 text-foreground">
              Ready to Transform Your{" "}
              <span className="text-gradient-silver">Business?</span>
            </h2>

            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Whether you have a specific project in mind or want to explore how
              OCX can support your business, we'd love to hear from you. Our
              team is ready to discuss your needs and design a solution that
              works.
            </p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="grid sm:grid-cols-3 gap-6"
          >
            {[
              { label: "Response Time", value: "< 24 Hours" },
              { label: "Consultation", value: "Free" },
              { label: "Success Rate", value: "100%" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className="glass-card p-6 text-center group hover:bg-primary/5 transition-all duration-500"
              >
                <div className="font-display text-3xl lg:text-4xl font-bold text-gradient-silver mb-2">
                  {item.value}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
