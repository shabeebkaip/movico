import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "@/lib/projects-data";

export const metadata: Metadata = {
  title: "Our Work | Movico — Video Production & Event Coverage Riyadh",
  description:
    "Explore Movico's portfolio of corporate videos, event productions, and brand films for leading companies across Saudi Arabia and the GCC.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative pt-40 pb-20 xl:pt-52 xl:pb-32 px-6 md:px-12 xl:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,134,41,0.08),transparent_60%)]" />
        <div className="relative w-11/12 xl:w-10/12 mx-auto">
          <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-6">
            Case Studies
          </span>
          <h1 className="font-display font-black text-5xl md:text-7xl xl:text-[8rem] uppercase leading-[0.9] mb-8">
            Our
            <br />
            <span className="text-primary">Work</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed">
            Corporate videos, event coverage, and brand films for Saudi Arabia&apos;s
            most ambitious companies — from Riyadh to NEOM.
          </p>
        </div>
      </section>

      <div className="w-full h-px bg-white/8" />

      {/* Projects Grid */}
      <section className="py-20 xl:py-28 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
          {PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] bg-primary text-white px-3 py-1 rounded-full font-semibold">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
                  {project.client}
                </span>
                <span className="text-[10px] text-white/30">{project.year}</span>
              </div>

              <h2 className="font-display font-black text-xl xl:text-2xl text-white uppercase leading-tight mb-2 group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h2>

              <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-4">
                {project.shortDescription}
              </p>

              <span className="text-xs uppercase tracking-[0.2em] text-white/30 group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                View Case Study <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 border-t border-primary/20 py-20 xl:py-28 px-6 md:px-12 xl:px-20 text-center">
        <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-6">
          Start Your Project
        </span>
        <h2 className="font-display font-black text-3xl md:text-5xl xl:text-6xl uppercase text-white mb-6 leading-tight">
          Ready to create
          <br />
          <span className="text-primary">something great?</span>
        </h2>
        <Link
          href="/contact"
          className="bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2"
        >
          Start a Project <ArrowRight size={14} />
        </Link>
      </section>
    </main>
  );
}
