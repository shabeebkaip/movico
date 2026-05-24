"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight, CheckCircle, ChevronLeft } from "lucide-react";
import { MagneticText } from "@/components/ui/morphing-cursor";

interface ContactCMS {
  hero: { heading: string; label: string };
  info: { email: string; phone: string; location: string; hours: string; sideText: string };
  social: { instagram: string; linkedin: string; youtube: string };
  formspreeId: string;
}

const DEFAULT_CMS: ContactCMS = {
  hero: { heading: "Let's Work Together.", label: "Get In Touch" },
  info: {
    email: "info@movicoksa.com",
    phone: "+966 53 666 0125",
    location: "Wadi Laban, Riyadh, Saudi Arabia",
    hours: "Sun – Thu  ·  9:00 AM – 6:00 PM AST",
    sideText: "Go beyond typical with Movico. You're not just choosing a production company — you're selecting a partner who understands your brand and has a genuine interest in crafting meaningful, impactful cinematic stories.",
  },
  social: { instagram: "#", linkedin: "#", youtube: "#" },
  formspreeId: "",
};

const SERVICES = [
  { id: "brand-film",      label: "Brand Film",        emoji: "🎬", desc: "Cinematic brand stories" },
  { id: "event-coverage",  label: "Event Coverage",    emoji: "🎪", desc: "Live & corporate events" },
  { id: "corporate-video", label: "Corporate Video",   emoji: "🏢", desc: "Internal & promo content" },
  { id: "brand-identity",  label: "Brand Identity",    emoji: "🎨", desc: "Visual identity & design" },
  { id: "spatial-booth",   label: "Spatial & Booth",   emoji: "🏗️", desc: "Exhibitions & environments" },
  { id: "social-content",  label: "Social Content",    emoji: "📱", desc: "Digital & social media" },
  { id: "not-sure",        label: "Not Sure Yet",      emoji: "✨", desc: "Let's explore together" },
];

const BUDGETS = [
  { id: "under-20k",    label: "Under SAR 20K",           desc: "Starter projects" },
  { id: "20k-50k",      label: "SAR 20K – 50K",           desc: "Mid-size productions" },
  { id: "50k-150k",     label: "SAR 50K – 150K",          desc: "Full-scale campaigns" },
  { id: "150k-plus",    label: "SAR 150K+",                desc: "Enterprise & flagship" },
  { id: "lets-discuss", label: "Let's Discuss",            desc: "Custom scope" },
];

