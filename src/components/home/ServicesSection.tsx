"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    number: "01",
    title: "Video Production",
    description:
      "High-impact commercials, branded films, and cinematic storytelling crafted for scale.",
    image:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1600&auto=format&fit=crop",
    href: "#services",
  },
  {
    number: "02",
    title: "Event Production",
    description:
      "Immersive conferences and brand experiences engineered for cultural relevance.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop",
    href: "#services",
  },
  {
    number: "03",
    title: "Brand Identity",
    description:
      "Strategic brand systems designed for longevity and authority.",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1600&auto=format&fit=crop",
    href: "#services",
  },
  {
    number: "04",
    title: "Spatial & Booth Design",
    description:
      "Exhibition environments built through architectural storytelling.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop",
    href: "#services",
  },
  {
    number: "05",
    title: "Interior & Architectural",
    description:
      "Commercial environments visualised through cinematic precision.",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
    href: "#services",
  },
  {
    number: "06",
    title: "Social & Digital Campaigns",
    description:
      "Performance-driven content ecosystems built for dominance.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    href: "#services",
  },
];

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="services" className="relative py-40 bg-black overflow-hidden">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle, rgba(217,134,41,0.4) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      
      <div className="container mx-auto px-6 relative z-10">

        {/* Section Intro */}
        <div className="max-w-3xl mb-24">
          <span className="uppercase tracking-[0.5em] text-xs text-white/50">
            Studio Capabilities
          </span>

          <h2 className="mt-8 font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-white">
            Built For
            <br />
            <span className="text-primary">Cultural Impact</span>
          </h2>
        </div>

        {/* Services Stack */}
        <div className="relative space-y-20">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.1,
              }}
              className="relative group p-4"
            >
              <Link href={service.href}>

                {/* Background Image Reveal */}
                {activeIndex === index && (
                  <motion.div
                    layoutId="service-bg"
                    className="absolute inset-0 -z-10 rounded-3xl overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.25 }}
                    exit={{ opacity: 0 }}
                  >
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                )}

                <div className="flex items-start gap-12">

                  {/* Massive Number */}
                  <div className="text-[6rem] md:text-[8rem] font-display font-bold text-white/5 leading-none">
                    {service.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-6">

                    <h3 className="text-3xl md:text-4xl font-semibold text-white group-hover:text-primary transition-colors duration-500">
                      {service.title}
                    </h3>

                    <p className="text-white/60 max-w-2xl text-lg leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-white/50 group-hover:text-primary transition-colors duration-300">
                      <span>Explore</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>

                  </div>
                </div>

                <div className="mt-12 border-b border-white/10" />

              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
