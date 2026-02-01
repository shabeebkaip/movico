'use client';

import { motion } from 'framer-motion';
import { ArrowRight, UserPlus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import RippleGrid from '@/components/ui/ripple-grid';

interface JobsHeroProps {
  heroRef: React.RefObject<HTMLElement>;
  heroInView: boolean;
  heroY: any;
  heroOpacity: any;
}

export default function JobsHero({ heroRef, heroInView, heroY, heroOpacity }: JobsHeroProps) {
  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24 pb-20"
    >
      {/* Ripple Grid Background */}
      <div className="absolute inset-0 z-0">
        <RippleGrid
          enableRainbow={false}
          gridColor="#ffffff"
          rippleIntensity={0.05}
          gridSize={10}
          gridThickness={15}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
          opacity={0.8}
        />
      </div>
      
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/60 to-background/75" />
      </div>

      {/* Background elements */}
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 -left-32 w-125 h-125 rounded-full bg-accent/5 blur-orb z-0"
      />
      
      {/* Main Content Wrapper */}
      <div className="container mx-auto px-6 relative z-30 w-full">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
        >

          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-linear-to-r from-primary to-transparent" />
            <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-medium drop-shadow-lg">
              OCX Experts Talent Network
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
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-6 drop-shadow-2xl"
            >
              <span className="text-foreground">Connect Through</span>
              <br />
              <span className="text-outline">Trust</span>
              <br />
              <span className="text-foreground">Not Job Boards</span>
              <span className="text-gradient-silver">.</span>
            </motion.h1>
          </div>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="font-body text-lg sm:text-xl md:text-2xl text-foreground/90 max-w-3xl mb-12 leading-relaxed drop-shadow-lg"
          >
            OCX Experts is a job-match and professional community connecting{" "}
            <span className="text-foreground font-medium">
              GCC professionals with verified opportunities through trusted referrals.
            </span>
          </motion.p>
        </motion.div>

        {/* CTA Buttons - Separate from parallax effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="https://www.omarconnect.com/jobs-list"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 text-lg px-8 h-14 group w-full sm:w-auto"
            >
              <UserPlus className="mr-2 w-5 h-5" />
              Find Your Next Role
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          
          <Link
            href="https://www.omarconnect.com/job-create"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-foreground/20 hover:border-foreground/40 text-lg px-8 h-14 group w-full sm:w-auto"
            >
              <Building2 className="mr-2 w-5 h-5" />
              Post a Job Opening
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent z-0 pointer-events-none" />
    </section>
  );
}
