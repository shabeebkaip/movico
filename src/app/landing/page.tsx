import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { listServices } from "@/lib/cms/services";
import { readContent } from "@/lib/cms/store";
import StartBookingForm from "./StartBookingForm";
import LandingHero from "./LandingHero";
import Reveal from "./Reveal";
import FAQAccordion from "./FAQAccordion";
import ClientsSection from "@/components/home/Clients";
import Counter from "@/components/ui/counter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Discovery Call | Movico — Video Production Company Riyadh, Saudi Arabia",
  description:
    "Looking for a video production company in Riyadh or Saudi Arabia? Movico produces premium brand films, commercials, and event content for leading brands across the GCC. Book your free discovery call today.",
  keywords: [
    "video production company Riyadh",
    "video production Saudi Arabia",
    "corporate video production KSA",
    "brand film production Riyadh",
    "commercial video production Saudi Arabia",
    "event production company Riyadh",
  ],
};

const stats = [
  { end: 50, suffix: "+", label: "Projects Delivered" },
  { end: 98, suffix: "%", label: "Client Satisfaction" },
  { end: 7, suffix: "+", label: "Enterprise Clients" },
  { end: 5, suffix: "+", label: "Years in KSA" },
];

const faqs = [
  {
    q: "How much does video production cost in Saudi Arabia?",
    a: "Costs vary by scope — a corporate video typically starts from SAR 15,000, while a full brand film campaign ranges from SAR 50,000–200,000+. We provide detailed proposals after understanding your brief.",
  },
  {
    q: "How long does a video production project take?",
    a: "A standard corporate video takes 2–4 weeks from brief to delivery. Brand films and campaigns run 4–8 weeks. Expedited timelines are available on request.",
  },
  {
    q: "Do you work with clients outside Riyadh?",
    a: "Yes — we work across the entire KSA and GCC region. We've delivered projects in Jeddah, Dammam, Dubai, and beyond. Travel and logistics are fully managed by our team.",
  },
  {
    q: "What's included in a discovery call?",
    a: "A 30-minute session where we learn about your brand, objectives, and budget. We'll share relevant work, outline possible approaches, and explain next steps — no obligation.",
  },
  {
    q: "Can Movico handle both production and social media distribution?",
    a: "Absolutely. Our Social & Digital service covers strategy, production, and ongoing content delivery — so you get a consistent, high-quality content pipeline without managing multiple agencies.",
  },
];

export default async function StartPage() {
  const [services, content] = await Promise.all([listServices(), readContent()]);
  const { videoUrl, posterUrl } = content.home.hero;

  return (
    <main className="min-h-screen bg-black text-white">
      <LandingHero videoUrl={videoUrl} posterUrl={posterUrl} />

      <ClientsSection />

      {/* Stats */}
      <section className="py-20 xl:py-24 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto grid grid-cols-2 xl:grid-cols-4 gap-px bg-white/8">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="bg-black py-10 px-8 text-center group hover:bg-white/[0.03] transition-colors duration-300 h-full">
                <span className="font-display font-black text-5xl xl:text-6xl text-primary block leading-none mb-3">
                  <Counter end={stat.end} suffix={stat.suffix} duration={1600} />
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why Movico */}
      <section className="bg-white/[0.02] border-t border-b border-white/8 py-20 xl:py-32 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <Reveal className="mb-14 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div>
              <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
                Why Choose Movico
              </span>
              <h2 className="font-display font-black text-4xl md:text-5xl xl:text-6xl uppercase leading-tight text-white">
                What Makes Us <span className="text-primary">Different</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              {
                title: "Cinematic Quality, Every Time",
                body: "We never compromise on production value. Every project — regardless of budget — receives the same rigorous creative treatment.",
              },
              {
                title: "Deep KSA Market Knowledge",
                body: "We understand the Saudi market, cultural nuances, and regional business landscape. Our content resonates locally and travels globally.",
              },
              {
                title: "Full-Service, No Outsourcing",
                body: "Direction, cinematography, editing, sound — all in-house. One team, one vision, total quality control.",
              },
              {
                title: "Science-Backed Storytelling",
                body: "We apply proven principles of how people form memories and make decisions — so your content doesn't just look good, it works.",
              },
              {
                title: "Fast Turnaround",
                body: "Streamlined workflows mean shorter timelines without cutting corners. We move fast and deliver on time.",
              },
              {
                title: "Transparent Partnership",
                body: "No hidden costs, no surprise revisions. We're direct, honest, and built for long-term partnerships.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="group h-full rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-primary/30 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(217,134,41,0.08)] transition-all duration-500">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                    <h3 className="font-display font-black text-lg uppercase text-white group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed pl-7">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 xl:py-32 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <Reveal className="mb-12">
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
              Our Services
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl xl:text-6xl uppercase leading-tight text-white">
              Everything You <span className="text-primary">Need</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.05}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block h-full rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:-translate-y-1 hover:border-primary/40 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(217,134,41,0.1)] transition-all duration-300"
                >
                  <span className="text-primary font-display font-black text-xs tracking-widest block mb-3">
                    {service.number}
                  </span>
                  <h3 className="font-display font-black text-xl uppercase text-white group-hover:text-primary transition-colors duration-300 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-white/35 text-xs leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>
                  <span className="text-primary text-xs uppercase tracking-[0.2em] inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                    Learn More <ArrowRight size={10} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section
        id="booking"
        className="bg-white/[0.02] border-t border-white/8 py-20 xl:py-32 px-6 md:px-12 xl:px-20"
      >
        <div className="w-11/12 xl:w-10/12 mx-auto grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-24 items-start">
          <Reveal>
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-6">
              Book a Call
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl xl:text-6xl uppercase text-white leading-tight mb-6">
              Let&apos;s Talk
              <br />
              <span className="text-primary">About Your Project</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-sm">
              Fill in your details and we&apos;ll get back to you within 24 hours to schedule your free 30-minute discovery call.
            </p>
            <div className="space-y-4">
              {[
                "Free 30-minute discovery session",
                "No commitment required",
                "We'll share relevant case studies",
                "Honest advice on what's right for you",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={14} className="text-primary shrink-0" />
                  <span className="text-white/50 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <StartBookingForm services={services.map((s) => ({ slug: s.slug, title: s.title }))} />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 xl:py-32 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <Reveal className="mb-12">
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
              FAQ
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase leading-tight text-white">
              Common <span className="text-primary">Questions</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <FAQAccordion faqs={faqs} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
