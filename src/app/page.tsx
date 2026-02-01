"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { About } from "@/components/home/About";
import { ServicesSection } from "@/components/home/ServicesSection";
import FeaturedProject from "@/components/home/FeaturedProject";
import ShowReel from "@/components/home/ShowReel";
import ProcessFlow from "@/components/home/ProcessFlow";
import ClientsSection from "@/components/home/Clients";
import Testimonials from "@/components/home/Testimonials";
import BehindScenes from "@/components/home/BehindTheScene";
import CTASection from "@/components/home/CTASection";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
        <HeroSection />
        <About />
        <ServicesSection />
        <FeaturedProject />
        <ShowReel />
        <ProcessFlow />
        <ClientsSection />
        <Testimonials />
        <CTASection />
        {/* <BehindScenes /> */}
    </main>
  );
}
