"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "Understanding objectives, audience and positioning to define creative direction.",
  },
  {
    number: "02",
    title: "Pre-Production",
    description:
      "Concept development, scripting, casting and logistical planning.",
  },
  {
    number: "03",
    title: "Production",
    description:
      "Cinematography, lighting design and coordinated on-set execution.",
  },
  {
    number: "04",
    title: "Post-Production",
    description:
      "Editing, grading, sound design and motion refinement.",
  },
  {
    number: "05",
    title: "Distribution",
    description:
      "Platform optimisation and strategic rollout for maximum impact.",
  },
];

const ProcessFlow = () => {
  return (
    <section className="relative py-40 bg-black overflow-hidden">

      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="max-w-3xl mb-20">
          <span className="uppercase tracking-[0.5em] text-xs text-white/40">
            Our Process
          </span>

          <h2 className="mt-8 font-display text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
            Engineered For
            <br />
            <span className="text-primary">Precision</span>
          </h2>
        </div>

        {/* Horizontal Layout */}
        <div className="grid md:grid-cols-5 gap-12 relative">

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* Connecting Line */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-7.5 w-15 h-px bg-white/10" />
              )}

              {/* Number */}
              <div className="text-5xl font-display font-bold text-primary mb-6">
                {step.number}
              </div>

              <h3 className="text-2xl font-semibold text-white mb-4">
                {step.title}
              </h3>

              <p className="text-white/60 leading-relaxed text-base">
                {step.description}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default ProcessFlow;
