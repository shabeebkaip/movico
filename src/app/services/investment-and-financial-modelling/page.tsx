"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Lightbulb,
  Building2,
  Rocket,
  Briefcase,
  Globe,
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
    icon: PieChart,
    title: "Business Valuation & Feasibility Studies",
    description:
      "Comprehensive analysis of business value using appropriate methodologies, plus detailed feasibility assessments for new ventures or expansions.",
  },
  {
    icon: LineChart,
    title: "Financial Modelling & Scenario Planning",
    description:
      "Sophisticated financial models that project performance under different scenarios, helping you understand risks and opportunities before committing resources.",
  },
  {
    icon: BarChart3,
    title: "Investor-Ready Pitch Decks & Presentations",
    description:
      "Professionally designed presentations that tell your story compellingly, backed by solid financials that build investor confidence.",
  },
  {
    icon: TrendingUp,
    title: "Cash Flow Projections & ROI Analysis",
    description:
      "Detailed cash flow forecasting and return on investment analysis that shows when and how investments will pay off.",
  },
];

const benefits = [
  {
    title: "Risk Mitigation",
    description: "Identify and quantify risks before committing resources",
  },
  {
    title: "Informed Decisions",
    description: "Make strategic choices backed by solid analysis",
  },
  {
    title: "Investor Confidence",
    description: "Build credibility with professional presentations",
  },
  {
    title: "Clear Returns",
    description: "Understand payback periods and break-even points",
  },
  {
    title: "Scenario Planning",
    description: "Evaluate multiple outcomes and contingencies",
  },
  {
    title: "Strategic Insight",
    description: "Gain quantitative foundation for growth plans",
  },
];

const clientTypes = [
  {
    icon: Rocket,
    title: "Startups Seeking Investment",
    description: "Early-stage companies raising capital",
  },
  {
    icon: Building2,
    title: "Companies Evaluating Acquisitions",
    description: "Organizations considering M&A opportunities",
  },
  {
    icon: Globe,
    title: "Businesses Planning Expansion",
    description: "Companies scaling operations or entering new markets",
  },
  {
    icon: Briefcase,
    title: "Organizations Preparing for Exit",
    description: "Businesses planning sale or succession",
  },
  {
    icon: Lightbulb,
    title: "Entrepreneurs Validating Concepts",
    description: "Founders testing new venture viability",
  },
];

const approachPoints = [
  {
    number: "01",
    title: "Sophisticated Yet Usable",
    description:
      "We build models that balance analytical depth with practical usability, ensuring they serve as effective decision-making tools.",
  },
  {
    number: "02",
    title: "Realistic Assumptions",
    description:
      "Our financial projections are grounded in realistic assumptions, supported by thorough market research and industry benchmarks.",
  },
  {
    number: "03",
    title: "Question-Driven Analysis",
    description:
      "We design our analysis to answer the specific questions that decision-makers and investors need addressed for your situation.",
  },
  {
    number: "04",
    title: "Strategic Insights",
    description:
      "We don't just deliver spreadsheets—we provide strategic insights, recommendations, and clear explanations of what the numbers mean.",
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
          serviceName="Investment & Financial Modelling"
          title="Smarter Investments|Through Better|Models"
          subtitle="Data-driven financial models and valuations that turn complex decisions into clear, confident choices."
          backgroundComponent={
            <DotGrid
              dotSize={3.2}
              gap={25}
              baseColor="#ffffff"
              activeColor="#ffffff"
              className="opacity-20"
            />
          }
          showAnimatedOrbs={true}
        />
      </div>

      <div ref={overviewRef}>
        <OverviewSection
          overviewInView={overviewInView}
          title="Decisions Backed by Numbers That Make Sense"
          description="Whether you're raising capital, evaluating an acquisition, or planning expansion, the quality of your financial analysis directly impacts the quality of your decisions. Our investment analysis and financial modelling services deliver the rigorous quantitative foundation you need to move forward with confidence."
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
          sectionSubtitle="The Power of Financial Clarity"
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
          title="Ready to Make|Data-Driven|Investment Decisions"
          subtitle="Let's build the financial models and analysis you need to move forward with confidence."
          buttonText="Get Started"
          buttonHref="/contact"
          serviceName="Investment & Financial Modelling"
        />
      </div>
    </main>
  );
}
