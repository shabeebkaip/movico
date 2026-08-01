"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import type { WorkShowcaseContent } from "@/lib/cms/types";
import { defaultContent } from "@/lib/cms/types";
import LazyVideo from "./LazyVideo";

const D = defaultContent.home.workShowcase;

type Project = {
  id: number;
  client: string;
  category: string;
  year: string;
  span?: "full";
} & ({ video: string; image?: never } | { image: string; video?: never });

const projects: Project[] = [
  {
    id: 1,
    client: "Esports 2025",
    category: "Esports Film",
    year: "2025",
    span: "full",
    video: "https://res.cloudinary.com/xzwm4mjt/video/upload/q_auto,f_auto,w_1920,c_limit/movico/videos/6a0eaff4ac6acf2f293bacb3.mp4",
  },
  {
    id: 2,
    client: "Riyadh Cityscape",
    category: "City Campaign",
    year: "2025",
    video: "https://res.cloudinary.com/xzwm4mjt/video/upload/q_auto,f_auto,w_1920,c_limit/movico/videos/6a0eaff4ac6acf2f293bacb5.mp4",
  },
  {
    id: 3,
    client: "World Defense Show",
    category: "Event Coverage",
    year: "2024",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
  },
  {
    id: 4,
    client: "Leap Conference",
    category: "Corporate Production",
    year: "2024",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
  },
  {
    id: 5,
    client: "Aramco",
    category: "Promotional Video",
    year: "2023",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
  },
  {
    id: 6,
    client: "Movico Reels",
    category: "Brand Showreel",
    year: "2024",
    span: "full",
    video: "https://res.cloudinary.com/xzwm4mjt/video/upload/q_auto,f_auto,w_1920,c_limit/movico/videos/6a0eaff5ac6acf2f293bacb7.mp4",
  },
];

export default function WorkShowcase({ content = D }: { content?: WorkShowcaseContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
        },
      });

      const cells = gridRef.current?.querySelectorAll(".work-cell");
      if (cells) {
        gsap.from(cells, {
          opacity: 0,
          y: 40,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="bg-black">
      {/* Heading */}
      <div
        ref={headingRef}
        className="px-6 md:px-12 xl:px-20 pt-12 md:pt-20 xl:pt-28 pb-6 md:pb-10 flex items-end justify-between"
      >
        <div>
          <span className="uppercase tracking-[0.5em] text-[10px] text-white/40 block mb-3">
            {content.label}
          </span>
          <h2 className="font-display text-4xl md:text-7xl xl:text-8xl uppercase text-white leading-none">
            {content.heading}
          </h2>
        </div>
        <Link
          href="/work"
          className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors duration-300"
        >
          View All <span>→</span>
        </Link>
      </div>

      {/* Full-bleed 2-column grid */}
      <div ref={gridRef} className="grid grid-cols-2 gap-[2px]">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`work-cell group relative overflow-hidden cursor-pointer${
              project.span === "full" ? " col-span-2 aspect-[16/7]" : " aspect-[4/3]"
            }`}
          >
            {/* Media */}
            {project.video ? (
              <LazyVideo
                src={project.video}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            ) : (
              <Image
                src={project.image!}
                alt={`${project.client} — ${project.category} by Movico`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes={
                  project.span === "full"
                    ? "100vw"
                    : "(max-width: 768px) 50vw, 50vw"
                }
              />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

            {/* Label — always visible */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 xl:p-8 flex items-end justify-between">
              <div>
                <p className="font-display text-white text-xl md:text-2xl xl:text-3xl uppercase leading-none">
                  {project.client}
                </p>
                <p className="text-white/50 text-[10px] uppercase tracking-[0.3em] mt-2">
                  {project.category}
                </p>
              </div>
              <span className="text-white/30 text-xs tabular-nums">{project.year}</span>
            </div>

            {/* Hover CTA */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
              <span className="text-white text-xs uppercase tracking-[0.3em] border border-white/40 px-6 py-3 backdrop-blur-sm bg-black/20">
                View Project →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
