"use client";

import { motion } from "framer-motion";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import type { TestimonialsContent } from "@/lib/cms/types";
import { defaultContent } from "@/lib/cms/types";

const D = defaultContent.home.testimonials;

const Testimonials = ({
  content = D,
}: {
  content?: TestimonialsContent;
  layout?: "columns" | "carousel" | "grid";
}) => {
  const testimonials = content.items;
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);
  return (
    <section className="bg-black text-white py-20 xl:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-11/12 xl:w-10/12 mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 xl:mb-16"
        >
          <span className="uppercase tracking-[0.5em] text-[10px] text-white/40 block mb-5">
            {content.label}
          </span>

          <h2 className="font-display text-5xl md:text-6xl xl:text-7xl uppercase leading-none mb-5">
            {content.heading}{" "}
            <span className="text-primary">{content.headingHighlight}</span>
            <br />
            {content.headingLine2}
          </h2>

          <p className="text-white/45 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            {content.subheading}
          </p>
        </motion.div>

        {/* Scrolling columns — gradient mask fades top and bottom */}
        <div
          className="flex justify-center gap-5 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            maxHeight: "min(680px, 60vh)",
          }}
        >
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={22}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={16}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
