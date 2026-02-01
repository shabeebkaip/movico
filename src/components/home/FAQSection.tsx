"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What makes OCX different from other consultancies?",
    answer:
      "OCX brings Big 4 discipline across accounting & finance, taxation, digital marketing, financial modelling, and recruitment—all under one roof. No more vendor chaos.",
  },
  {
    question: "Do you work with startups or only established businesses?",
    answer:
      "We grow with you—from startups handling first tax filings and bookkeeping to enterprises scaling across the GCC. Our model flexes as your needs evolve.",
  },
  {
    question: "How much time will this take from my team?",
    answer:
      "Week 1: we gather data (2-3 hours from your side). After that, we handle 95% of the work with weekly updates.",
  },
  {
    question: "What are your pricing models?",
    answer:
      "Flexible options: project-based fees, monthly retainers, or hourly consulting—tailored to your scope. We provide transparent quotes during consultation, no hidden costs.",
  },
  {
    question: "Is my financial data secure with OCX?",
    answer:
      "Yes. We use industry-standard security protocols and strict confidentiality agreements. Data protection is non-negotiable.",
  },
  {
    question: "How do I get started with OCX?",
    answer:
      "Getting started is easy! Simply fill out our contact form or reach out via email. We offer a free initial consultation where we discuss your business needs and challenges. From there, we'll propose a tailored solution and timeline that fits your objectives and budget.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 lg:py-32 bg-secondary/20 border-y border-border">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-foreground mb-4">
            Frequently Asked{" "}
            <span className="text-gradient-silver">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about working with OCX
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl bg-card border border-border overflow-hidden hover:border-foreground/20 transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/30 transition-colors"
              >
                <h3 className="font-display text-lg font-bold text-foreground pr-8">
                  {faq.question}
                </h3>
                <div className="shrink-0 w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-foreground" />
                  ) : (
                    <Plus className="w-4 h-4 text-foreground" />
                  )}
                </div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors"
          >
            Contact our team
            <span className="text-primary">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
