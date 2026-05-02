"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

const insights = [
  {
    id: 1,
    category: "Production",
    title: "Why cinematography matters more than budget in brand video",
    excerpt:
      "The visual language of a brand film communicates trust, authority, and emotion before a single word is spoken. Here's why quality of light beats quantity of spend.",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6288-scaled.jpg",
    date: "March 2025",
    href: "/blog/why-cinematography-matters",
  },
  {
    id: 2,
    category: "Strategy",
    title: "How Saudi brands are winning on video in 2025",
    excerpt:
      "Saudi Arabia's media landscape has transformed. Local brands that once relied on traditional advertising are now commanding global attention through cinematic storytelling.",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/SNIL2230-scaled.jpg",
    date: "February 2025",
    href: "/blog/saudi-brands-winning-on-video",
  },
  {
    id: 3,
    category: "Events",
    title: "The anatomy of a world-class event production",
    excerpt:
      "From pre-production logistics to the final frame of coverage — how Movico approaches large-scale event production for organisations like NEOM and World Defense Show.",
    image: "https://movicoksa.com/wp-content/uploads/2024/10/DSC09438-scaled.jpg",
    date: "January 2025",
    href: "/blog/anatomy-of-world-class-event-production",
  },
];

export default function InsightsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 82%" },
      });

      gsap.from(cardsRef.current?.children ?? [], {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: cardsRef.current, start: "top 78%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white py-20 xl:py-32 overflow-hidden"
    >
      <div className="w-11/12 xl:w-10/12 mx-auto">
        {/* Heading row */}
        <div
          ref={headingRef}
          className="flex items-end justify-between mb-12 xl:mb-16"
        >
          <div>
            <span className="uppercase tracking-[0.5em] text-[10px] text-black/40 block mb-4">
              Ideas &amp; Thinking
            </span>
            <h2 className="font-display font-black text-5xl md:text-6xl xl:text-7xl uppercase text-black leading-none">
              Blog &amp; Insights
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors duration-300"
          >
            All Posts →
          </Link>
        </div>

        {/* Cards grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8"
        >
          {insights.map((post) => (
            <Link key={post.id} href={post.href} className="group block">
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
                  {post.category}
                </span>
                <span className="text-[10px] text-black/30">{post.date}</span>
              </div>

              {/* Title */}
              <h3 className="font-display font-black text-lg xl:text-xl text-black uppercase leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-black/50 text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>

              {/* Read more */}
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-black/30 group-hover:text-primary transition-colors duration-300">
                Read More →
              </p>
            </Link>
          ))}
        </div>

        {/* Mobile all-link */}
        <div className="mt-10 md:hidden text-center">
          <Link
            href="/blog"
            className="text-xs uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors duration-300"
          >
            All Insights →
          </Link>
        </div>
      </div>
    </section>
  );
}
