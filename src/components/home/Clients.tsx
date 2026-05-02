"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClientLogo } from "./ClientLogo";

gsap.registerPlugin(ScrollTrigger);

// whiteBg: true  → logo has a white/light background; use multiply blend to erase it
// whiteBg: false → logo already has transparent or dark bg; show as-is
const clients: { src: string; alt: string; whiteBg?: boolean }[] = [
  { src: "/clients/Nokia.svg",                                          alt: "Nokia"        },
  { src: "/clients/aramco.jpg",                                         alt: "Saudi Aramco",  whiteBg: true },
  { src: "/clients/philips.png",                                        alt: "Philips",       whiteBg: true },
  { src: "/clients/alfanar.png",                                        alt: "Alfanar"        },
  { src: "/clients/elm.jpg",                                            alt: "Elm",           whiteBg: true },
  { src: "/clients/ford.png",                                           alt: "Ford"           },
  { src: "/clients/leap.jpg",                                           alt: "Leap",          whiteBg: true },
  { src: "/clients/Saudi_GACA_Logo.svg.png",                            alt: "GACA"           },
  { src: "/clients/UAPM-3.png",                                         alt: "UAPM"           },
  { src: "/clients/sabic-saudi-arabia-logo-plastic-company-saudi.jpg",  alt: "SABIC",         whiteBg: true },
  { src: "/clients/saudi-entertainment-and-amusement-expo-logo-1.jpg",  alt: "SEA Expo",      whiteBg: true },
  { src: "/clients/84c9628ccd4ee.png",                                  alt: "CJ Logistics"   },
];

const ClientsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll(".client-card");
      if (!cards) return;

      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black py-20 xl:py-32 px-6 md:px-12 xl:px-20">
      {/* Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-4">
            Trusted By
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl xl:text-6xl uppercase text-white leading-none">
            Brands That<br />
            <span className="text-primary">Trust Us</span>
          </h2>
        </div>
        <p className="text-white/40 text-sm max-w-xs leading-relaxed md:text-right">
          From global giants to regional leaders — our clients are the brands shaping industries.
        </p>
      </div>

      {/* Logo Grid */}
      <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px bg-white/8">
        {clients.map((client, i) => (
          <div
            key={i}
            className="client-card group bg-black hover:bg-white/5 transition-colors duration-500 flex flex-col items-center justify-center gap-4 py-10 px-8 cursor-default"
          >
            <div className="relative w-full flex items-center justify-center h-16">
              <ClientLogo
                src={client.src}
                alt={client.alt}
                removeWhiteBg={client.whiteBg}
                className="h-12 w-auto object-contain opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-400"
              />
            </div>
            <span className="text-white/20 group-hover:text-white/50 text-[10px] uppercase tracking-[0.3em] transition-colors duration-300">
              {client.alt}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientsSection;
