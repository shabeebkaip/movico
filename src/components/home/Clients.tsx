"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const clients = [
  { src: "/clients/Nokia.svg", alt: "Nokia" },
  { src: "https://www.aramco.com/-/jssmedia/project/aramcocom/aramco-logo--white.png", alt: "Saudi Aramco" },
  { src: "https://www.tvh.com/sites/tvh/files/styles/max_650x650/public/2024-07/Philips%20-%20logo%20%28removeBG%29.png?itok=T6RE9LBg", alt: "Philips" },
  { src: "https://www.alfanar.com/assets/images/saudi-arabia-alfanar-logo.png", alt: "Alfanar" },
  { src: "https://www.elm.sa/Style%20Library/ar-sa/assets_new/images/homeNow/elmlogoWhite.svg", alt: "Elm" },
  { src: "/clients/ford.png", alt: "Ford", noInvert: true },
  { src: "https://beyond-vision.com/wp-content/uploads/2024/02/Leap-Logo-2Leap-White-Logo-1024x273.png", alt: "Leap" },
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
              <Image
                src={client.src}
                alt={client.alt}
                width={140}
                height={64}
                className={`h-12 w-auto object-contain opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-400 ${"noInvert" in client && client.noInvert ? "" : "brightness-0 invert"}`}
              />
            </div>
            <span className="text-white/20 group-hover:text-white/50 text-[10px] uppercase tracking-[0.3em] transition-colors duration-300">
              {client.alt}
            </span>
          </div>
        ))}

        {/* Stat filler cell */}
        <div className="client-card bg-primary/10 hover:bg-primary/20 transition-colors duration-500 flex flex-col items-center justify-center gap-2 py-10 px-8">
          <span className="font-display font-black text-5xl xl:text-6xl text-primary leading-none">7+</span>
          <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] text-center">Enterprise Clients</span>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
