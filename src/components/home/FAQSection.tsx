"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "What types of productions does Movico specialise in?",
    answer:
      "We specialise in high-impact commercials, branded films, large-scale event productions, spatial and booth design, interior visualisation, and social/digital campaigns. Each project is built around cinematic quality and strategic intent.",
  },
  {
    question: "Where is Movico based and do you work internationally?",
    answer:
      "We are headquartered in Riyadh, Saudi Arabia, and operate across the GCC and internationally. Our portfolio includes landmark productions for World Defense Show, Leap Conference, Neom, and Ford Al Jazirah.",
  },
  {
    question: "How do I start a production with Movico?",
    answer:
      "Fill out our enquiry form or contact us directly. We schedule a discovery session to understand your objectives, audience, and timeline — then propose a tailored production plan with a transparent quote.",
  },
  {
    question: "How long does a typical production take?",
    answer:
      "Timelines vary by scope. A corporate film typically takes 4–8 weeks from brief to delivery. Full event productions are planned 8–16 weeks in advance. We always build in time for revisions and quality control.",
  },
  {
    question: "What is your pricing structure?",
    answer:
      "Every production is scoped individually. We offer transparent project-based quotes after a brief consultation. There are no hidden costs — what's quoted is what's invoiced.",
  },
  {
    question: "Can Movico handle both creative direction and full execution?",
    answer:
      "Yes. From concepting and scripting to on-set production, post-production, and final delivery — we handle the complete pipeline. You deal with one team, one point of contact, from start to finish.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-11/12 xl:w-10/12 mx-auto grid grid-cols-1 md:grid-cols-2 pb-20 pt-16 gap-y-8 gap-x-16">
      {/* Heading column */}
      <div className="flex flex-col justify-center space-y-3">
        <motion.h5
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl xl:text-6xl font-black uppercase text-center md:text-left"
        >
          Frequently Asked{" "}
          <span style={{ color: "#d98629" }}>Questions?</span>
        </motion.h5>
      </div>

      {/* Accordion column */}
      <div>
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07, duration: 0.6 }}
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="flex justify-between items-center w-full p-4 cursor-pointer transition duration-200 ease-in-out border-b border-gray-200 text-left"
            >
              <span className="text-sm md:text-base text-black pr-6">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0"
              >
                <Plus className="w-4 h-4 text-black" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-4 py-4 text-sm text-gray-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
