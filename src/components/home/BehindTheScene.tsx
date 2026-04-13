"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const BehindScenes = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yLarge = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const ySmall = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-40 bg-black overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-24">
          <span className="uppercase tracking-[0.5em] text-xs text-white/40">
            Behind The Scenes
          </span>

          <h2 className="mt-6 md:mt-8 font-display text-4xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
            Where Vision
            <br />
            <span className="text-primary">Becomes Reality</span>
          </h2>

          <p className="mt-6 md:mt-8 text-base md:text-lg text-white/60 leading-relaxed max-w-2xl">
            Precision lighting. Coordinated crews. Advanced camera systems.
            Every frame is the result of disciplined collaboration and technical mastery.
          </p>
        </div>

        {/* Mobile: stacked grid */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="col-span-2 aspect-[16/9] relative rounded-2xl overflow-hidden"
          >
            <Image
              src="https://instagram.fruh5-1.fna.fbcdn.net/v/t51.82787-15/587660615_18071491277601406_4212883130818383882_n.heic?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=110&ig_cache_key=Mzc4NTg4NzAxNTk2ODQwMDk4Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=czPnGzYP314Q7kNvwGo0XXl&_nc_oc=AdljwSZUv1_M7rePj62uFxnu-3ty3bMwbNyWCXqvUeVSHQudcPJvm2coGUvrS2HBztFEfQmOhQv9OrpV1Du2SV5K&_nc_ad=z-m&_nc_cid=1431&_nc_zt=23&_nc_ht=instagram.fruh5-1.fna&_nc_gid=edLwLM7JsjFkHiy0hefgDg&oh=00_Afuq-dsOAJA2-KX5ZZVvcTqclmqKBiZNM7rIl0p-gFWwYw&oe=6984D92D"
              alt="Film Crew on Set"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="aspect-square relative rounded-2xl overflow-hidden"
          >
            <Image
              src="https://instagram.fruh6-2.fna.fbcdn.net/v/t51.82787-15/622829421_18076350053601406_2433841741530804503_n.heic?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=111&ig_cache_key=MzgxOTk4NjEyNjQ3NjY2Mjg5NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=2Wa4tQ6NjlgQ7kNvwFfShle&_nc_oc=Adm5GVhSxlTu1rk07B90irfosh9MOGQ1jhCaYsWVffnjSqrjz7SQCELb_GQoIpZALOqk2QwRqXtBHvvxkbFo2Mcu&_nc_ad=z-m&_nc_cid=1431&_nc_zt=23&_nc_ht=instagram.fruh6-2.fna&_nc_gid=F69aXnX-a7f-yEIF6zZquQ&oh=00_AfuyFxdjgqpDIfSsGOdWIFmAA7Jj0LId9_O4ISqxhmj14g&oe=6984DAA5"
              alt="Camera Setup"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="aspect-square relative rounded-2xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1600&auto=format&fit=crop"
              alt="Lighting Equipment"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Desktop: parallax composition */}
        <div className="hidden md:block relative h-[520px] xl:h-[680px]">
          <motion.div
            style={{ y: yLarge }}
            className="absolute top-0 left-0 w-[65%] h-[70%] rounded-3xl overflow-hidden shadow-deep"
          >
            <Image
              src="https://instagram.fruh5-1.fna.fbcdn.net/v/t51.82787-15/587660615_18071491277601406_4212883130818383882_n.heic?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=110&ig_cache_key=Mzc4NTg4NzAxNTk2ODQwMDk4Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=czPnGzYP314Q7kNvwGo0XXl&_nc_oc=AdljwSZUv1_M7rePj62uFxnu-3ty3bMwbNyWCXqvUeVSHQudcPJvm2coGUvrS2HBztFEfQmOhQv9OrpV1Du2SV5K&_nc_ad=z-m&_nc_cid=1431&_nc_zt=23&_nc_ht=instagram.fruh5-1.fna&_nc_gid=edLwLM7JsjFkHiy0hefgDg&oh=00_Afuq-dsOAJA2-KX5ZZVvcTqclmqKBiZNM7rIl0p-gFWwYw&oe=6984D92D"
              alt="Film Crew on Set"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </motion.div>

          <motion.div
            style={{ y: ySmall }}
            className="absolute top-0 right-0 w-[30%] h-[40%] rounded-3xl overflow-hidden shadow-deep"
          >
            <Image
              src="https://instagram.fruh6-2.fna.fbcdn.net/v/t51.82787-15/622829421_18076350053601406_2433841741530804503_n.heic?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=111&ig_cache_key=MzgxOTk4NjEyNjQ3NjY2Mjg5NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=2Wa4tQ6NjlgQ7kNvwFfShle&_nc_oc=Adm5GVhSxlTu1rk07B90irfosh9MOGQ1jhCaYsWVffnjSqrjz7SQCELb_GQoIpZALOqk2QwRqXtBHvvxkbFo2Mcu&_nc_ad=z-m&_nc_cid=1431&_nc_zt=23&_nc_ht=instagram.fruh6-2.fna&_nc_gid=F69aXnX-a7f-yEIF6zZquQ&oh=00_AfuyFxdjgqpDIfSsGOdWIFmAA7Jj0LId9_O4ISqxhmj14g&oe=6984DAA5"
              alt="Camera Setup"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div
            style={{ y: ySmall }}
            className="absolute bottom-0 right-0 w-[40%] h-[45%] rounded-3xl overflow-hidden shadow-deep"
          >
            <Image
              src="https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1600&auto=format&fit=crop"
              alt="Lighting Equipment"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default BehindScenes;
