"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

const ShowReel = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      {/* Section */}
      <section className="relative py-40 bg-black overflow-hidden" id="showreel">

        {/* Cinematic Background Preview */}
        <div className="relative h-[70vh] rounded-3xl overflow-hidden shadow-deep">

          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/Movico-Showreel-2026 (1) (1).mp4" type="video/mp4" />
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-white"
            >
              Watch Our
              <br />
              <span className="text-primary">Showreel</span>
            </motion.h2>

            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-hover transition-all"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.button>

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
            className="fixed inset-0 z-999 bg-black flex items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 text-white hover:text-primary transition-colors"
            >
              <X size={32} />
            </button>

            {/* Video */}
            <motion.video
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5 }}
              controls
              autoPlay
              className="w-[90%] max-w-6xl rounded-xl shadow-deep"
            >
              <source src="https://res.cloudinary.com/dm5c31z7w/video/upload/v1769938198/0201_loykmi.mp4" type="video/mp4" />
            </motion.video>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShowReel;
