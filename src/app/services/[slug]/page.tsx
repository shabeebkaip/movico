import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Play } from "lucide-react";
import { SERVICES, getServiceBySlug } from "@/lib/services-data";
import { Breadcrumb } from "@/components/Breadcrumb";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} | Movico — Riyadh, Saudi Arabia`,
    description: service.longDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const currentIndex = SERVICES.findIndex((s) => s.slug === slug);
  const nextService = SERVICES[(currentIndex + 1) % SERVICES.length];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative pt-36 pb-20 xl:pt-48 xl:pb-28 px-6 md:px-12 xl:px-20 overflow-hidden">
        {service.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={service.heroImage}
              alt=""
              fill
              className="object-cover opacity-25"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,134,41,0.1),transparent_55%)]" />
        <div className="relative w-11/12 xl:w-10/12 mx-auto">
          <Breadcrumb
            items={[
              { label: "Services", href: "/services" },
              { label: service.title },
            ]}
          />

          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
            <div>
              <span className="font-display font-black text-[8rem] xl:text-[12rem] leading-none text-white/5 block -mb-6 xl:-mb-10 select-none">
                {service.number}
              </span>
              <h1 className="font-display font-black text-5xl md:text-7xl xl:text-[7rem] uppercase leading-[0.9] text-white">
                {service.title}
              </h1>
              <p className="text-primary font-display font-black text-lg xl:text-2xl uppercase tracking-wider mt-4">
                {service.heroTagline}
              </p>
            </div>
            <div className="xl:max-w-sm xl:text-right">
              <div className="flex flex-wrap xl:justify-end gap-2 mb-6">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-[0.2em] border border-primary/40 text-primary px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/contact?service=${service.slug}`}
                className="bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2"
              >
                Start a Project <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-white/8" />

      {/* Stats Bar */}
      {service.stats && service.stats.length > 0 && (
        <section className="border-b border-white/8 py-10 px-6 md:px-12 xl:px-20">
          <div className="w-11/12 xl:w-10/12 mx-auto grid grid-cols-2 xl:grid-cols-4 gap-8">
            {service.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display font-black text-4xl xl:text-5xl text-primary leading-none">
                  {stat.value}
                </div>
                <div className="text-white/40 text-[10px] uppercase tracking-[0.25em] mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Overview */}
      <section className="py-20 xl:py-32 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-20 items-start">
          <div>
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-6">
              Overview
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl xl:text-5xl uppercase leading-tight text-white mb-0">
              What We <span className="text-primary">Deliver</span>
            </h2>
          </div>
          <div>
            <p className="text-white/55 text-base md:text-lg leading-relaxed mb-6">
              {service.longDescription}
            </p>
            <p className="text-white/40 text-sm md:text-base leading-relaxed">
              {service.overview}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {service.gallery && service.gallery.length > 0 && (
        <section className="py-20 xl:py-32 px-6 md:px-12 xl:px-20">
          <div className="w-11/12 xl:w-10/12 mx-auto">
            <div className="mb-12">
              <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
                Our Work
              </span>
              <h2 className="font-display font-black text-3xl md:text-4xl xl:text-5xl uppercase leading-tight text-white">
                Behind the <span className="text-primary">Lens</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
              {service.gallery.map((src, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden group ${
                    i === 0 ? "col-span-2 xl:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What's Included */}
      <section className="bg-white/[0.02] border-t border-b border-white/8 py-20 xl:py-32 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <div className="mb-14">
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
              Scope of Work
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl xl:text-5xl uppercase leading-tight text-white">
              What&apos;s <span className="text-primary">Included</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/8">
            {service.offerings.map((offering, i) => (
              <div
                key={i}
                className="bg-black p-8 hover:bg-white/[0.03] transition-colors duration-300 group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                  />
                  <h3 className="font-display font-black text-lg uppercase text-white group-hover:text-primary transition-colors duration-300">
                    {offering.title}
                  </h3>
                </div>
                <p className="text-white/40 text-sm leading-relaxed pl-7">
                  {offering.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showreel */}
      {service.showreelPoster && (
        <section className="py-20 xl:py-32 px-6 md:px-12 xl:px-20">
          <div className="w-11/12 xl:w-10/12 mx-auto">
            <div className="mb-12">
              <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
                Showreel
              </span>
              <h2 className="font-display font-black text-3xl md:text-4xl xl:text-5xl uppercase leading-tight text-white">
                Watch Us <span className="text-primary">Work</span>
              </h2>
            </div>

            {service.showreelUrl ? (
              <div className="relative w-full aspect-video rounded-sm overflow-hidden">
                <iframe
                  src={service.showreelUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative w-full aspect-video overflow-hidden rounded-sm group cursor-pointer">
                <Image
                  src={service.showreelPoster}
                  alt="Showreel"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300 flex flex-col items-center justify-center gap-6">
                  <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_60px_rgba(217,134,41,0.5)]">
                    <Play size={32} className="text-white ml-1" fill="white" />
                  </div>
                  <Link
                    href={`/contact?service=${service.slug}`}
                    className="text-white/60 text-xs uppercase tracking-[0.3em] hover:text-primary transition-colors duration-300"
                  >
                    Enquire about a project instead →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Our Process */}
      <section className="py-20 xl:py-32 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <div className="mb-14">
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
              How We Work
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl xl:text-5xl uppercase leading-tight text-white">
              Our <span className="text-primary">Process</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-white/8">
            {service.process.map((step, i) => (
              <div
                key={i}
                className="bg-black p-8 hover:bg-white/[0.03] transition-colors duration-300 group relative"
              >
                <span className="absolute top-6 right-6 font-display font-black text-6xl text-white/[0.04] select-none group-hover:text-primary/10 transition-colors duration-500">
                  {step.step}
                </span>
                <span className="text-primary font-display font-black text-sm tracking-widest block mb-4">
                  {step.step}
                </span>
                <h3 className="font-display font-black text-xl uppercase text-white group-hover:text-primary transition-colors duration-300 mb-3">
                  {step.title}
                </h3>
                <div className="w-6 h-[2px] bg-primary mb-4 group-hover:w-10 transition-all duration-300" />
                <p className="text-white/40 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 border-t border-primary/20 py-20 xl:py-28 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
          <div>
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
              Get Started
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl xl:text-6xl uppercase text-white leading-tight">
              Start a{" "}
              <span className="text-primary">{service.title}</span>
              <br />
              project today.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href={`/contact?service=${service.slug}`}
              className="bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Get in Touch <ArrowRight size={14} />
            </Link>
            <Link
              href="/services"
              className="border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:border-white transition-all duration-300 inline-flex items-center justify-center"
            >
              All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Next Service */}
      <Link
        href={`/services/${nextService.slug}`}
        className="group block border-t border-white/8 py-10 px-6 md:px-12 xl:px-20 hover:bg-white/[0.02] transition-colors duration-300"
      >
        <div className="w-11/12 xl:w-10/12 mx-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/25 block mb-2">
              Next Service
            </span>
            <span className="font-display font-black text-2xl xl:text-4xl uppercase text-white/60 group-hover:text-white transition-colors duration-300">
              {nextService.title}
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
