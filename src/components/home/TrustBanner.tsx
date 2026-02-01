import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Award, Globe, Building2 } from "lucide-react";

const trustItems = [
  { icon: Shield, label: "Licensed & Compliant" },
  { icon: Award, label: "Multi-Domain Expertise" },
  { icon: Globe, label: "GCC Specialists" },
  { icon: Building2, label: "SMEs & Enterprises" },
];

export function TrustBanner() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-6 border-y border-border/50 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Marquee effect with hover pause */}
        <div className="flex items-center gap-12 overflow-hidden group/marquee">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="flex items-center gap-12 animate-marquee whitespace-nowrap"
          >
            {[...trustItems, ...trustItems, ...trustItems].map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium text-sm whitespace-nowrap">
                  {item.label}
                </span>
                <span className="text-primary/30 text-2xl font-light">•</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}