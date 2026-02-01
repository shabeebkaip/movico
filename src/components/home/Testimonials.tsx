"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote:
      "Movico delivered beyond expectations. The execution was precise, cinematic, and strategically aligned with our objectives.",
    name: "Marketing Director",
    company: "NEOM",
  },
  {
    quote:
      "From concept to final delivery, their production workflow was disciplined and seamless.",
    name: "Event Director",
    company: "World Defense Show",
  },
  {
    quote:
      "The level of creative direction and technical control was unmatched.",
    name: "Brand Manager",
    company: "Ford Al Jazirah",
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-40 bg-black overflow-hidden">

      <div className="container mx-auto px-6 text-center">

        {/* Section Intro */}
        <div className="mb-24">
          <span className="uppercase tracking-[0.5em] text-xs text-white/40">
            Client Voices
          </span>

          <h2 className="mt-8 font-display text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
            Built On
            <br />
            <span className="text-primary">Trust</span>
          </h2>
        </div>

        {/* Quote Area */}
        <div className="max-w-4xl mx-auto min-h-45 flex items-center justify-center">

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p className="text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed font-light">
                “{testimonials[index].quote}”
              </p>

              <div className="mt-12 text-white/60 uppercase tracking-widest text-sm">
                {testimonials[index].name} —{" "}
                <span className="text-primary">
                  {testimonials[index].company}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-4 mt-16">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1 w-12 transition-all duration-500 ${
                i === index ? "bg-primary" : "bg-white/20"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
