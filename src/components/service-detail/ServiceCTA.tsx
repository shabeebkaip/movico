"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import ServiceInquiryModal from "./ServiceInquiryModal";

interface ServiceCTAProps {
  ctaInView: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  serviceName?: string;
}

export default function ServiceCTA({
  ctaInView,
  title = "Ready to Get Started",
  subtitle = "Let's discuss how we can support your business goals and help you achieve sustainable growth.",
  buttonText = "Schedule a Consultation",
  buttonHref = "/contact",
  serviceName = "Our Services",
}: ServiceCTAProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-32 bg-secondary/30 relative overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full bg-primary/5 blur-3xl"
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
                {title.includes("|") ? (
                  <>
                    {title.split("|").map((line, index) => (
                      <span key={index}>
                        <span
                          className={
                            index % 2 === 0 ? "text-outline" : "text-foreground"
                          }
                        >
                          {line}
                        </span>
                        {index < title.split("|").length - 1 && <br />}
                      </span>
                    ))}
                    <span className="text-gradient-silver">?</span>
                  </>
                ) : (
                  <>
                    <span className="text-outline">{title}</span>
                    <span className="text-gradient-silver">?</span>
                  </>
                )}
              </h2>

              <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>

              <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 group"
              >
                {buttonText}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <ServiceInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName={serviceName}
      />
    </>
  );
}
