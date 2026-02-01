"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Alfanar — Neom Village",
    description:
      "Comprehensive branding and event execution for Saudi Arabia's groundbreaking Neom development showcase.",
    image:
      "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
    href: "#",
  },
  {
    title: "World Defense Show",
    description:
      "Strategic event production and spatial design for one of the world's premier defense exhibitions.",
    image:
      "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
    href: "#",
  },
  {
    title: "Leap Conference",
    description:
      "Full-scale cinematic production and digital rollout for Saudi Arabia’s flagship technology event.",
    image:
      "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
    href: "#",
  },
  {
    title: "Ford Al Jazirah Vehicles",
    description:
      "Integrated brand storytelling and social content strategy driving automotive excellence.",
    image:
      "https://movicoksa.com/wp-content/uploads/2024/10/DSC03137-copy-scaled.jpg",
    href: "#",
  },
];

export default function FeaturedProjects() {
  return (
    <section id="work" className="relative py-40 bg-black overflow-hidden">

      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,134,41,0.12),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(251,146,60,0.08),transparent_40%)]" />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="max-w-4xl mb-24">
          <span className="uppercase tracking-[0.5em] text-xs text-white/50">
            Selected Work
          </span>

          <h2 className="mt-8 font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-white">
            Stories That
            <br />
            <span className="text-primary">Define Culture</span>
          </h2>

          <p className="mt-8 text-lg text-white/60 max-w-2xl leading-relaxed">
            We partner with ambitious brands to craft cinematic experiences
            engineered for attention, emotion, and measurable impact.
          </p>
        </div>

        {/* Cinematic Grid */}
        <div className="grid lg:grid-cols-2 gap-12">

          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={project.href} className="group block relative overflow-hidden rounded-3xl">

                {/* Image */}
                <div className="relative h-[500px] lg:h-[600px] w-full">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  />

                  {/* Dark cinematic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 p-10 space-y-4 max-w-xl">

                  <h3 className="text-3xl md:text-4xl font-semibold text-white group-hover:text-primary transition-colors duration-500">
                    {project.title}
                  </h3>

                  <p className="text-white/60 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-white/50 group-hover:text-primary transition-colors duration-300">
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>

                </div>

              </Link>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
