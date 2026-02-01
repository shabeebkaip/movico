"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  TrendingUp,
  Globe,
  Search,
  Target,
  Share2,
  Video,
  Users,
  BarChart3,
  Rocket,
  Eye,
  DollarSign,
  PenTool,
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
    icon: Target,
    title: "Performance Marketing",
    description:
      "Results-focused campaigns across Google, Meta (Facebook/Instagram), LinkedIn, and other platforms—optimized for lead generation, conversions, and ROI.",
  },
  {
    icon: Globe,
    title: "Website Design & Development",
    description:
      "Create fast, responsive, user-friendly websites that look great, function perfectly, and convert visitors into customers.",
  },
  {
    icon: Search,
    title: "Search Engine Optimization (SEO)",
    description:
      "Improve organic visibility and drive qualified traffic through technical optimization, content strategy, and authority building.",
  },
  {
    icon: TrendingUp,
    title: "Search Engine Marketing (SEM)",
    description:
      "Launch and manage paid search campaigns that capture high-intent traffic and maximize return on ad spend.",
  },
  {
    icon: Share2,
    title: "Social Media Management & Campaign Execution",
    description:
      "Build engaged communities and drive results through strategic social media content, community management, and targeted campaigns.",
  },
  {
    icon: PenTool,
    title: "Content Development & Copywriting",
    description:
      "Create compelling content that educates, engages, and converts—from website copy to blog posts to email campaigns.",
  },
  {
    icon: Video,
    title: "Video Development & Storytelling",
    description:
      "Produce professional video content that captures attention, tells your story, and drives engagement across all channels.",
  },
  {
    icon: Users,
    title: "Influencer Marketing & Collaborations",
    description:
      "Amplify reach and credibility through strategic partnerships with relevant influencers and brand collaborations.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Performance Optimization",
    description:
      "Continuous monitoring, analysis, and optimization based on real performance data—ensuring every campaign improves over time.",
  },
];

const benefits = [
  {
    title: "Precise Targeting",
    description: "Reach the right audiences with data-driven precision",
  },
  {
    title: "Measurable Results",
    description: "Track ROI and performance across all channels",
  },
  {
    title: "Cost Efficiency",
    description: "Maximize marketing budget with optimized campaigns",
  },
  {
    title: "Brand Awareness",
    description: "Build recognition and recall in your market",
  },
  {
    title: "Lead Generation",
    description: "Drive qualified prospects to your business",
  },
  {
    title: "Continuous Improvement",
    description: "Optimize campaigns based on real-time data",
  },
];

const clientTypes = [
  {
    icon: Rocket,
    title: "Product or Service Launches",
    description: "Businesses launching new offerings",
  },
  {
    icon: Eye,
    title: "Increasing Online Visibility",
    description: "Companies looking to improve digital presence",
  },
  {
    icon: TrendingUp,
    title: "Struggling Digital Performance",
    description: "Organizations needing better results",
  },
  {
    icon: Users,
    title: "Building Engaged Communities",
    description: "Brands seeking audience connections",
  },
  {
    icon: DollarSign,
    title: "Better Marketing ROI",
    description: "Businesses wanting higher returns",
  },
];

const approachPoints = [
  {
    number: "01",
    title: "Clear Objectives & Audience Understanding",
    description:
      "We start with clear objectives and deep audience understanding to ensure every campaign is strategically aligned with your business goals.",
  },
  {
    number: "02",
    title: "Creative Thinking & Analytical Rigor",
    description:
      "Our strategies combine creative thinking with analytical rigor, balancing innovative ideas with data-driven decision making.",
  },
  {
    number: "03",
    title: "Test, Measure, Learn, Optimize",
    description:
      "We continuously test new approaches, measure performance, learn from the data, and optimize campaigns for better results.",
  },
  {
    number: "04",
    title: "Transparent Reporting",
    description:
      "You'll always know what's working, what's not, and what we're doing to improve results with clear, regular reporting.",
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
          serviceName="Digital Marketing"
          title="Growth Through|Strategic Digital|Marketing"
          subtitle="Data-driven campaigns that attract, engage, and convert your target audience across all digital channels."
          backgroundComponent={
            <DotGrid
              dotSize={1.2}
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
          title="Beyond Visibility—Driving Real Business Results"
          description="Digital marketing is more than creating awareness—it's about driving measurable business outcomes. Our integrated approach combines strategy, creativity, and data to deliver campaigns that attract the right audiences, engage them effectively, and convert them into customers and advocates."
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
          sectionSubtitle="The Digital Advantage"
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
          sectionSubtitle="Data-Driven Strategy"
        />
      </div>

      <div ref={ctaRef}>
        <ServiceCTA
          ctaInView={ctaInView}
          title="Ready to Accelerate|Your Digital|Growth"
          subtitle="Let's create a digital marketing strategy that drives real business results and sustainable growth."
          buttonText="Start Your Digital Journey"
          buttonHref="/contact"
          serviceName="Digital Marketing"
        />
      </div>
    </main>
  );
}
