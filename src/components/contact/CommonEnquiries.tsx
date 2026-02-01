"use client";

import { motion } from "framer-motion";

const CommonEnquiries = ({ inquiriesInView, inquiriesRef }) => {
  const inquiryTypes = [
    {
      title: "For New Client Inquiries",
      description:
        "Whether you need a single service or comprehensive support, we're here to help. Reach out to discuss your needs.",
    },
    {
      title: "For Existing Clients",
      description:
        "Have questions about your current engagement? Contact your dedicated account manager or reach out via the channels above.",
    },
    {
      title: "For Partnership Opportunities",
      description:
        "Interested in collaborating with OCX? We're always open to strategic partnerships that create value.",
    },
  ];
  return (
    <section
      ref={inquiriesRef}
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inquiriesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tighter text-foreground mb-4">
              Common <span className="text-gradient-silver">Inquiries</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {inquiryTypes.map((inquiry, index) => (
              <motion.div
                key={inquiry.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inquiriesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                className="group"
              >
                <div className="p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 shadow-elevated hover:shadow-glow transition-all duration-500 h-full">
                  <h3 className="font-display text-lg font-bold text-foreground mb-3">
                    {inquiry.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {inquiry.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommonEnquiries;
