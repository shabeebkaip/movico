"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Subtle parallax movement
  const yMain = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const ySecondary = useTransform(scrollYProgress, [0, 1], [-40, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 lg:py-48 bg-black overflow-hidden"
    >
      {/* Subtle background glow */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-primary/5"
      />

      <div className="container mx-auto px-6 relative z-10">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT — Text Block */}
          <div className="space-y-10">

            <span className="uppercase tracking-[0.5em] text-xs text-white/50">
              About The Studio
            </span>

            <motion.h2
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-white"
            >
              Where Strategy
              <br />
              Meets Creative
              <br />
              <span className="text-primary">Execution</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-lg text-white/70 leading-relaxed max-w-lg"
            >
              We are a Riyadh-based production studio crafting high-impact
              commercials, branded films, and immersive event experiences.
              Every frame we create is engineered for emotion, clarity,
              and cultural relevance.
            </motion.p>

            {/* Minimal Studio Stats */}
            <div className="flex gap-12 pt-6 border-t border-white/10 text-sm uppercase tracking-widest text-white/50">
              <div>
                <p className="text-2xl text-white font-semibold">4+</p>
                <p>Years</p>
              </div>
              <div>
                <p className="text-2xl text-white font-semibold">120+</p>
                <p>Productions</p>
              </div>
              <div>
                <p className="text-2xl text-white font-semibold">50+</p>
                <p>Brands</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Cinematic Image Composition */}
          <div className="relative h-[650px] lg:h-[750px]">

            {/* Main Dominant Frame */}
            <motion.div
              style={{ y: yMain }}
              className="absolute top-0 right-0 w-[75%] h-[80%] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://instagram.fruh5-1.fna.fbcdn.net/v/t51.82787-15/587660615_18071491277601406_4212883130818383882_n.heic?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=110&ig_cache_key=Mzc4NTg4NzAxNTk2ODQwMDk4Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=czPnGzYP314Q7kNvwGo0XXl&_nc_oc=AdljwSZUv1_M7rePj62uFxnu-3ty3bMwbNyWCXqvUeVSHQudcPJvm2coGUvrS2HBztFEfQmOhQv9OrpV1Du2SV5K&_nc_ad=z-m&_nc_cid=1431&_nc_zt=23&_nc_ht=instagram.fruh5-1.fna&_nc_gid=edLwLM7JsjFkHiy0hefgDg&oh=00_Afuq-dsOAJA2-KX5ZZVvcTqclmqKBiZNM7rIl0p-gFWwYw&oe=6984D92D"
                alt="Film production set"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>

            {/* Secondary Offset Frame */}
            <motion.div
              style={{ y: ySecondary }}
              className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-3xl overflow-hidden shadow-xl border border-white/10"
            >
              <Image
                src="https://instagram.fruh6-2.fna.fbcdn.net/v/t51.82787-15/588618766_18072613847601406_2996926532819389065_n.heic?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=103&ig_cache_key=Mzc5MzgyNTI5MTY4OTc2MDMxMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=DzfC89IFdiwQ7kNvwHAmD3H&_nc_oc=AdnZ819loFduj1ywXX5OqnNzFCQkIy4ID3vaXN6LKr2MtjaAh79_988EX79_G5cIj87dBJdjsNTQTsSzAuPgr4xo&_nc_ad=z-m&_nc_cid=1431&_nc_zt=23&_nc_ht=instagram.fruh6-2.fna&_nc_gid=F69aXnX-a7f-yEIF6zZquQ&oh=00_AfsNkLAlq8xyxBVoSSzeUzeaYZghPr50JetgFuHpgvaRLA&oe=6984E4D8"
                alt="Cinematic filming"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>

            {/* Decorative frame outline */}
            <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
