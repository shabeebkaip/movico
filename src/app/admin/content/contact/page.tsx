"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

interface ContactCMS {
  contact: {
    hero: { heading: string; label: string };
    info: { email: string; phone: string; location: string; hours: string; sideText: string };
    social: { instagram: string; linkedin: string; youtube: string };
    formspreeId: string;
  };
}

const inputCls =
  "w-full bg-[#1a1a1a] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-[#d98629] focus:outline-none transition-colors";

const textareaCls =
  "w-full bg-[#1a1a1a] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-[#d98629] focus:outline-none transition-colors resize-none";

function SectionCard({ accent = "#d98629", title, children }: { accent?: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
        <div className="w-1 h-4 rounded-full" style={{ background: accent }} />
        <p className="text-white font-semibold text-sm">{title}</p>
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-white/20 mt-1.5">{hint}</p>}
    </div>
  );
}

export default function ContactContentPage() {
  const [content, setContent] = useState<ContactCMS | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/cms/content")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setContent(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function set(path: string[], value: string) {
    if (!content) return;
    setDirty(true);
    const next = JSON.parse(JSON.stringify(content)) as ContactCMS;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cur: any = next;
    for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
    cur[path[path.length - 1]] = value;
    setContent(next);
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/cms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) { toast.success("Contact page saved"); setDirty(false); }
      else toast.error("Failed to save");
    } catch { toast.error("Network error"); }
    finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-white/30" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-8">
        <p className="text-white/40 text-sm">Failed to load content.</p>
      </div>
    );
  }

  const c = content.contact;

  return (
    <div className="p-8 container mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 mb-1">Pages</p>
          <h1 className="text-white font-bold text-xl" style={{ fontFamily: "Satoshi, sans-serif" }}>
            Contact Page
          </h1>
          <p className="text-white/40 text-xs mt-0.5">Edit hero, contact info, and social links.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#d98629" }}
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Hero */}
        <SectionCard title="Hero Section">
          <Field label="Label" hint='Small label above the heading (e.g. "Get In Touch")'>
            <input
              className={inputCls}
              value={c.hero.label}
              onChange={(e) => set(["contact", "hero", "label"], e.target.value)}
              placeholder="e.g. Get In Touch"
            />
          </Field>
          <Field label="Hero Heading" hint="Main heading on the contact page">
            <input
              className={inputCls}
              value={c.hero.heading}
              onChange={(e) => set(["contact", "hero", "heading"], e.target.value)}
              placeholder="e.g. Let's Work Together."
            />
          </Field>

          {/* Preview */}
          <div className="mt-2 p-5 bg-black rounded-xl border border-white/[0.04] text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 mb-2">Preview</p>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: "#d98629" }}>
              {c.hero.label || "Label"}
            </p>
            <p className="text-white font-bold text-2xl" style={{ fontFamily: "Satoshi, sans-serif" }}>
              {c.hero.heading || "Heading"}
            </p>
          </div>
        </SectionCard>

        {/* Contact Info */}
        <SectionCard title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Email">
              <input
                className={inputCls}
                type="email"
                value={c.info.email}
                onChange={(e) => set(["contact", "info", "email"], e.target.value)}
                placeholder="info@movicoksa.com"
              />
            </Field>
            <Field label="Phone / WhatsApp">
              <input
                className={inputCls}
                value={c.info.phone}
                onChange={(e) => set(["contact", "info", "phone"], e.target.value)}
                placeholder="+966 53 666 0125"
              />
            </Field>
            <Field label="Location">
              <input
                className={inputCls}
                value={c.info.location}
                onChange={(e) => set(["contact", "info", "location"], e.target.value)}
                placeholder="Wadi Laban, Riyadh, Saudi Arabia"
              />
            </Field>
            <Field label="Business Hours">
              <input
                className={inputCls}
                value={c.info.hours}
                onChange={(e) => set(["contact", "info", "hours"], e.target.value)}
                placeholder="Sun – Thu · 9:00 AM – 6:00 PM AST"
              />
            </Field>
          </div>
          <Field label="Side Text" hint="Paragraph shown beside the form">
            <textarea
              className={textareaCls}
              rows={4}
              value={c.info.sideText}
              onChange={(e) => set(["contact", "info", "sideText"], e.target.value)}
            />
          </Field>
        </SectionCard>

        {/* Social Links */}
        <SectionCard title="Social Links" accent="#7c3aed">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Instagram URL">
              <input
                className={inputCls}
                value={c.social.instagram}
                onChange={(e) => set(["contact", "social", "instagram"], e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </Field>
            <Field label="LinkedIn URL">
              <input
                className={inputCls}
                value={c.social.linkedin}
                onChange={(e) => set(["contact", "social", "linkedin"], e.target.value)}
                placeholder="https://linkedin.com/..."
              />
            </Field>
            <Field label="YouTube URL">
              <input
                className={inputCls}
                value={c.social.youtube}
                onChange={(e) => set(["contact", "social", "youtube"], e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </Field>
          </div>
        </SectionCard>

        {/* Form settings */}
        <SectionCard title="Form Settings" accent="#0ea5e9">
          <Field label="Formspree Endpoint ID" hint='The ID part of your Formspree form URL (e.g. "xabcdef" from formspree.io/f/xabcdef)'>
            <input
              className={inputCls}
              value={c.formspreeId}
              onChange={(e) => set(["contact", "formspreeId"], e.target.value)}
              placeholder="xabcdef"
            />
          </Field>
        </SectionCard>
      </div>
    </div>
  );
}
