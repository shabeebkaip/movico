"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Calculator,
  FileText,
  Shield,
  Building2,
  Globe,
  Rocket,
  Search,
  FileCheck,
  DollarSign,
  TrendingUp,
} from "lucide-react";

import ColorBends from "@/components/ui/color-bends";
import ServiceHero from "@/components/service-detail/ServiceHero";
import OverviewSection from "@/components/service-detail/OverviewSection";
import OfferingsSection from "@/components/service-detail/OfferingsSection";
import WhyItMattersSection from "@/components/service-detail/WhyItMattersSection";
import WhoBenefitsSection from "@/components/service-detail/WhoBenefitsSection";
import ApproachSection from "@/components/service-detail/ApproachSection";
import ServiceCTA from "@/components/service-detail/ServiceCTA";

const offerings = [
  {
    icon: FileCheck,
    title: "VAT Registration & Setup",
    description:
      "Complete registration support with ZATCA (Saudi Arabia) and UAE FTA, including system setup and procedural guidance.",
  },
  {
    icon: Calculator,
    title: "Ongoing Tax Compliance",
    description:
      "End-to-end management of VAT, Withholding Tax, Transfer Pricing, and Corporate Income Tax obligations with timely filing and documentation.",
  },
  {
    icon: TrendingUp,
    title: "Zakat & Corporate Tax Advisory",
    description:
      "Expert guidance on Zakat calculations and Corporate Tax planning, helping you understand obligations and optimize structure.",
  },
  {
    icon: DollarSign,
    title: "VAT Refund Assistance",
    description:
      "Support in claiming and recovering VAT refunds, managing the documentation and submission process efficiently.",
  },
  {
    icon: Globe,
    title: "Withholding Tax Refund",
    description:
      "Assistance with withholding tax refunds under applicable Double Tax Treaties, maximizing your recoveries.",
  },
  {
    icon: Search,
    title: "Tax Health Checks & Risk Assessments",
    description:
      "Comprehensive reviews of your tax position to identify risks, opportunities, and areas for improvement before issues arise.",
  },
];

const benefits = [
  {
    title: "Penalty Avoidance",
    description: "Prevent costly errors and regulatory penalties",
  },
  {
    title: "Tax Optimization",
    description: "Identify legitimate opportunities to reduce burden",
  },
  {
    title: "Regulatory Compliance",
    description: "Stay current with evolving GCC tax requirements",
  },
  {
    title: "Audit Readiness",
    description: "Be prepared with proper documentation",
  },
  {
    title: "Peace of Mind",
    description: "Confidence in accurate tax management",
  },
  {
    title: "Strategic Insight",
    description: "Tax planning aligned with business goals",
  },
];

const clientTypes = [
  {
    icon: Rocket,
    title: "Businesses New to UAE or KSA",
    description: "Companies entering the GCC markets",
  },
  {
    icon: FileText,
    title: "Companies Navigating VAT",
    description: "Organizations managing VAT compliance",
  },
  {
    icon: Shield,
    title: "Organizations Facing Audits",
    description: "Businesses preparing for tax audits",
  },
  {
    icon: Globe,
    title: "Cross-Border Businesses",
    description: "Companies with international transactions",
  },
  {
    icon: Building2,
    title: "Corporate Tax Compliance",
    description: "Organizations implementing Corporate Tax",
  },
];

const approachPoints = [
  {
    number: "01",
    title: "Technical Expertise",
    description:
      "Our team stays current with regulatory changes and maintains strong relationships with tax authorities across the GCC region.",
  },
  {
    number: "02",
    title: "Clear Communication",
    description:
      "We explain complex tax requirements in clear language, ensuring you understand your obligations and opportunities.",
  },
  {
    number: "03",
    title: "Practical Systems",
    description:
      "We implement practical systems and processes that make ongoing compliance manageable and sustainable for your business.",
  },
  {
    number: "04",
    title: "Business Understanding",
    description:
      "We combine tax knowledge with practical business understanding to provide advice that supports your commercial objectives.",
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
          serviceName="Taxation Services"
          title="Navigate GCC Tax|Requirements with|Confidence"
          subtitle="Expert guidance and compliance support for VAT, Corporate Tax, Zakat, and Withholding Tax across the GCC."
          backgroundComponent={
            <ColorBends
              colors={["#ffffff", "#ffffff", "#efefef"]}
              speed={0.5}
              scale={1.2}
              frequency={1.5}
            />
          }
        />
      </div>

      <div ref={overviewRef}>
        <OverviewSection
          overviewInView={overviewInView}
          title="Tax Compliance That Protects Your Business"
          description="Tax regulations in the GCC are evolving rapidly—from VAT implementation to new Corporate Tax frameworks. Non-compliance brings penalties, audits, and operational disruption. Our taxation services ensure you meet all obligations accurately and on time, while identifying opportunities to optimize your tax position within the law."
        />
      </div>

      <div ref={offeringsRef}>
        <OfferingsSection
          offeringsInView={offeringsInView}
          offerings={offerings}
          sectionTitle="What We Offer"
          columns={3}
        />
      </div>

      <div ref={whyRef}>
        <WhyItMattersSection
          whyInView={whyInView}
          benefits={benefits}
          sectionTitle="Why This Matters"
          sectionSubtitle="The Value of Tax Expertise"
        />
      </div>

      <div ref={whoRef}>
        <WhoBenefitsSection
          whoInView={whoInView}
          clientTypes={clientTypes}
          sectionTitle="Who Benefits"
          sectionSubtitle="Ideal for"
        />
      </div>

      <div ref={approachRef}>
        <ApproachSection
          approachInView={approachInView}
          approachPoints={approachPoints}
          sectionTitle="Our Approach"
          sectionSubtitle="How We Work"
        />
      </div>

      <div ref={ctaRef}>
        <ServiceCTA
          ctaInView={ctaInView}
          title="Ready for Confident|Tax Compliance"
          subtitle="Let's ensure you meet all tax obligations while optimizing your position."
          buttonText="Get Started"
          buttonHref="/contact"
          serviceName="Taxation Services"
        />
      </div>
    </main>
  );
}
