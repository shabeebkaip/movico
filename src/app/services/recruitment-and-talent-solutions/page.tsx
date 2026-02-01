"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Target,
  Search,
  CheckCircle2,
  TrendingUp,
  Globe,
  Briefcase,
  Rocket,
} from "lucide-react";

import Waves from "@/components/Waves";
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
    title: "Specialized Talent Sourcing & Headhunting",
    description:
      "Targeted recruitment for hard-to-fill positions, leveraging extensive networks and industry knowledge to find exceptional candidates.",
  },
  {
    icon: Globe,
    title: "Candidates for Remote & On-Site Roles",
    description:
      "Flexible recruitment support whether you're building an in-office team, remote workforce, or hybrid model.",
  },
  {
    icon: CheckCircle2,
    title: "Screening & Shortlisting Services",
    description:
      "Comprehensive candidate evaluation including skills assessment, experience verification, and cultural fit analysis—delivering only qualified, relevant candidates.",
  },
];

const benefits = [
  {
    title: "Reduced Time & Cost",
    description:
      "Minimize hiring costs and reduce time-to-hire with pre-vetted, qualified candidates",
  },
  {
    title: "Better Quality Hires",
    description:
      "Access top-tier talent matched to your specific needs, culture, and goals",
  },
  {
    title: "Lower Turnover",
    description:
      "Improve employee retention with candidates who fit your team and organizational culture",
  },
  {
    title: "Strategic Advantage",
    description:
      "Build high-performing teams that drive business growth and competitive differentiation",
  },
];

const clientTypes = [
  {
    icon: TrendingUp,
    title: "Growing Companies Building New Teams",
    description:
      "Scale your workforce efficiently with quality hires who align with your vision and goals",
  },
  {
    icon: Search,
    title: "Businesses Struggling to Find Specialized Talent",
    description:
      "Access niche expertise and hard-to-find skill sets through our extensive networks",
  },
  {
    icon: Globe,
    title: "Organizations Expanding in New Markets",
    description:
      "Find local talent with market knowledge and cultural understanding for new geographies",
  },
  {
    icon: Briefcase,
    title: "Companies Transitioning to Remote Work",
    description:
      "Build distributed teams with candidates experienced in remote collaboration and productivity",
  },
  {
    icon: Rocket,
    title: "Startups Requiring Rapid Team Scaling",
    description:
      "Quickly build your core team with agile hiring processes and startup-savvy candidates",
  },
];

const approachPoints = [
  {
    number: "01",
    title: "Understand Culture, Needs & Goals",
    description:
      "We take time to understand your culture, needs, and goals—not just job descriptions. Deep discovery ensures we find candidates who truly fit.",
  },
  {
    number: "02",
    title: "Comprehensive Screening Process",
    description:
      "Our screening process evaluates technical capabilities, experience relevance, communication skills, and cultural alignment before shortlisting.",
  },
  {
    number: "03",
    title: "Efficient Process Management",
    description:
      "We manage the entire process efficiently, keeping you informed and involved at key decision points without overwhelming you with unqualified candidates.",
  },
  {
    number: "04",
    title: "Ongoing Support & Follow-Up",
    description:
      "Our commitment doesn't end at placement. We provide ongoing support to ensure successful onboarding and long-term fit for both parties.",
  },
];

export default function RecruitmentAndTalentSolutionsPage() {
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
          serviceName="Recruitment & Talent Solutions"
          title="Find the Right|People for Your|Team"
          subtitle="Strategic recruitment services that connect you with exceptional talent aligned to your business goals and culture."
          backgroundComponent={
            <Waves
              lineColor="rgba(255, 255, 255, 0.15)"
              backgroundColor="transparent"
              waveSpeedX={0.02}
              waveSpeedY={0.01}
              waveAmpX={40}
              waveAmpY={20}
              friction={0.9}
              tension={0.01}
              maxCursorMove={120}
              xGap={12}
              yGap={36}
            />
          }
          showAnimatedOrbs={true}
        />
      </div>

      <div ref={overviewRef}>
        <OverviewSection
          overviewInView={overviewInView}
          title="Hiring the Right People Changes Everything"
          description="Great teams don't happen by accident—they're built through thoughtful, strategic hiring. Our recruitment services go beyond filling positions. We help you find people who have the right skills, fit your culture, share your values, and contribute to your long-term success."
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
          sectionSubtitle="The Impact of Great Hiring"
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
          title="Ready to Build|Your Dream|Team"
          subtitle="Let's find the exceptional talent that will drive your business forward."
          buttonText="Start Hiring"
          buttonHref="/contact"
          serviceName="Recruitment & Talent Solutions"
        />
      </div>
    </main>
  );
}
