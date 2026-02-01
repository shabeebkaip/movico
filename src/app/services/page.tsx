"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";
import ServiceHero from "@/components/service-detail/ServiceHero";
import Beams from "@/components/ui/beams";
import IntroSection from "@/components/services/IntroSection";
import ServicesGrid from "@/components/services/ServicesGrid";
import AdvantageSection from "@/components/services/AdvantageSection";
import IndustriesSection from "@/components/services/IndustriesSection";
import ServicesCTA from "@/components/services/ServicesCTA";

export default function Page() {
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const advantageRef = useRef<HTMLDivElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const introInView = useInView(introRef, { once: true, margin: "-100px" });
  const servicesInView = useInView(servicesRef, {
    once: true,
    margin: "-100px",
  });
  const advantageInView = useInView(advantageRef, {
    once: true,
    margin: "-100px",
  });
  const industriesInView = useInView(industriesRef, {
    once: true,
    margin: "-100px",
  });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen bg-background noise">
      <div ref={heroRef}>
        <ServiceHero
          heroInView={heroInView}
          serviceName="Our Services"
          title="Comprehensive|Solutions"
          subtitle="Integrated expertise across finance, taxation, marketing, recruitment, and strategy."
          showBreadcrumb={false}
          backgroundComponent={
            <Beams
              beamWidth={3}
              beamHeight={20}
              beamNumber={15}
              lightColor="#ffffff"
              speed={3}
              noiseIntensity={2}
              scale={0.3}
              rotation={20}
            />
          }
        />
      </div>
      <div ref={introRef}>
        <IntroSection introInView={introInView} />
      </div>
      <div ref={servicesRef}>
        <ServicesGrid servicesInView={servicesInView} />
      </div>
      <div ref={advantageRef}>
        <AdvantageSection advantageInView={advantageInView} />
      </div>
      <div ref={industriesRef}>
        <IndustriesSection industriesInView={industriesInView} />
      </div>
      <div ref={ctaRef}>
        <ServicesCTA ctaInView={ctaInView} />
      </div>
    </main>
  );
}
