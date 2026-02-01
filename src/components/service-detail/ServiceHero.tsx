"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface ServiceHeroProps {
  heroInView: boolean;
  serviceName: string;
  title: string;
  subtitle: string;
  backgroundComponent?: ReactNode;
  backgroundImage?: string;
  showAnimatedOrbs?: boolean;
  showBreadcrumb?: boolean;
}

export default function ServiceHero({
  heroInView,
  serviceName,
  title,
  subtitle,
  backgroundComponent,
  backgroundImage,
  showBreadcrumb = true,
}: ServiceHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24 pb-20"
    >
      {/* Background Component (e.g., DotGrid, Orb, Waves, etc.) */}
      {backgroundComponent && (
        <div className="absolute inset-0 z-0">{backgroundComponent}</div>
      )}

      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt={serviceName}
            className="w-full h-full object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/60 to-background/75" />
        </div>
      )}
      
      {/* Main Content Wrapper */}
      <div className="container mx-auto px-6 relative z-30 w-full">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-8"
            >
              <a
                href="/services"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Back to Services</span>
              </a>
            </motion.div>
          )}

          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-linear-to-r from-primary to-transparent" />
            <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-medium drop-shadow-lg">
              {serviceName}
            </span>
          </motion.div>

          {/* Main headline */}
          <div className="mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.4,
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.9] mb-6 drop-shadow-2xl"
            >
              {title.includes("|") ? (
                <>
                  {title.split("|").map((line, index) => (
                    <span key={index}>
                      <span
                        className={
                          index % 2 === 0 ? "text-foreground" : "text-outline"
                        }
                      >
                        {line}
                      </span>
                      {index < title.split("|").length - 1 && <br />}
                    </span>
                  ))}
                  <span className="text-gradient-silver">.</span>
                </>
              ) : (
                <>
                  <span className="text-foreground">{title.split(" ")[0]}</span>
                  <br />
                  <span className="text-outline">
                    {title.split(" ").slice(1).join(" ")}
                  </span>
                  <span className="text-foreground">.</span>
                </>
              )}
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="font-body text-lg sm:text-xl md:text-2xl text-foreground/90 max-w-3xl leading-relaxed drop-shadow-lg"
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent z-0 pointer-events-none" />
    </section>
  );
}
