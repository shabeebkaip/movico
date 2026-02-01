import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Hero = ({heroRef, heroInView, heroY, heroOpacity}) => {
  return (
    <section ref={heroRef} className="relative overflow-hidden h-screen flex items-center justify-center pt-20 md:pt-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/about-hero.jpg"
          alt="About OCX"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-linear-to-b from-background/95 via-background/60 to-background/60" />
        {/* Additional black overlay for more darkness */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Animated background elements - now on top of image */}
      <div className="absolute inset-0 bg-grid opacity-10 z-1" />
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-orb z-1"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 -left-32 w-125 h-125 rounded-full bg-accent/5 blur-orb z-1"
      />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="container mx-auto px-6 lg:px-8 relative z-30"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/20 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span className="text-xs font-semibold tracking-wider uppercase text-foreground">
                About OCX
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.95] mb-8 drop-shadow-2xl"
          >
            Where Strategy
            <br />
            Meets <span className="text-gradient-silver">Execution</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg lg:text-xl text-foreground/90 leading-relaxed max-w-3xl mx-auto drop-shadow-lg"
          >
            Combining global standards with regional expertise to deliver
            integrated business solutions.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;