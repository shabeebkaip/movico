import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const WhereWeOperate = ({ locationRef, locationInView }) => {
  return (
    <section
      ref={locationRef}
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-foreground/5 blur-3xl"
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={locationInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-border shadow-elevated mb-8">
              <MapPin className="w-10 h-10 text-foreground" />
            </div>

            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-foreground mb-6">
              Where We <span className="text-gradient-silver">Operate</span>
            </h2>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10">
              Based in the UAE with operations in Saudi Arabia, we serve clients
              across the GCC region, supporting businesses of all sizes—from
              ambitious startups to established enterprises.
            </p>

            {/* Location badges */}
            <div className="flex flex-wrap justify-center gap-4">
              {["Dubai, UAE", "Riyadh, Saudi Arabia", "GCC Region"].map(
                (location, index) => (
                  <motion.div
                    key={location}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={locationInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="px-6 py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-sm shadow-elevated"
                  >
                    {location}
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section> 
  );
};

export default WhereWeOperate;
