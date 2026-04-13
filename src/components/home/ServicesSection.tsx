"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Video,
  CalendarDays,
  Layers,
  LayoutGrid,
  Sofa,
  Share2,
} from "lucide-react";

const services = [
  {
    number: "01",
    icon: Video,
    title: "Video Production",
    description:
      "High-impact commercials, branded films, and cinematic storytelling crafted for scale and emotion.",
    tags: ["Brand Films", "Commercials", "Cinematic"],
  },
  {
    number: "02",
    icon: CalendarDays,
    title: "Event Production",
    description:
      "Immersive conferences and brand experiences engineered for cultural relevance.",
    tags: ["Live Events", "Conferences"],
  },
  {
    number: "03",
    icon: Layers,
    title: "Brand Identity",
    description:
      "Strategic brand systems designed for longevity, authority, and regional impact.",
    tags: ["Logo", "Visual Systems", "Strategy"],
  },
  {
    number: "04",
    icon: LayoutGrid,
    title: "Spatial & Booth",
    description:
      "Exhibition environments built through architectural storytelling and spatial precision.",
    tags: ["Exhibition", "3D Design"],
  },
  {
    number: "05",
    icon: Sofa,
    title: "Interior Design",
    description:
      "Commercial environments visualised through cinematic precision and creative vision.",
    tags: ["Commercial", "Visualization"],
  },
  {
    number: "06",
    icon: Share2,
    title: "Social & Digital",
    description:
      "Performance-driven content ecosystems built for dominance across every platform.",
    tags: ["Social Media", "Campaigns", "Content"],
  },
];

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services" className="bg-black text-white py-20 xl:py-28">
      <div className="px-6 md:px-12 xl:px-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16"
        >
          <div>
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/40 block mb-4">
              What We Do
            </span>
            <h2 className="font-display text-4xl md:text-7xl xl:text-8xl uppercase leading-none">
              Our Services
            </h2>
          </div>
          <p className="text-white/35 max-w-xs text-sm leading-relaxed md:text-right">
            From concept to final delivery — spanning video, live events, brand
            identity, and digital campaigns.
          </p>
        </motion.div>

        {/* Bento Grid — Desktop */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 auto-rows-[minmax(260px,auto)]">

          {/* Video Production — tall, row-span-2 */}
          <div className="row-span-2">
            <ServiceCard
              service={services[0]}
              index={0}
              isHovered={hoveredIndex === 0}
              onHover={() => setHoveredIndex(0)}
              onLeave={() => setHoveredIndex(null)}
              className="h-full"
            />
          </div>

          {/* Event Production */}
          <ServiceCard
            service={services[1]}
            index={1}
            isHovered={hoveredIndex === 1}
            onHover={() => setHoveredIndex(1)}
            onLeave={() => setHoveredIndex(null)}
          />

          {/* Brand Identity */}
          <ServiceCard
            service={services[2]}
            index={2}
            isHovered={hoveredIndex === 2}
            onHover={() => setHoveredIndex(2)}
            onLeave={() => setHoveredIndex(null)}
          />

          {/* Spatial & Booth — wide col-span-2 */}
          <div className="col-span-2">
            <ServiceCard
              service={services[3]}
              index={3}
              isHovered={hoveredIndex === 3}
              onHover={() => setHoveredIndex(3)}
              onLeave={() => setHoveredIndex(null)}
              className="h-full"
              wide
            />
          </div>

          {/* Interior Design */}
          <ServiceCard
            service={services[4]}
            index={4}
            isHovered={hoveredIndex === 4}
            onHover={() => setHoveredIndex(4)}
            onLeave={() => setHoveredIndex(null)}
          />

          {/* Social & Digital — wide col-span-2 */}
          <div className="col-span-2">
            <ServiceCard
              service={services[5]}
              index={5}
              isHovered={hoveredIndex === 5}
              onHover={() => setHoveredIndex(5)}
              onLeave={() => setHoveredIndex(null)}
              className="h-full"
              wide
            />
          </div>

        </div>

        {/* Mobile — stacked */}
        <div className="md:hidden space-y-3">
          {services.map((service, index) => (
            <ServiceCard
              key={service.number}
              service={service}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  isHovered,
  onHover,
  onLeave,
  className = "",
  wide = false,
}: {
  service: typeof services[0];
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  className?: string;
  wide?: boolean;
}) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`group relative rounded-2xl xl:rounded-3xl overflow-hidden cursor-default transition-all duration-500 ${className}`}
      style={{
        background: isHovered
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.03)",
        border: isHovered
          ? "1px solid rgba(217,134,41,0.35)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: isHovered
          ? "0 0 50px rgba(217,134,41,0.1), 0 20px 60px rgba(0,0,0,0.5)"
          : "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Animated orange gradient on hover */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.85 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(217,134,41,0.12) 0%, transparent 65%)",
        }}
      />

      {/* Corner accent */}
      <motion.div
        animate={{ opacity: isHovered ? 0.6 : 0, scale: isHovered ? 1 : 0.6 }}
        transition={{ duration: 0.4 }}
        className="absolute top-0 right-0 w-28 h-28 pointer-events-none rounded-tr-2xl"
        style={{
          background:
            "linear-gradient(225deg, rgba(217,134,41,0.2) 0%, transparent 65%)",
        }}
      />

      {/* Card content */}
      <div className={`relative z-10 flex flex-col p-6 xl:p-8 ${wide ? "min-h-[180px]" : "min-h-[260px]"}`}>

        {/* Top row: icon + number */}
        <div className="flex items-start justify-between mb-6">
          {/* Icon box */}
          <motion.div
            animate={{
              backgroundColor: isHovered ? "#d98629" : "rgba(217,134,41,0.08)",
              boxShadow: isHovered
                ? "0 0 30px rgba(217,134,41,0.4)"
                : "none",
            }}
            transition={{ duration: 0.4 }}
            className="w-12 h-12 xl:w-14 xl:h-14 rounded-xl xl:rounded-2xl flex items-center justify-center relative"
          >
            <Icon
              className="w-5 h-5 xl:w-6 xl:h-6 transition-colors duration-300"
              style={{ color: isHovered ? "#000" : "#d98629" }}
            />
            {/* Icon glow */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="absolute inset-0 rounded-xl xl:rounded-2xl blur-lg"
                style={{ background: "#d98629" }}
              />
            )}
          </motion.div>

          {/* Number */}
          <motion.span
            animate={{ opacity: isHovered ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}
            className="font-display text-4xl xl:text-5xl font-bold"
            style={{ color: "#d98629" }}
          >
            {service.number}
          </motion.span>
        </div>

        {/* Title + description */}
        <div className={`flex-1 ${wide ? "flex items-center gap-10" : ""}`}>
          <div className={wide ? "flex-1" : ""}>
            <h3
              className="font-display uppercase leading-none mb-3 transition-colors duration-300"
              style={{
                fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
                color: isHovered ? "#ffffff" : "rgba(255,255,255,0.85)",
              }}
            >
              {service.title}
            </h3>
            <p
              className="text-sm leading-relaxed transition-colors duration-300"
              style={{ color: isHovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)" }}
            >
              {service.description}
            </p>
          </div>

          {/* Tags — wide cards show inline, others show below */}
          <div className={`flex flex-wrap gap-2 ${wide ? "flex-none" : "mt-5"}`}>
            {service.tags.map((tag) => (
              <motion.span
                key={tag}
                animate={{
                  borderColor: isHovered
                    ? "rgba(217,134,41,0.4)"
                    : "rgba(255,255,255,0.1)",
                  color: isHovered ? "rgba(217,134,41,0.9)" : "rgba(255,255,255,0.3)",
                }}
                transition={{ duration: 0.3 }}
                className="px-3 py-1 rounded-full border text-[10px] uppercase tracking-[0.2em]"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom orange bar — slides in on hover */}
      <motion.div
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{
          transformOrigin: "left",
          background: "linear-gradient(90deg, #d98629, rgba(217,134,41,0.3))",
        }}
      />

    </motion.div>
  );
}
