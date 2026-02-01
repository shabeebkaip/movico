"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Users,
  Shield,
  FileCheck,
  Building2,
  Globe,
  BarChart3,
  Rocket,
} from "lucide-react";

import DotGrid from "@/components/ui/dot-grid";
import ServiceHero from "@/components/service-detail/ServiceHero";
import OverviewSection from "@/components/service-detail/OverviewSection";
import OfferingsSection from "@/components/service-detail/OfferingsSection";
import WhyItMattersSection from "@/components/service-detail/WhyItMattersSection";
import WhoBenefitsSection from "@/components/service-detail/WhoBenefitsSection";
import ApproachSection from "@/components/service-detail/ApproachSection";
import ServiceCTA from "@/components/service-detail/ServiceCTA";

const offerings = [
  {
    icon: Users,
    title: "Retirement & Long-Term Benefit Plans",
    description:
      "Comprehensive actuarial valuations for pensions, gratuity schemes, and medical benefit plans using appropriate demographic and financial assumptions.",
  },
  {
    icon: FileCheck,
    title: "Accounting Disclosure Compliance",
    description:
      "Full support for disclosure requirements under IAS 19 (IFRS), FAS 87 (US GAAP), and IPSAS 39 (Public Sector), ensuring accurate financial statement presentation.",
  },
  {
    icon: BarChart3,
    title: "Accurate Valuations for Multiple Frameworks",
    description:
      "Expert valuations prepared for IFRS reporting, US GAAP compliance, and public sector reporting requirements.",
  },
];

const benefits = [
  {
    title: "Financial Planning",
    description: "Accurate liabilities enable better long-term planning",
  },
  {
    title: "Budgeting Support",
    description: "Proper valuations inform budget allocations",
  },
  {
    title: "Audit Readiness",
    description: "Pass audits with properly documented valuations",
  },
  {
    title: "Regulatory Compliance",
    description: "Meet all international and regional requirements",
  },
  {
    title: "Stakeholder Trust",
    description: "Build confidence with accurate reporting",
  },
  {
    title: "Risk Management",
    description: "Identify and manage benefit obligation risks",
  },
];

const clientTypes = [
  {
    icon: Building2,
    title: "Companies with Defined Benefit Plans",
    description: "Organizations with pension and gratuity obligations",
  },
  {
    icon: Globe,
    title: "Organizations Preparing IFRS",
    description: "Entities requiring IFRS financial statements",
  },
  {
    icon: FileCheck,
    title: "Businesses Undergoing Audits",
    description: "Companies requiring audit-ready valuations",
  },
  {
    icon: Rocket,
    title: "Companies Expanding in GCC",
    description: "Businesses growing in the GCC region",
  },
  {
    icon: Shield,
    title: "Public Sector Entities",
    description: "Organizations requiring IPSAS compliance",
  },
];

const approachPoints = [
  {
    number: "01",
    title: "Data Collection",
    description:
      "We work with your HR and finance teams to gather comprehensive employee data and benefit plan details.",
  },
  {
    number: "02",
    title: "Assumption Setting",
    description:
      "Apply appropriate demographic and financial assumptions based on your specific circumstances and regional factors.",
  },
  {
    number: "03",
    title: "Valuation Analysis",
    description:
      "Conduct detailed actuarial calculations using industry-standard methodologies and best practices.",
  },
  {
    number: "04",
    title: "Reporting & Disclosure",
    description:
      "Deliver comprehensive reports that satisfy auditors, regulators, and all stakeholder requirements.",
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
          serviceName="Employee End of Service Benefits"
          title="Accurate Valuations|for Employee|Benefits"
          subtitle="Expert actuarial valuations for retirement and end-of-service benefits that meet international accounting standards."
          backgroundComponent={
            <DotGrid
              dotSize={3}
              gap={25}
              baseColor="#ffffff"
              activeColor="#ffe900"
              className="opacity-20"
            />
          }
        />
      </div>

      <div ref={overviewRef}>
        <OverviewSection
          overviewInView={overviewInView}
          title="Compliance-Ready Actuarial Valuations"
          description="Employee benefit obligations represent significant long-term liabilities that must be accurately measured and disclosed. Our actuarial valuation services provide the precise calculations and comprehensive documentation needed to meet international accounting standards (IAS 19, FAS 87, IPSAS 39) and satisfy auditors and regulators."
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
          sectionSubtitle="The Value of Accurate Valuations"
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
          sectionSubtitle="Our Process"
        />
      </div>

      <div ref={ctaRef}>
        <ServiceCTA
          ctaInView={ctaInView}
          title="Ready for Accurate|Employee Benefit|Valuations"
          subtitle="Get the precise actuarial valuations you need for compliance, audit, and financial planning."
          buttonText="Get Started"
          buttonHref="/contact"
          serviceName="Employee End of Service Benefits"
        />
      </div>
    </main>
  );
}
