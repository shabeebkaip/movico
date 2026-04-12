"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { MarqueeText } from "@/components/home/MarqueeText";
import ClientsSection from "@/components/home/Clients";
import { About } from "@/components/home/About";
import MethodologySection from "@/components/home/MethodologySection";
import WorkShowcase from "@/components/home/WorkShowcase";
import { ServicesSection } from "@/components/home/ServicesSection";
import ShowReel from "@/components/home/ShowReel";
import ProcessFlow from "@/components/home/ProcessFlow";
import Testimonials from "@/components/home/Testimonials";
import InsightsSection from "@/components/home/InsightsSection";
import { FAQSection } from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";

export default function Page() {
  return (
    <main className="min-h-screen bg-black">
      {/* 1. Full-viewport video hero — GSAP text reveal */}
      <HeroSection />

      {/* 2. Scrolling brand statement marquee */}
      <MarqueeText />

      {/* 3. Client logos — dual-row GSAP marquee */}
      <ClientsSection />

      {/* 4. Agency statement + animated stat counters */}
      <About />

      {/* 5. Interactive methodology — accordion with video */}
      <MethodologySection />

      {/* 6. Horizontal scroll work showcase — GSAP pin */}
      <WorkShowcase />

      {/* 7. Services — numbered list with sticky video */}
      <ServicesSection />

      {/* 8. Showreel — cinematic video section */}
      <ShowReel />

      {/* 9. Process steps — GSAP stagger */}
      <ProcessFlow />

      {/* 10. Testimonials — quote carousel */}
      <Testimonials />

      {/* 11. Insights — blog posts grid */}
      <InsightsSection />

      {/* 12. FAQ accordion */}
      <div className="bg-white">
        <FAQSection />
      </div>

      {/* 13. CTA + Contact — dark section with video bg */}
      <CTASection />
    </main>
  );
}
