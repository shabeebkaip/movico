"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ValueSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);

  const images = [
    "https://movicoksa.com/wp-content/uploads/2024/10/45-scaled.jpg",
    "https://movicoksa.com/wp-content/uploads/2024/10/DSC07117-scaled.jpg",
    "https://movicoksa.com/wp-content/uploads/2024/10/6B2A6289-scaled.jpg",
    "https://movicoksa.com/wp-content/uploads/2024/10/30-scaled.jpg",
  ];

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      // Cards stagger reveal with rotation
      const cards = gsap.utils.toArray<HTMLElement>('.gallery-card');
      
      cards.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 40%",
            scrub: 1,
          },
          y: 150,
          rotation: index % 2 === 0 ? 8 : -8,
          opacity: 0,
          scale: 0.8,
        });
      });

      // Text word reveal
      if (textRef.current) {
        const words = textRef.current.querySelectorAll('.word');
        gsap.from(words, {
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 75%",
            end: "top 35%",
            scrub: 1,
          },
          opacity: 0.1,
          y: 30,
          stagger: 0.05,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 lg:py-48 overflow-hidden bg-background"
    >
      {/* Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,134,41,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.06),transparent_50%)]" />
      
      {/* Animated Overlay */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/50"
      />

      <motion.div
        ref={containerRef}
        style={{ y }}
        className="container mx-auto px-6 relative z-10"
      >
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Text Content */}
          <div className="space-y-8">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm uppercase tracking-[0.4em] text-primary font-medium block"
            >
              About Movico
            </motion.span>
            
            <div ref={textRef}>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-8">
                {['Where', 'Strategy', 'Meets', 'Creative'].map((word, i) => (
                  <span key={i} className="word inline-block mr-3 lg:mr-4">
                    {word}
                  </span>
                ))}
                <br />
                <span className="word inline-block text-gradient-orange">Execution</span>
              </h2>
              
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Movico is a trusted marketing and creative agency in Riyadh. Since 2020, 
                we've combined branding, digital marketing, video production, and event 
                management to build brands that dominate attention.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <motion.div 
                  className="text-4xl lg:text-5xl font-display font-bold text-gradient-orange mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  4+
                </motion.div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Years</div>
              </div>
              
              <div>
                <motion.div 
                  className="text-4xl lg:text-5xl font-display font-bold text-gradient-orange mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                >
                  120+
                </motion.div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Projects</div>
              </div>
              
              <div>
                <motion.div 
                  className="text-4xl lg:text-5xl font-display font-bold text-gradient-orange mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                >
                  50+
                </motion.div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Clients</div>
              </div>
            </div>
          </div>

          {/* Right: Image Gallery */}
          <div ref={cardsRef} className="grid grid-cols-2 gap-4 lg:gap-6">
            {images.map((img, index) => (
              <motion.div
                key={index}
                className="gallery-card group relative aspect-[3/4] rounded-3xl overflow-hidden"
                whileHover={{ scale: 1.05, rotate: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Image
                  src={img}
                  alt={`Movico project ${index + 1}`}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Number Badge */}
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-all duration-500">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
