"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const gridImages = [
  {
    src: "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
    alt: "Alfanar — Neom Village",
  },
  {
    src: "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
    alt: "World Defense Show",
  },
  {
    src: "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
    alt: "Leap Conference",
  },
];

export default function FeaturedProjects() {
  return (
    <section id="work" className="bg-white py-6 xl:py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-11/12 xl:w-10/12 mx-auto flex flex-col gap-1 xl:gap-5"
      >
        {/* 3-column image grid */}
        <div className="grid grid-cols-3 gap-1 xl:gap-5">
          {gridImages.map((img, i) => (
            <motion.div
              key={img.alt}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-square relative rounded-xl xl:rounded-3xl overflow-hidden border-2 xl:border-8 border-gray-100 group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Wide video strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full aspect-[4/2] relative rounded-xl xl:rounded-3xl overflow-hidden border-2 xl:border-8 border-gray-100"
        >
          <video
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            loop
            muted
          >
            <source
              src="https://res.cloudinary.com/dm5c31z7w/video/upload/v1776032909/ESPORTS_2025_MOVICO_1_1_aetzgu.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>
      </motion.div>
    </section>
  );
}
