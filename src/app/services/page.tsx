import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Our Services | Movico — Video & Creative Production Riyadh",
  description:
    "Premium video production, event production, brand identity, spatial design, interior design, and social media content — all under one roof in Riyadh, Saudi Arabia.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative pt-40 pb-20 xl:pt-52 xl:pb-32 px-6 md:px-12 xl:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,134,41,0.08),transparent_60%)]" />
        <div className="relative w-11/12 xl:w-10/12 mx-auto">
          <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-6">
            What We Do
          </span>
          <h1 className="font-display font-black text-5xl md:text-7xl xl:text-[8rem] uppercase leading-[0.9] mb-8">
            Our
            <br />
            <span className="text-primary">Services</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed">
            Six disciplines. One creative engine. We build the content, spaces,
            and brands that define Saudi Arabia&apos;s most ambitious companies.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-white/8" />

      {/* Services List */}
      <section className="py-0">
        {SERVICES.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group block border-b border-white/8 last:border-b-0"
          >
            <div className="w-11/12 xl:w-10/12 mx-auto px-6 md:px-12 xl:px-0 py-10 xl:py-14 flex flex-col xl:flex-row xl:items-center gap-6 xl:gap-0 group-hover:bg-transparent transition-colors duration-300">
              {/* Number */}
              <span className="font-display font-black text-5xl xl:text-7xl text-white/8 group-hover:text-primary/20 transition-colors duration-500 xl:w-36 shrink-0 leading-none">
                {service.number}
              </span>

              {/* Title + description */}
              <div className="flex-1 xl:px-12">
                <h2 className="font-display font-black text-3xl md:text-4xl xl:text-5xl uppercase leading-tight text-white group-hover:text-primary transition-colors duration-300 mb-3">
                  {service.title}
                </h2>
                <p className="text-white/40 text-sm md:text-base leading-relaxed max-w-xl group-hover:text-white/60 transition-colors duration-300">
                  {service.shortDescription}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 xl:w-64 xl:justify-end shrink-0">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-[0.2em] border border-white/15 text-white/40 px-3 py-1 rounded-full group-hover:border-primary/40 group-hover:text-white/60 transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <div className="xl:pl-10 shrink-0">
                <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <ArrowRight
                    size={16}
                    className="text-white/40 group-hover:text-white transition-colors duration-300"
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* CTA Strip */}
      <section className="bg-primary/5 border-t border-primary/20 py-20 xl:py-28 px-6 md:px-12 xl:px-20 text-center">
        <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-6">
          Ready to Begin
        </span>
        <h2 className="font-display font-black text-3xl md:text-5xl xl:text-6xl uppercase text-white mb-6 leading-tight">
          Let&apos;s build something
          <br />
          <span className="text-primary">remarkable.</span>
        </h2>
        <p className="text-white/40 text-sm max-w-md mx-auto mb-10 leading-relaxed">
          Tell us about your project and we&apos;ll come back with ideas, timeline, and a plan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            Start a Project <ArrowRight size={14} />
          </Link>
          <Link
            href="/start"
            className="border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:border-primary hover:text-primary transition-all duration-300 inline-flex items-center justify-center"
          >
            Book a Discovery Call
          </Link>
        </div>
      </section>
    </main>
  );
}
