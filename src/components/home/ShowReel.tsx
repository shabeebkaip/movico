"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, X } from "lucide-react";

const ShowReel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: textRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <section
        ref={sectionRef}
        id="showreel"
        className="relative bg-black overflow-hidden py-10 xl:py-16"
      >
        {/* Full-width video container with rounded corners */}
        <div className="w-11/12 xl:w-10/12 mx-auto relative h-[60vh] xl:h-[75vh] rounded-3xl xl:rounded-[3rem] overflow-hidden group cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          >
            <source
              src="https://res.cloudinary.com/dm5c31z7w/video/upload/v1769938198/0201_loykmi.mp4"
              type="video/mp4"
            />
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500" />

          {/* Content */}
          <div
            ref={textRef}
            className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          >
            <span className="text-white/50 uppercase tracking-[0.5em] text-[10px] mb-6">
              2024 Showreel
            </span>

            <h2 className="font-display font-black text-white text-5xl md:text-7xl xl:text-8xl uppercase leading-none mb-10">
              Watch Our
              <br />
              <span className="text-primary">Showreel</span>
            </h2>

            {/* Play button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 xl:w-24 xl:h-24 rounded-full bg-primary flex items-center justify-center shadow-lg cursor-pointer"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.div>
          </div>

          {/* Corner label */}
          <div className="absolute bottom-6 right-8 text-white/30 text-xs uppercase tracking-[0.3em]">
            Full Screen →
          </div>
        </div>
      </section>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[999] bg-black flex items-center justify-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white/60 hover:text-primary transition-colors z-10 flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
            >
              <X size={20} />
              Close
            </button>

            <motion.video
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.5 }}
              controls
              autoPlay
              className="w-[95%] max-w-6xl rounded-2xl"
            >
              <source
                src="https://res.cloudinary.com/dm5c31z7w/video/upload/v1769938198/0201_loykmi.mp4"
                type="video/mp4"
              />
            </motion.video>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShowReel;
