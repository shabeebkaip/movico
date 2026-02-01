"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  FileText,
  TrendingUp,
  Users,
  Target,
  Palette,
  Megaphone,
  Calculator,
} from "lucide-react";

const services = [
  {
    icon: Calculator,
    title: "Accounting & Financial Reporting",
    description:
      "Keep your finances clear, compliant, and decision-ready with comprehensive accounting solutions that provide the visibility you need to manage and grow your business.",
    href: "/services/accounting-and-financial-reporting",
  },
  {
    icon: Users,
    title: "Employee End of Service Benefits",
    description:
      "Ensure accurate actuarial valuations for employee benefit obligations with expert analysis aligned to international standards and regulatory requirements.",
    href: "/services/employee-end-of-service-benefits",
  },
  {
    icon: FileText,
    title: "Taxation Services",
    description:
      "Navigate the complexities of UAE and KSA tax regulations with confidence. Our practical, compliance-focused approach optimizes your tax position while eliminating risk.",
    href: "/services/taxation-services",
  },
  {
    icon: TrendingUp,
    title: "Investment & Financial Modelling",
    description:
      "Make informed strategic decisions backed by detailed financial analysis, valuation expertise, and investor-ready documentation.",
    href: "/services/investment-and-financial-modelling",
  },
  {
    icon: Palette,
    title: "Branding Services",
    description:
      "Create a powerful brand identity that resonates with your audience and differentiates you in the market through strategic positioning and compelling design.",
    href: "/services/branding-services",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description:
      "Amplify your reach, engage your audience, and drive measurable growth through data-driven digital marketing strategies and creative execution.",
    href: "/services/digital-marketing",
  },
  {
    icon: Target,
    title: "Recruitment & Talent Solutions",
    description:
      "Build high-performing teams with specialized talent sourcing, thorough screening, and expert headhunting for both remote and on-site positions.",
    href: "/services/recruitment-and-talent-solutions",
  },
];

export default function ServicesGrid({ servicesInView }) {
  const { scrollYProgress } = useScroll();

  return (
    <section className="py-32 bg-secondary/20 border-y border-border relative overflow-hidden">
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [100, -100]),
        }}
        className="absolute -top-40 -right-40 w-150 h-150 rounded-full bg-primary/5 blur-orb"
      />
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [-50, 50]),
        }}
        className="absolute -bottom-40 -left-40 w-150 h-150 rounded-full bg-accent/5 blur-orb"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-medium mb-4 block">
              Our Service Areas
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground">
              What We <span className="text-gradient-silver">Offer</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.8,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="group"
                >
                  <a href={service.href}>
                    <div className="glass-card p-8 h-full flex flex-col hover:bg-primary/5 transition-all duration-500 relative overflow-hidden">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>

                      {/* Content */}
                      <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 grow">
                        {service.description}
                      </p>

                      {/* Learn More Link */}
                      <div className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all">
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>

                      {/* Hover effect line */}
                      <div className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-primary to-transparent group-hover:w-full transition-all duration-700" />
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
