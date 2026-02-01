"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";

import Hero from "@/components/contact/Hero";
import GetInTouch from "@/components/contact/GetInTouch";
import ContactInformation from "@/components/contact/ContactInformation";
import WhatHappensNext from "@/components/contact/WhatHappensNext";
import ContactForm from "@/components/contact/ContactForm";
import CommonEnquiries from "@/components/contact/CommonEnquiries";
import CTASection from "@/components/contact/CTASection";

const contactInfo = [
  // {
  //   icon: Phone,
  //   title: "Phone",
  //   details: [
  //     { label: "UAE", value: "+971 52 223 5795", href: "tel:+971522235795" },
  //     { label: "KSA", value: "+966 53 226 4851", href: "tel:+966532264851" },
  //   ],
  // },
  {
    icon: Mail,
    title: "Email",
    details: [
      {
        label: "General Inquiries",
        value: "info@ocxexperts.com",
        href: "mailto:info@ocxexperts.com",
      },
    ],
  },
  {
    icon: MapPin,
    title: "Office Locations",
    details: [
      { label: "United Arab Emirates", value: "Dubai, UAE" },
      { label: "Saudi Arabia", value: "Riyadh, KSA" },
    ],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: [
      {
        label: "Sunday - Thursday",
        value: "9:00 AM - 6:00 PM GST",
      },
      {
        label: "Response Time",
        value: "Within 24 hours",
      },
    ],
  },
];

const processSteps = [
  {
    number: "01",
    title: "Reach Out",
    description:
      "Contact us via phone, email, or the form below. Share a bit about your business and what you're looking to achieve.",
  },
  {
    number: "02",
    title: "Initial Consultation",
    description:
      "We'll schedule a conversation to understand your needs, challenges, and goals in detail.",
  },
  {
    number: "03",
    title: "Tailored Proposal",
    description:
      "Receive a customized solution designed specifically for your situation, with clear deliverables and timelines.",
  },
  {
    number: "04",
    title: "Partnership Begins",
    description:
      "Once aligned, we hit the ground running—delivering the expertise and results you need to succeed.",
  },
];

export default function Page() {
  const heroRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const inquiriesRef = useRef<HTMLElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const infoInView = useInView(infoRef, { once: true, margin: "-100px" });
  const processInView = useInView(processRef, { once: true, margin: "-100px" });
  const formInView = useInView(formRef, { once: true, margin: "-100px" });
  const inquiriesInView = useInView(inquiriesRef, {
    once: true,
    margin: "-100px",
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero heroRef={heroRef} heroInView={heroInView} />

      {/* Get in Touch Section */}
      <GetInTouch />

      {/* Contact Information Grid */}
      <ContactInformation
        infoRef={infoRef}
        infoInView={infoInView}
        contactInfo={contactInfo}
      />

      {/* What Happens Next Section */}
      <WhatHappensNext
        processRef={processRef}
        processInView={processInView}
        processSteps={processSteps}
      />

      {/* Contact Form Section */}
      <ContactForm formRef={formRef} formInView={formInView} />

      {/* Common Inquiries Section */}
      <CommonEnquiries
        inquiriesRef={inquiriesRef}
        inquiriesInView={inquiriesInView}
      />

      {/* Final CTA Section */}
      <CTASection />
    </main>
  );
}
