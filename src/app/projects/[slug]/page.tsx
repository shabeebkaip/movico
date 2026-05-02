import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PROJECTS, getProjectBySlug } from "@/lib/projects-data";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.client} | Movico`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative pt-36 pb-0 xl:pt-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,134,41,0.07),transparent_55%)]" />
        <div className="relative w-11/12 xl:w-10/12 mx-auto px-6 md:px-12 xl:px-0 pb-12 xl:pb-16">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/30 text-xs uppercase tracking-[0.25em] hover:text-primary transition-colors duration-300 mb-10"
          >
            <ArrowLeft size={12} /> All Work
          </Link>

          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold border border-primary/40 px-3 py-1 rounded-full">
                  {project.category}
                </span>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.25em]">
                  {project.location} · {project.year}
                </span>
              </div>
              <p className="text-white/40 text-sm uppercase tracking-[0.4em] mb-3">
                {project.client}
              </p>
              <h1 className="font-display font-black text-5xl md:text-7xl xl:text-[7rem] uppercase leading-[0.9] text-white">
                {project.title}
              </h1>
            </div>
            <div className="xl:max-w-sm">
              <Link
                href="/contact"
                className="bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2"
              >
                Start a Project <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="w-full aspect-[16/7] relative">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </section>

      {/* Content */}
      <section className="py-20 xl:py-32 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-20">
          <div>
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-6">
              About the Project
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl xl:text-5xl uppercase leading-tight text-white mb-8">
              The <span className="text-primary">Story</span>
            </h2>
            <p className="text-white/55 text-base md:text-lg leading-relaxed mb-6">
              {project.fullDescription}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-[0.2em] border border-white/15 text-white/40 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 xl:p-10 mb-6">
              <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
                Result
              </span>
              <p className="text-white/70 text-base leading-relaxed">
                {project.result}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-2">Client</span>
                <p className="text-white font-semibold">{project.client}</p>
              </div>
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-2">Category</span>
                <p className="text-white font-semibold">{project.category}</p>
              </div>
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-2">Location</span>
                <p className="text-white font-semibold">{project.location}</p>
              </div>
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-2">Year</span>
                <p className="text-white font-semibold">{project.year}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {project.images.length > 1 && (
        <section className="pb-20 xl:pb-28 px-6 md:px-12 xl:px-20">
          <div className="w-11/12 xl:w-10/12 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {project.images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] relative rounded-2xl overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`${project.title} — image ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary/5 border-t border-primary/20 py-20 xl:py-28 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
          <div>
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
              Work With Us
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl xl:text-6xl uppercase text-white leading-tight">
              Start your own
              <br />
              <span className="text-primary">project today.</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/contact"
              className="bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Get in Touch <ArrowRight size={14} />
            </Link>
            <Link
              href="/projects"
              className="border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:border-white transition-all duration-300 inline-flex items-center justify-center"
            >
              All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Next Project */}
      <Link
        href={`/projects/${nextProject.slug}`}
        className="group block border-t border-white/8 py-10 px-6 md:px-12 xl:px-20 hover:bg-white/[0.02] transition-colors duration-300"
      >
        <div className="w-11/12 xl:w-10/12 mx-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/25 block mb-2">
              Next Project
            </span>
            <span className="font-display font-black text-2xl xl:text-4xl uppercase text-white/60 group-hover:text-white transition-colors duration-300">
              {nextProject.title}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
            <ArrowRight size={18} className="text-white/40 group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
      </Link>
    </main>
  );
}
