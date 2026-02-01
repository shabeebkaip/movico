"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Palette,
  Target,
  Layout,
  Pen,
  Heart,
  Rocket,
  Globe,
  TrendingUp,
  Eye,
  Building2,
} from "lucide-react";

import LightRays from "@/components/ui/light-rays";
import ServiceHero from "@/components/service-detail/ServiceHero";
import OverviewSection from "@/components/service-detail/OverviewSection";
import OfferingsSection from "@/components/service-detail/OfferingsSection";
import WhyItMattersSection from "@/components/service-detail/WhyItMattersSection";
import WhoBenefitsSection from "@/components/service-detail/WhoBenefitsSection";
import ApproachSection from "@/components/service-detail/ApproachSection";
import ServiceCTA from "@/components/service-detail/ServiceCTA";

const offerings = [
  {
    icon: Target,
    title: "Brand Strategy & Positioning",
    description:
      "Define your unique value proposition, target audience, and competitive positioning through strategic brand development that guides all future decisions.",
  },
  {
    icon: Palette,
    title: "Logo Design & Visual Identity",
    description:
      "Create memorable, professional logos and comprehensive visual systems including color palettes, typography, and design guidelines.",
  },
  {
    icon: Heart,
    title: "Brand Identity Creation",
    description:
      "Develop complete brand identities that encompass personality, voice, values, and visual expression across all applications.",
  },
  {
    icon: Layout,
    title: "Creative Design",
    description:
      "Professional design for brochures, posters, business cards, packaging, signage, and corporate merchandise that reinforces your brand.",
  },
  {
    icon: Pen,
    title: "Corporate Presentations & Pitch Decks",
    description:
      "Visually compelling presentations that communicate your message professionally and persuasively to any audience.",
  },
];

const benefits = [
  {
    title: "Market Recognition",
    description: "Stand out and be remembered in crowded markets",
  },
  {
    title: "Credibility Building",
    description: "Establish trust and professional authority",
  },
  {
    title: "Emotional Connection",
    description: "Create bonds that turn prospects into advocates",
  },
  {
    title: "Consistent Expression",
    description: "Unified brand experience across all touchpoints",
  },
  {
    title: "Competitive Edge",
    description: "Differentiate from competitors effectively",
  },
  {
    title: "Business Value",
    description: "Build brand equity that drives growth",
  },
];

const clientTypes = [
  {
    icon: Rocket,
    title: "New Businesses",
    description: "Startups establishing market presence",
  },
  {
    icon: TrendingUp,
    title: "Companies Undergoing Rebranding",
    description: "Organizations refreshing their identity",
  },
  {
    icon: Globe,
    title: "Businesses Entering New Markets",
    description: "Companies expanding geographically or vertically",
  },
  {
    icon: Eye,
    title: "Inconsistent Brand Application",
    description: "Organizations needing cohesive brand systems",
  },
  {
    icon: Building2,
    title: "Growth or Investment Ready",
    description: "Companies preparing for next-level scale",
  },
];

const approachPoints = [
  {
    number: "01",
    title: "Strategic Foundation",
    description:
      "We start by understanding your business, audience, and competitive landscape to ensure every design decision serves your goals.",
  },
  {
    number: "02",
    title: "Intentional Design",
    description:
      "Our creative process is strategic—every design choice is purposeful and aligned with your brand positioning and business objectives.",
  },
  {
    number: "03",
    title: "Cohesive Systems",
    description:
      "We deliver not just beautiful designs, but complete brand systems that can be applied consistently across all channels and touchpoints.",
  },
  {
    number: "04",
    title: "Lasting Impact",
    description:
      "We create brands that don't just look good today, but remain relevant, distinctive, and effective as your business grows and evolves.",
  },
];

export default function Page() {
  const heroRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const offeringsRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const whoRef = useRef<HTMLDivElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const overviewInView = useInView(overviewRef, {
    once: true,
    margin: "-100px",
  });
  const offeringsInView = useInView(offeringsRef, {
    once: true,
    margin: "-100px",
  });
  const whyInView = useInView(whyRef, { once: true, margin: "-100px" });
  const whoInView = useInView(whoRef, { once: true, margin: "-100px" });
  const approachInView = useInView(approachRef, {
    once: true,
    margin: "-100px",
  });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen bg-background noise">
      <div ref={heroRef}>
        <ServiceHero
          heroInView={heroInView}
          serviceName="Branding Services"
          title="Create a Brand|That Commands|Attention"
          subtitle="Strategic positioning and compelling design that sets you apart."
          backgroundComponent={
            <LightRays
              raysOrigin="top-center"
              raysColor="#ffff"
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={1.2}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
              className="custom-rays"
            />
          }
          showAnimatedOrbs={false}
        />
      </div>

      <div ref={overviewRef}>
        <OverviewSection
          overviewInView={overviewInView}
          title="More Than a Logo—A Complete Experience"
          description="Your brand is more than a logo—it's the complete experience customers have with your business. Our branding services help you develop a strong, distinctive identity that resonates with your target audience and creates lasting impressions across every touchpoint."
        />
      </div>

      <div ref={offeringsRef}>
        <OfferingsSection
          offeringsInView={offeringsInView}
          offerings={offerings}
          sectionTitle="What We Offer"
          columns={2}
        />
      </div>

      <div ref={whyRef}>
        <WhyItMattersSection
          whyInView={whyInView}
          benefits={benefits}
          sectionTitle="Why This Matters"
          sectionSubtitle="The Impact"
        />
      </div>

      <div ref={whoRef}>
        <WhoBenefitsSection
          whoInView={whoInView}
          clientTypes={clientTypes}
          sectionTitle="Who Benefits"
          sectionSubtitle="Ideal Clients"
        />
      </div>

      <div ref={approachRef}>
        <ApproachSection
          approachInView={approachInView}
          approachPoints={approachPoints}
          sectionTitle="Our Approach"
          sectionSubtitle="Our Method"
        />
      </div>

      <div ref={ctaRef}>
        <ServiceCTA
          ctaInView={ctaInView}
          title="Build a Brand|That Stands Out|and Drives Results"
          subtitle="Ready to build a brand that stands out and drives results? Let's create something remarkable together."
          buttonText="Start Your Brand Journey"
          buttonHref="/contact"
          serviceName="Branding Services"
        />
      </div>
    </main>
  );
}
