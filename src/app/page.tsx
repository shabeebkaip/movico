"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { MarqueeText } from "@/components/home/MarqueeText";
import ClientsSection from "@/components/home/Clients";
import { About } from "@/components/home/About";
import WorkShowcase from "@/components/home/WorkShowcase";
import { ServicesSection } from "@/components/home/ServicesSection";
import ShowReel from "@/components/home/ShowReel";
import StudioPromo from "@/components/home/StudioPromo";
import CaseStudy from "@/components/home/CaseStudy";
import ProcessFlow from "@/components/home/ProcessFlow";
import Testimonials from "@/components/home/Testimonials";
import InsightsSection from "@/components/home/InsightsSection";
import { FAQSection } from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import SceneDivider from "@/components/SceneDivider";

export default function Page() {
  return (
    <main className="min-h-screen bg-black">
      {/* 1. Hero */}
      <HeroSection />

      {/* ── Warm amber bloom — like a key light fading from the hero ── */}
      <SceneDivider tone="amber" from="left" spread={380} />

      {/* 2. Marquee */}
      <MarqueeText />

      {/* 3. Clients */}
      <ClientsSection />

      {/* ── Deep indigo wash — mood shift into the studio statement ── */}
      <SceneDivider tone="indigo" from="right" spread={380} />

      {/* 4. About */}
      <About />

      {/* ── Dual-tone — amber left / indigo right, like two opposing lights ── */}
      <SceneDivider tone="amberIndigo" from="center" spread={380} />

      {/* 5. Work showcase */}
      <WorkShowcase />

      {/* ── Cool teal — night exterior feel before services ── */}
      <SceneDivider tone="teal" from="left" spread={380} />

      {/* 6. Services */}
      <ServicesSection />

      {/* ── Amber surge — studio teaser warm-up ── */}
      <SceneDivider tone="amber" from="left" spread={380} />

      {/* 7. Studio promo */}
      <StudioPromo />

      {/* ── Amber surge — warm cinematic transition into showreel ── */}
      <SceneDivider tone="amber" from="center" spread={380} intensity={1.2} />

      {/* 8. Showreel */}
      <ShowReel />

      {/* ── Deep crimson — dramatic beat before case studies ── */}
      <SceneDivider tone="crimson" from="right" spread={380} />

      {/* 8. Case studies */}
      <CaseStudy />

      {/* ── Teal — cool counterpoint between case studies and process ── */}
      <SceneDivider tone="teal" from="left" spread={380} />

      {/* 9. Process */}
      <ProcessFlow />

      {/* ── Indigo to amber — moody testimonial atmosphere ── */}
      <SceneDivider tone="amberIndigo" from="right" spread={380} />

      {/* 10. Testimonials */}
      <Testimonials />

      {/* 11. Insights (white section — no divider needed) */}
      <InsightsSection />

      {/* 12. FAQ */}
      <div className="bg-white">
        <FAQSection />
      </div>

      {/* ── Final amber bloom before the CTA ── */}
      <SceneDivider tone="amber" from="center" spread={380} />

      {/* 13. CTA */}
      <CTASection />
    </main>
  );
}
