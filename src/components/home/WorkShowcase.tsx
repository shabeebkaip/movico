"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    id: 1,
    client: "Esports 2025",
    category: "Esports Film",
    year: "2025",
    video: "https://res.cloudinary.com/dm5c31z7w/video/upload/v1776032909/ESPORTS_2025_MOVICO_1_1_aetzgu.mp4",
  },
  {
    id: 2,
    client: "Riyadh Cityscape",
    category: "City Campaign",
    year: "2025",
    video: "https://res.cloudinary.com/dm5c31z7w/video/upload/v1776032310/MOVICO_CITYSCAPE_1_i8rmfk.mp4",
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
];

export default function WorkShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Small delay so layout is fully settled before GSAP measures
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        // Total horizontal distance to travel
        // section.offsetWidth = visible width (excludes scroll bars)
        const getDistance = () =>
          track.scrollWidth - section.offsetWidth;

        gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,          // freeze section in viewport
            anticipatePin: 1,   // prevents jump on pin
            scrub: 1,           // tie to scroll position
            start: "top top",
            end: () => `+=${getDistance()}`,
            invalidateOnRefresh: true,
          },
        });

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

        const cards = track.querySelectorAll(".project-card");
        gsap.from(cards, {
          opacity: 0,
          y: 30,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
          },
        });

        ScrollTrigger.refresh();
      }, sectionRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    /*
     * IMPORTANT: No overflow-hidden on the section itself.
     * GSAP pin works by making this element position:fixed — if overflow:hidden
     * is on the section it breaks the pin. Overflow clipping lives on the
     * inner wrapper instead.
     */
    <section
      ref={sectionRef}
      id="work"
      className="bg-white"
      style={{ height: "100vh" }}
    >
      {/* Inner wrapper — overflow hidden here clips the moving track */}
      <div className="h-full flex flex-col justify-center overflow-hidden">
        {/* Heading */}
        <div
          ref={headingRef}
          className="px-6 md:px-12 xl:px-20 mb-8 flex items-end justify-between flex-shrink-0"
        >
          <div>
            <span className="uppercase tracking-[0.5em] text-[10px] text-black/40 block mb-3">
              Selected Work
            </span>
            <h2 className="font-display text-5xl md:text-7xl xl:text-8xl uppercase text-black leading-none">
              Our Work
            </h2>
          </div>
          <Link
            href="/work"
            className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/50 hover:text-black transition-colors duration-300"
          >
            View All <span>→</span>
          </Link>
        </div>

        {/* Horizontal track — moves left via GSAP */}
        <div
          ref={trackRef}
          className="flex gap-5 px-6 md:px-12 xl:px-20 will-change-transform flex-shrink-0"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card flex-none w-[72vw] md:w-[40vw] xl:w-[28vw] group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                {"video" in project ? (
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={project.image!}
                    alt={project.client}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 72vw, (max-width: 1280px) 40vw, 28vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-end p-5 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                  <span className="text-white text-xs uppercase tracking-[0.2em] font-semibold">
                    View Project →
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-start justify-between">
                <div>
                  <p className="font-display text-black text-xl uppercase leading-none">
                    {project.client}
                  </p>
                  <p className="text-black/40 text-xs uppercase tracking-widest mt-1">
                    {project.category}
                  </p>
                </div>
                <span className="text-black/30 text-xs">{project.year}</span>
              </div>
            </div>
          ))}

          {/* Trailing spacer so last card lands fully visible */}
          <div className="flex-none w-20 md:w-24 xl:w-32" />
        </div>
      </div>
    </section>
  );
}
