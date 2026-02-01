import React from 'react'
import { motion } from "framer-motion";

const WhoWeAre = ({whoWeAreRef, whoWeAreInView}) => {
  return (
    <section ref={whoWeAreRef} className="py-24 lg:py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-dots opacity-20" />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left side - Badge and title */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={whoWeAreInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="lg:col-span-5"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-border/50">
                    <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
                    <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Our Story
                    </span>
                  </div>
                </div>
                <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
                  Who We{" "}
                  <span className="text-gradient-silver">Are</span>
                </h2>
              </motion.div>

              {/* Right side - Content */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={whoWeAreInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-7"
              >
                <div className="space-y-6 text-base lg:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    OCX LLC is a consultancy firm headquartered in the UAE with
                    operations across Saudi Arabia, dedicated to helping
                    businesses grow, stay compliant, and thrive in competitive
                    markets. What sets us apart is our unique ability to integrate
                    multiple disciplines—<span className="text-foreground font-semibold">Accounting, Taxation, Investment
                    Consultancy, Recruitment, and Digital Marketing</span>—under one
                    roof.
                  </p>
                  <p>
                    We believe that sustainable business growth requires more than
                    isolated solutions. It demands a strategic partner who
                    understands how finance, marketing, talent, and operations
                    intersect to create real value.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default WhoWeAre
