"use client";

import { useRef } from "react";
import { useInView, useScroll, useTransform } from "framer-motion";
import Hero from "@/components/about/Hero";
import WhoWeAre from "@/components/about/WhoWeAre";
import MissionVision from "@/components/about/MissionVision";
import WhatMakesUsDifferrent from "@/components/about/WhatMakesUsDifferrent";
import OurValues from "@/components/about/OurValues";
import WhereWeOperate from "@/components/about/WhereWeOperate";
import GetInTouch from "@/components/about/GetInTouch";


export default function Page() {
  const heroRef = useRef<HTMLElement>(null);
  const whoWeAreRef = useRef<HTMLElement>(null);
  const missionVisionRef = useRef<HTMLElement>(null);
  const differenceRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const locationRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const whoWeAreInView = useInView(whoWeAreRef, {
    once: true,
    margin: "-100px",
  });
  const missionVisionInView = useInView(missionVisionRef, {
    once: true,
    margin: "-100px",
  });
  const differenceInView = useInView(differenceRef, {
    once: true,
    margin: "-100px",
  });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const locationInView = useInView(locationRef, {
    once: true,
    margin: "-100px",
  });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main className="min-h-screen bg-background noise">
      <Hero
          heroRef={heroRef}
          heroInView={heroInView}
          heroY={heroY}
          heroOpacity={heroOpacity}
        />
        <WhoWeAre whoWeAreRef={whoWeAreRef} whoWeAreInView={whoWeAreInView} />
        <MissionVision
          missionVisionRef={missionVisionRef}
          missionVisionInView={missionVisionInView}
        />
        <WhatMakesUsDifferrent
          differenceInView={differenceInView}
          differenceRef={differenceRef}
        />
        <OurValues valuesRef={valuesRef} valuesInView={valuesInView} />
        <WhereWeOperate
          locationRef={locationRef}
          locationInView={locationInView}
        />
        <GetInTouch ctaRef={ctaRef} ctaInView={ctaInView} />
    </main>
  );
}
