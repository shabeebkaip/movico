"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  FileText,
  TrendingUp,
  Shield,
  BarChart3,
  Users,
  Building2,
  Rocket,
  Target,
  Globe,
} from "lucide-react";

import Orb from "@/components/ui/orb";
import ServiceHero from "@/components/service-detail/ServiceHero";
import OverviewSection from "@/components/service-detail/OverviewSection";
import OfferingsSection from "@/components/service-detail/OfferingsSection";
import WhyItMattersSection from "@/components/service-detail/WhyItMattersSection";
import WhoBenefitsSection from "@/components/service-detail/WhoBenefitsSection";
import ApproachSection from "@/components/service-detail/ApproachSection";
import ServiceCTA from "@/components/service-detail/ServiceCTA";

const offerings = [
  {
    icon: FileText,
    title: "Day-to-Day Bookkeeping",
    description:
      "Keep your financial records accurate and up-to-date with systematic bookkeeping that captures every transaction and maintains audit-ready documentation.",
  },
  {
    icon: BarChart3,
    title: "Financial Statement Preparation",
    description:
      "Receive comprehensive financial statements including Profit & Loss, Balance Sheet, and Cash Flow statements prepared to professional standards.",
  },
  {
    icon: TrendingUp,
    title: "Customized Management Reports & Dashboards",
    description:
      "Get the insights you need with tailored reports and visual dashboards that highlight key performance indicators relevant to your business.",
  },
  {
    icon: Shield,
    title: "IFRS Compliance & Audit Support",
    description:
      "Ensure your financial reporting meets International Financial Reporting Standards with expert guidance and full audit support.",
  },
  {
    icon: Target,
    title: "Budgeting & Forecasting",
    description:
      "Plan for the future with detailed budgets and financial forecasts that help you anticipate challenges and seize opportunities.",
  },
];

const benefits = [
  {
    title: "Tax Compliance",
    description: "Avoid problems with accurate bookkeeping and documentation",
  },
  {
    title: "Cash Flow Management",
    description: "Understand and control your company's financial health",
  },
  {
    title: "Cost Control",
    description: "Identify expenses and optimize operational efficiency",
  },
  {
    title: "Profitability Analysis",
    description: "Discover which areas drive the most value",
  },
  {
    title: "Investor Credibility",
    description: "Build trust with professional financial reporting",
  },
  {
    title: "Informed Decisions",
    description: "Make strategic choices backed by accurate data",
  },
];

const clientTypes = [
  {
    icon: Rocket,
    title: "Startups",
    description: "Establishing financial foundations",
  },
  {
    icon: Building2,
    title: "SMEs",
    description: "Scaling operations efficiently",
  },
  {
    icon: TrendingUp,
    title: "Investment-Ready Companies",
    description: "Preparing for funding rounds",
  },
  {
    icon: Globe,
    title: "IFRS-Compliant Businesses",
    description: "Meeting international standards",
  },
  {
    icon: Users,
    title: "Growing Organizations",
    description: "Seeking better financial control",
  },
];

const approachPoints = [
  {
    number: "01",
    title: "Context, Not Just Numbers",
    description:
      "Every report includes interpretation and recommendations, helping you understand what the numbers mean.",
  },
  {
    number: "02",
    title: "Actionable Insights",
    description:
      "We don't just show you data—we highlight specific actions to consider based on your financial position.",
  },
  {
    number: "03",
    title: "Current Standards",
    description:
      "Our team stays updated with accounting standards and regional requirements for full compliance.",
  },
  {
    number: "04",
    title: "Maximum Efficiency",
    description:
      "We streamline processes to ensure compliance while optimizing your financial operations.",
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
          serviceName="Accounting & Financial Reporting"
          title="Financial Clarity That Drives Better Decisions"
          subtitle="Reliable accounting solutions for businesses that value accuracy, compliance, and strategic insight."
          backgroundComponent={
            <Orb
              hoverIntensity={0.5}
              rotateOnHover={true}
              hue={0}
              forceHoverState={false}
            />
          }
          backgroundImage="/accounting-hero.jpg"
          showAnimatedOrbs={true}
        />
      </div>

      <div ref={overviewRef}>
        <OverviewSection
          overviewInView={overviewInView}
          title="The Foundation of Business Success"
          description="Sound financial management is the foundation of every successful business. Our accounting and financial reporting services provide the clarity, compliance, and control you need to make informed decisions, satisfy stakeholders, and drive sustainable growth."
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
          sectionSubtitle="The benefits of getting it right"
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
          title="Ready to Strengthen Your Financial Management"
          subtitle="Let's discuss how our accounting services can support your business goals."
          buttonText="Request a Consultation"
          buttonHref="/contact"
          serviceName="Accounting & Financial Reporting"
        />
      </div>
    </main>
  );
}
