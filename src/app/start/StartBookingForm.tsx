"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { SERVICES } from "@/lib/services-data";

export default function StartBookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await fetch("https://formspree.io/f/movico-start", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle size={48} className="text-primary mb-6" />
        <h3 className="font-display font-black text-2xl uppercase text-white mb-3">
          Request Received
        </h3>
        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
          We&apos;ll be in touch within 24 hours to schedule your discovery call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
          />
        </div>
        <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
          />
        </div>
      </div>

      <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
        <input
          type="tel"
          name="phone"
          placeholder="Phone / WhatsApp"
          className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
        />
      </div>

      <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
        <input
          type="text"
          name="company"
          placeholder="Company / Brand"
          className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
        />
      </div>

      <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
        <select
          name="service"
          className="w-full bg-transparent text-white/60 text-sm outline-none cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled className="bg-black text-white/60">
            Service of Interest
          </option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.slug} className="bg-black text-white">
              {s.title}
            </option>
          ))}
          <option value="not-sure" className="bg-black text-white">
            Not Sure Yet
          </option>
        </select>
      </div>

      <div className="border-b border-white/20 pb-3 focus-within:border-primary transition-colors duration-300">
        <textarea
          name="message"
          placeholder="Tell us briefly about your project..."
          rows={4}
          className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white text-xs font-bold uppercase tracking-[0.25em] py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? "Sending..." : <>Book Discovery Call <ArrowRight size={14} /></>}
      </button>
    </form>
  );
}
