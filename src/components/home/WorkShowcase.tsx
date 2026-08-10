"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import type { WorkShowcaseContent } from "@/lib/cms/types";
import { defaultContent } from "@/lib/cms/types";
import type { ProjectData } from "@/lib/projects-data";
import { PROJECTS } from "@/lib/projects-data";
import LazyVideo from "./LazyVideo";
import { cloudinaryVideoDelivery } from "@/lib/video-delivery";

const D = defaultContent.home.workShowcase;

export default function WorkShowcase({
  content = D,
  projects = PROJECTS,
}: {
  content?: WorkShowcaseContent;
  projects?: ProjectData[];
}) {
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
          href="/projects"
          className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors duration-300"
        >
          View All <span>→</span>
        </Link>
      </div>

      {/*
        Flex-wrap instead of a fixed-column grid: any number of projects
        (admin can show/hide/add freely) always fills the full row width —
        a lone trailing card grows to 100% instead of leaving a dead cell.
      */}
      <div ref={gridRef} className="flex flex-wrap gap-[2px]">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="work-cell group relative overflow-hidden block flex-1 basis-[380px] aspect-[4/3]"
          >
            {project.video ? (
              <LazyVideo
                src={cloudinaryVideoDelivery(project.video, 640) ?? project.video}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            ) : (
              <Image
                src={project.coverImage}
                alt={project.coverAlt || `${project.client} — ${project.category} by Movico`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
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
          </Link>
        ))}
      </div>
    </section>
  );
}
