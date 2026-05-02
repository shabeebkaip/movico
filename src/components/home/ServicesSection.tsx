"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  Video,
  CalendarDays,
  Layers,
  LayoutGrid,
  Sofa,
  Share2,
  Camera,
  Clapperboard,
} from "lucide-react";

const services = [
  {
    number: "01",
    icon: Video,
    title: "Video Production",
    description:
      "Corporate videos, brand films, and commercials for Saudi Arabia's leading companies — from concept to final cut in Riyadh.",
    tags: ["Corporate Videos", "Brand Films", "Commercials"],
    href: "/services/video-production",
  },
  {
    number: "02",
    icon: CalendarDays,
    title: "Event Coverage",
    description:
      "Professional event coverage across Saudi Arabia — conferences, product launches, and brand activations captured with cinematic precision.",
    tags: ["Live Events", "Conferences", "Saudi Arabia"],
    href: "/services/event-production",
  },
  {
    number: "03",
    icon: Layers,
    title: "Brand Identity",
    description:
      "Strategic brand systems designed for longevity, authority, and regional impact across the Saudi market.",
    tags: ["Logo", "Visual Systems", "Strategy"],
    href: "/services/brand-identity",
  },
  {
    number: "04",
    icon: Camera,
    title: "Photography",
    description:
      "Corporate photography, event photography, and commercial shoots for brands across Saudi Arabia and the GCC.",
    tags: ["Corporate", "Events", "Commercial"],
    href: "/studio",
  },
  {
    number: "05",
    icon: LayoutGrid,
    title: "Spatial & Booth",
    description:
      "Exhibition environments built through architectural storytelling and spatial precision.",
    tags: ["Exhibition", "3D Design"],
    href: "/services/spatial-booth",
  },
  {
    number: "06",
    icon: Sofa,
    title: "Interior Design",
    description:
      "Commercial environments visualised through cinematic precision and creative vision.",
    tags: ["Commercial", "Visualization"],
    href: "/services/interior-design",
  },
  {
    number: "07",
    icon: Share2,
    title: "Social & Digital",
    description:
      "Performance-driven content ecosystems built for dominance across every platform.",
    tags: ["Social Media", "Campaigns", "Content"],
    href: "/services/social-digital",
  },
  {
    number: "08",
    icon: Clapperboard,
    title: "Media Production",
    description:
      "Full-service media production in Riyadh — documentaries, corporate reels, and long-form content for brands across Saudi Arabia.",
    tags: ["Documentary", "Media", "Riyadh"],
    href: "/services/video-production",
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
              Media Production<br />
              <span className="text-primary">Services</span>
            </h2>
          </div>
          <p className="text-white/35 max-w-xs text-sm leading-relaxed md:text-right">
            Corporate video, event coverage, photography &amp; brand production
            — serving companies across Saudi Arabia from our Riyadh studio.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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

        {/* View All Services */}
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.25em] px-8 py-3.5 rounded-full hover:border-primary hover:text-primary transition-all duration-300"
          >
            View All Services
          </Link>
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
}: {
  service: typeof services[0];
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  className?: string;
}) {
  const Icon = service.icon;

  return (
    <Link href={service.href}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`group relative rounded-2xl xl:rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${className}`}
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
      <div className="relative z-10 flex flex-col p-6 xl:p-8 min-h-[260px]">

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
        <div className="flex-1">
          <div>
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

          <div className="flex flex-wrap gap-2 mt-5">
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
    </Link>
  );
}