interface FormData {
  service: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const STEPS = ["Service", "Budget", "You", "Details"];

export default function ContactPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cms, setCms] = useState<ContactCMS>(DEFAULT_CMS);
  const [form, setForm] = useState<FormData>({
    service: "", budget: "", name: "", email: "", phone: "", company: "", message: "",
  });

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/cms/content")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.contact) setCms(data.contact); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    gsap.from(headingRef.current, { y: 70, opacity: 0, duration: 1.2, ease: "power3.out" });
    gsap.from(formRef.current,    { y: 50, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
    gsap.from(infoRef.current,    { y: 50, opacity: 0, duration: 1, delay: 0.35, ease: "power3.out" });
  }, []);

  function animateStep() {
    if (!stepRef.current) return;
    gsap.fromTo(stepRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
  }

  function next() {
    setStep((s) => { const n = s + 1; setTimeout(animateStep, 10); return n; });
  }
  function back() {
    setStep((s) => { const n = s - 1; setTimeout(animateStep, 10); return n; });
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.email.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/cms/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          company: form.company || undefined,
          service: SERVICES.find((s) => s.id === form.service)?.label ?? form.service,
          budget: BUDGETS.find((b) => b.id === form.budget)?.label ?? form.budget,
          message: form.message || undefined,
        }),
      });
    } catch {
      // still show success
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  const progressPct = ((step + 1) / (STEPS.length + 1)) * 100;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section ref={sectionRef} className="relative pt-36 pb-20 xl:pt-52 xl:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,134,41,0.07),transparent_55%)]" />
        <div className="relative w-11/12 xl:w-10/12 mx-auto">
          <div ref={headingRef}>
            <span className="uppercase tracking-[0.5em] text-[10px] text-white/30 block mb-6">
              {cms.hero.label}
            </span>
            <h1 className="font-display font-black text-5xl md:text-7xl xl:text-[8rem] uppercase leading-[0.9] mb-0 flex flex-col items-start gap-0">
              <MagneticText text="Let's Create" hoverText="Let's Create" className="text-white" circleClassName="bg-white" innerTextClassName="text-black" />
              <MagneticText text="Something." hoverText="Together." className="text-primary" circleClassName="bg-primary" innerTextClassName="text-white" />
            </h1>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-white/8" />

      {/* Form + Info */}
      <section className="py-20 xl:py-32">
        <div className="w-11/12 xl:w-10/12 mx-auto grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* Interactive Form */}
          <div ref={formRef}>
            {submitted ? (
              <div className="flex flex-col items-start py-16">
                <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-8">
                  <CheckCircle size={28} className="text-primary" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-3">Enquiry Received</p>
                <h3 className="font-display font-black text-4xl xl:text-5xl uppercase leading-tight mb-6">
                  We&apos;ll be in<br />
                  <span className="text-primary">touch soon.</span>
                </h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-8">
                  Our team will review your enquiry and get back to you within 24 hours. Looking forward to creating something remarkable together.
                </p>
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 w-full max-w-sm space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-1">Summary</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Service</span>
                    <span className="text-white">{SERVICES.find((s) => s.id === form.service)?.label}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Budget</span>
                    <span className="text-white">{BUDGETS.find((b) => b.id === form.budget)?.label}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Name</span>
                    <span className="text-white">{form.name}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Progress */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-3">
                    {STEPS.map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${i < step ? "bg-primary text-black" : i === step ? "bg-primary/20 text-primary border border-primary/50" : "bg-white/5 text-white/20"}`}>
                          {i < step ? "✓" : i + 1}
                        </div>
                        <span className={`text-xs hidden md:block transition-colors duration-300 ${i === step ? "text-white/70" : "text-white/20"}`}>{s}</span>
                        {i < STEPS.length - 1 && <div className="w-8 md:w-16 h-px bg-white/10 ml-2" />}
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-white/8 relative overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-primary transition-all duration-500 ease-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Step content */}
                <div ref={stepRef}>
                  {/* Step 0 — Service */}
                  {step === 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-3">Step 1 of 4</p>
                      <h2 className="font-display font-black text-3xl xl:text-4xl uppercase leading-tight mb-2">
                        What are you<br /><span className="text-primary">looking to create?</span>
                      </h2>
                      <p className="text-white/40 text-sm mb-8">Select the service that best fits your project.</p>
                      <div className="grid grid-cols-2 gap-3">
                        {SERVICES.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => { setForm((f) => ({ ...f, service: s.id })); setTimeout(next, 200); }}
                            className={`group relative text-left p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                              form.service === s.id
                                ? "bg-primary/15 border-primary text-white"
                                : "bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]"
                            }`}
                          >
                            <span className="text-2xl mb-2 block">{s.emoji}</span>
                            <p className="font-bold text-sm text-white leading-tight">{s.label}</p>
                            <p className="text-[11px] text-white/40 mt-0.5">{s.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 1 — Budget */}
                  {step === 1 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-3">Step 2 of 4</p>
                      <h2 className="font-display font-black text-3xl xl:text-4xl uppercase leading-tight mb-2">
                        What&apos;s your<br /><span className="text-primary">approximate budget?</span>
                      </h2>
                      <p className="text-white/40 text-sm mb-8">This helps us tailor the right solution for you.</p>
                      <div className="space-y-3">
                        {BUDGETS.map((b) => (
                          <button
                            key={b.id}
                            onClick={() => { setForm((f) => ({ ...f, budget: b.id })); setTimeout(next, 200); }}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                              form.budget === b.id
                                ? "bg-primary/15 border-primary"
                                : "bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]"
                            }`}
                          >
                            <div className="text-left">
                              <p className="font-bold text-sm text-white">{b.label}</p>
                              <p className="text-[11px] text-white/40 mt-0.5">{b.desc}</p>
                            </div>
                            <ArrowRight size={14} className="text-white/20" />
                          </button>
                        ))}
                      </div>
                      <button onClick={back} className="mt-6 flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors">
                        <ChevronLeft size={13} /> Back
                      </button>
                    </div>
                  )}

                  {/* Step 2 — Contact details */}
                  {step === 2 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-3">Step 3 of 4</p>
                      <h2 className="font-display font-black text-3xl xl:text-4xl uppercase leading-tight mb-2">
                        Tell us<br /><span className="text-primary">who you are.</span>
                      </h2>
                      <p className="text-white/40 text-sm mb-8">We&apos;ll use these details to reach back to you.</p>
                      <div className="space-y-6">
                        <div className="border-b border-white/15 pb-3 focus-within:border-primary transition-colors duration-300">
                          <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-2">Full Name *</label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. Ahmed Al-Rashid"
                            className="w-full bg-transparent text-white text-sm placeholder:text-white/20 outline-none"
                            autoFocus
                          />
                        </div>
                        <div className="border-b border-white/15 pb-3 focus-within:border-primary transition-colors duration-300">
                          <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-2">Email Address *</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            placeholder="you@company.com"
                            className="w-full bg-transparent text-white text-sm placeholder:text-white/20 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="border-b border-white/15 pb-3 focus-within:border-primary transition-colors duration-300">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-2">Phone / WhatsApp</label>
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                              placeholder="+966 5X XXX XXXX"
                              className="w-full bg-transparent text-white text-sm placeholder:text-white/20 outline-none"
                            />
                          </div>
                          <div className="border-b border-white/15 pb-3 focus-within:border-primary transition-colors duration-300">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-2">Company / Brand</label>
                            <input
                              type="text"
                              value={form.company}
                              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                              placeholder="Your company name"
                              className="w-full bg-transparent text-white text-sm placeholder:text-white/20 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 flex items-center gap-4">
                        <button
                          onClick={next}
                          disabled={!form.name.trim() || !form.email.trim()}
                          className="bg-primary text-black text-xs font-bold uppercase tracking-[0.25em] px-10 py-4 rounded-full hover:bg-white transition-all duration-300 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Continue <ArrowRight size={13} />
                        </button>
                        <button onClick={back} className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors">
                          <ChevronLeft size={13} /> Back
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 — Message + submit */}
                  {step === 3 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-3">Step 4 of 4</p>
                      <h2 className="font-display font-black text-3xl xl:text-4xl uppercase leading-tight mb-2">
                        Anything<br /><span className="text-primary">else to share?</span>
                      </h2>
                      <p className="text-white/40 text-sm mb-8">Optional — give us a brief about your vision, timeline, or any specifics.</p>

                      {/* Summary pill */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {[
                          SERVICES.find((s) => s.id === form.service)?.label,
                          BUDGETS.find((b) => b.id === form.budget)?.label,
                        ].filter(Boolean).map((label) => (
                          <span key={label} className="bg-primary/15 text-primary text-xs px-3 py-1.5 rounded-full border border-primary/25 font-medium">
                            {label}
                          </span>
                        ))}
                      </div>

                      <div className="border-b border-white/15 pb-3 focus-within:border-primary transition-colors duration-300 mb-8">
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                          placeholder="Tell us about your project, timeline, goals…"
                          rows={5}
                          className="w-full bg-transparent text-white text-sm placeholder:text-white/20 outline-none resize-none"
                          autoFocus
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="bg-primary text-black text-xs font-bold uppercase tracking-[0.25em] px-12 py-4 rounded-full hover:bg-white transition-all duration-300 flex items-center gap-2 disabled:opacity-60"
                        >
                          {loading ? "Sending…" : <><span>Send Enquiry</span> <ArrowRight size={13} /></>}
                        </button>
                        <button onClick={back} className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors">
                          <ChevronLeft size={13} /> Back
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div ref={infoRef} className="xl:pl-8 space-y-12">
            <p className="text-white/50 text-lg leading-relaxed">{cms.info.sideText}</p>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-2">Email</p>
                <a href={`mailto:${cms.info.email}`} className="text-white hover:text-primary transition-colors duration-300">{cms.info.email}</a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-2">Phone / WhatsApp</p>
                <a href={`tel:${cms.info.phone.replace(/\s/g, "")}`} className="text-white hover:text-primary transition-colors duration-300">{cms.info.phone}</a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-2">Location</p>
                <p className="text-white">{cms.info.location}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-2">Business Hours</p>
                <p className="text-white/60 text-sm">{cms.info.hours}</p>
              </div>
            </div>

            {(cms.social.instagram !== "#" || cms.social.linkedin !== "#" || cms.social.youtube !== "#") && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4">Follow Us</p>
                <div className="flex gap-6 text-sm uppercase tracking-[0.2em] text-white/50">
                  {cms.social.instagram && cms.social.instagram !== "#" && (
                    <a href={cms.social.instagram} className="hover:text-primary transition-colors duration-300">Instagram</a>
                  )}
                  {cms.social.linkedin && cms.social.linkedin !== "#" && (
                    <a href={cms.social.linkedin} className="hover:text-primary transition-colors duration-300">LinkedIn</a>
                  )}
                  {cms.social.youtube && cms.social.youtube !== "#" && (
                    <a href={cms.social.youtube} className="hover:text-primary transition-colors duration-300">YouTube</a>
                  )}
                </div>
              </div>
            )}

            <div className="border border-white/10 rounded-2xl p-6 inline-block">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">Client Satisfaction</p>
              <p className="font-display font-black text-5xl text-primary">98<span className="text-2xl">%</span></p>
              <p className="text-white/40 text-xs mt-1">Would recommend us</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
