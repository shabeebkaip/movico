import type { Metadata } from "next";
import { readContent, readDesign } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/cms/seo-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home");
}

import { HeroSection } from "@/components/home/HeroSection";
import { MarqueeText } from "@/components/home/MarqueeText";
import ClientsSection from "@/components/home/Clients";
import { About } from "@/components/home/About";
import WorkShowcase from "@/components/home/WorkShowcase";
import { ServicesSection } from "@/components/home/ServicesSection";
import ShowReel from "@/components/home/ShowReel";
import StudioPromo from "@/components/home/StudioPromo";
import CaseStudy from "@/components/home/CaseStudy";
import ProcessFlow from "@/components/home/ProcessFlow";
import Testimonials from "@/components/home/Testimonials";
import InsightsSection from "@/components/home/InsightsSection";
import { FAQSection } from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import SceneDivider from "@/components/SceneDivider";

// ponytail: next/dynamic() was tried for these below-the-fold sections to
// code-split them out of the initial bundle, but under this project's
// Turbopack production build, dynamic() with the default ssr:true still
// bundles the component into the same initial payload (no client-only defer
// happens without ssr:false) — measured ~0 net byte reduction, only added
// chunk-count overhead. Reverted. Real ssr:false lazy-loading would need
// height-matched skeletons per section to avoid CLS regression — out of
// scope for this pass; flag for a future, more surgical attempt if needed.

export default async function Page() {
  const [content, design] = await Promise.all([readContent(), readDesign()]);
  const s = design.sections.home;

  return (
    <main className="min-h-screen bg-black">
      {s.hero && <HeroSection content={content.home.hero} />}

      {design.sceneDividers.enabled && s.hero && (
        <SceneDivider tone="amber" from="left" spread={380} />
      )}

      {s.marquee && <MarqueeText content={content.home.marquee} />}

      {s.clients && <ClientsSection />}

      {design.sceneDividers.enabled && s.clients && (
        <SceneDivider tone="indigo" from="right" spread={380} />
      )}

      {s.about && <About content={content.home.about} />}

      {design.sceneDividers.enabled && s.about && (
        <SceneDivider tone="amberIndigo" from="center" spread={380} />
      )}

      {s.workShowcase && <WorkShowcase content={content.home.workShowcase} />}

      {design.sceneDividers.enabled && s.workShowcase && (
        <SceneDivider tone="teal" from="left" spread={380} />
      )}

      {s.services && (
        <ServicesSection
          content={content.home.services}
          columns={design.layout.servicesColumns as 2 | 3 | 4}
        />
      )}

      {design.sceneDividers.enabled && s.services && (
        <SceneDivider tone="amber" from="left" spread={380} />
      )}

      {s.studioPromo && <StudioPromo />}

      {design.sceneDividers.enabled && s.studioPromo && (
        <SceneDivider tone="amber" from="center" spread={380} intensity={1.2} />
      )}

      {s.showreel && <ShowReel />}

      {design.sceneDividers.enabled && s.showreel && (
        <SceneDivider tone="crimson" from="right" spread={380} />
      )}

      {s.caseStudy && <CaseStudy />}

      {design.sceneDividers.enabled && s.caseStudy && (
        <SceneDivider tone="teal" from="left" spread={380} />
      )}

      {s.process && <ProcessFlow content={content.home.process} />}

      {design.sceneDividers.enabled && s.process && (
        <SceneDivider tone="amberIndigo" from="right" spread={380} />
      )}

      {s.testimonials && (
        <Testimonials
          content={content.home.testimonials}
          layout={design.layout.testimonialsLayout as "columns" | "carousel" | "grid"}
        />
      )}

      {s.insights && <InsightsSection />}

      {s.faq && (
        <div className="bg-white">
          <FAQSection content={content.home.faq} />
        </div>
      )}

      {design.sceneDividers.enabled && s.faq && (
        <SceneDivider tone="amber" from="center" spread={380} />
      )}

      {s.cta && <CTASection content={content.home.cta} />}
    </main>
  );
}
