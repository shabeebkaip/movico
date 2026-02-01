"use client";

import { useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import JobsHero from "@/components/jobs/JobsHero";
import StatsSection from "@/components/jobs/StatsSection";
import BenefitsSection from "@/components/jobs/BenefitsSection";
import HowItWorksSection from "@/components/jobs/HowItWorksSection";
import TestimonialsSection from "@/components/jobs/TestimonialsSection";
import CTASection from "@/components/jobs/CTASection";

export default function JobsPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const flowsRef = useRef(null);
  const flowsInView = useInView(flowsRef, { once: true, margin: "-100px" });

  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, {
    once: true,
    margin: "-100px",
  });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main className="min-h-screen bg-background">
      <JobsHero 
        heroRef={heroRef}
        heroInView={heroInView}
        heroY={heroY}
        heroOpacity={heroOpacity}
      />
      
      <StatsSection statsRef={statsRef} statsInView={statsInView} />
      
      <BenefitsSection />
      
      <HowItWorksSection flowsRef={flowsRef} flowsInView={flowsInView} />
      
      <TestimonialsSection 
        testimonialsRef={testimonialsRef}
        testimonialsInView={testimonialsInView}
      />
      
      <CTASection />
    </main>
  );
}
  
