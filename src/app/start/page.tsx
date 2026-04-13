import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Play } from "lucide-react";
import { SERVICES } from "@/lib/services-data";
import StartBookingForm from "./StartBookingForm";

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
  { value: "50+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "7+", label: "Enterprise Clients" },
  { value: "5+", label: "Years in KSA" },
];

const clients = [
  { src: "/clients/Nokia.svg", alt: "Nokia" },
  { src: "/clients/aramco.jpg", alt: "Saudi Aramco" },
  { src: "/clients/philips.png", alt: "Philips" },
  { src: "/clients/alfanar.png", alt: "Alfanar" },
  { src: "/clients/elm.jpg", alt: "Elm" },
  { src: "/clients/ford.png", alt: "Ford", noInvert: true },
  { src: "/clients/leap.jpg", alt: "Leap" },
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

export default function StartPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative pt-36 pb-20 xl:pt-52 xl:pb-28 px-6 md:px-12 xl:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,134,41,0.07),transparent_65%)]" />
        <div className="relative w-11/12 xl:w-10/12 mx-auto text-center">
          <span className="uppercase tracking-[0.5em] text-[10px] text-primary block mb-6">
            Free Discovery Call — No Obligation
          </span>
          <h1 className="font-display font-black text-5xl md:text-7xl xl:text-[8rem] uppercase leading-[0.9] mb-8">
            Premium Video
            <br />
            Production in
            <br />
            <span className="text-primary">Saudi Arabia</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            Movico is Riyadh&apos;s leading creative production company — trusted by Nokia, Saudi Aramco, Philips, and more. Tell us about your project and we&apos;ll show you exactly how we can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#booking"
              className="bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Book a Discovery Call <ArrowRight size={14} />
            </a>
            <Link
              href="/#showreel"
              className="border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:border-primary hover:text-primary transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <Play size={12} /> Watch Our Reel
            </Link>
          </div>
        </div>
      </section>

      {/* Client Trust Bar */}
      <section className="border-t border-b border-white/8 py-10 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <p className="text-center text-[10px] uppercase tracking-[0.5em] text-white/25 mb-8">
            Trusted By
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 xl:gap-16">
            {clients.map((client) => (
              <Image
                key={client.alt}
                src={client.src}
                alt={client.alt}
                width={100}
                height={48}
                className={`h-8 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-300 ${"noInvert" in client && client.noInvert ? "" : "brightness-0 invert"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 xl:py-24 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto grid grid-cols-2 xl:grid-cols-4 gap-px bg-white/8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-black py-10 px-8 text-center group hover:bg-white/[0.03] transition-colors duration-300"
            >
              <span className="font-display font-black text-5xl xl:text-6xl text-primary block leading-none mb-3">
                {stat.value}
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Why Movico */}
      <section className="bg-white/[0.02] border-t border-b border-white/8 py-20 xl:py-32 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <div className="mb-14 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div>
              <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
                Why Choose Movico
              </span>
              <h2 className="font-display font-black text-4xl md:text-5xl xl:text-6xl uppercase leading-tight text-white">
                What Makes Us <span className="text-primary">Different</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
              <div key={i} className="group">
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
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 xl:py-32 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <div className="mb-12">
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
              Our Services
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl xl:text-6xl uppercase leading-tight text-white">
              Everything You <span className="text-primary">Need</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group border border-white/8 p-6 hover:border-primary/40 hover:bg-white/[0.02] transition-all duration-300 rounded-sm"
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
          <div>
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
          </div>
          <StartBookingForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 xl:py-32 px-6 md:px-12 xl:px-20">
        <div className="w-11/12 xl:w-10/12 mx-auto">
          <div className="mb-12">
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
              FAQ
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase leading-tight text-white">
              Common <span className="text-primary">Questions</span>
            </h2>
          </div>
          <div className="divide-y divide-white/8">
            {faqs.map((faq, i) => (
              <div key={i} className="py-8">
                <h3 className="font-display font-black text-lg xl:text-xl uppercase text-white mb-3">
                  {faq.q}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed max-w-2xl">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
