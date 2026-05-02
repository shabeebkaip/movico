"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const caseStudies = [
  {
    client: "LEAP Conference",
    projectType: "Event Production & Media Coverage",
    result: "40+ hours of content produced. 2M+ views across delivered assets.",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
    location: "Riyadh, Saudi Arabia",
    href: "/projects/leap-conference-2024",
  },
  {
    client: "Alfanar",
    projectType: "Corporate Brand Film — NEOM",
    result: "Award-winning brand film deployed across broadcast, digital, and major events.",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
    location: "NEOM, Saudi Arabia",
    href: "/projects/alfanar-neom-village",
  },
  {
    client: "World Defense Show",
    projectType: "Event Coverage & Documentary",
    result: "12 crew, 6-day production. 150+ deliverables for social, broadcast, and web.",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
    location: "Riyadh, Saudi Arabia",
    href: "/projects/world-defense-show",
  },
];

export default function CaseStudy() {
  return (
    <section id="case-studies" className="bg-black text-white py-20 xl:py-28 px-6 md:px-12 xl:px-20">
      <div className="w-11/12 xl:w-10/12 mx-auto">

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
              Selected Work
            </span>
            <h2 className="font-display text-4xl md:text-6xl xl:text-7xl uppercase leading-none">
              Case <span className="text-primary">Studies</span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors duration-300"
          >
            View All Work <ArrowRight size={12} />
          </Link>
        </motion.div>

        {/* Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 xl:gap-6">
          {caseStudies.map((item, i) => (
            <motion.div
              key={item.client}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={item.href} className="group block">
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                  <Image
                    src={item.image}
                    alt={item.client}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] uppercase tracking-[0.25em] bg-primary/90 text-white px-3 py-1 rounded-full font-semibold">
                      {item.location}
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-2">
                  {item.projectType}
                </p>

                <h3 className="font-display font-black text-xl xl:text-2xl text-white uppercase leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
                  {item.client}
                </h3>

                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  {item.result}
                </p>

                <span className="text-xs uppercase tracking-[0.2em] text-white/30 group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  View Case Study <ArrowRight size={12} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
