"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

interface CMSContent {
  global: Record<string, unknown>;
  home: Record<string, unknown>;
  about: { hero: { heading: string; label: string } };
  contact: { hero: { heading: string; label: string } };
}

const inputCls =
  "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:border-[#d98629] focus:outline-none transition-colors";

export default function AboutContentPage() {
  const [content, setContent] = useState<CMSContent | null>(null);
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

  function update(field: "heading" | "label", value: string) {
    if (!content) return;
    setDirty(true);
    setContent({
      ...content,
      about: { hero: { ...content.about.hero, [field]: value } },
    });
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
      if (res.ok) {
        toast.success("About page content saved");
        setDirty(false);
      } else {
        toast.error("Failed to save. Check authentication.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-8">
        <p className="text-slate-500 text-sm">Failed to load content. Make sure the CMS API is running.</p>
      </div>
    );
  }

  return (
    <div className="p-8 container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-1">Pages</p>
          <h1 className="text-slate-900 font-bold text-xl" style={{ fontFamily: "Satoshi, sans-serif" }}>
            About Page
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Edit content for the About page hero section.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#d98629" }}
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-1">
          <div className="w-1 h-4 rounded-full" style={{ background: "#d98629" }} />
          <p className="text-slate-900 font-semibold text-sm">Hero Section</p>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-1.5">
            Label
          </label>
          <input
            className={inputCls}
            value={content.about.hero.label}
            onChange={(e) => update("label", e.target.value)}
            placeholder="e.g. Our Story"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">
            Small label shown above the heading (e.g. "Our Story")
          </p>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-1.5">
            Hero Heading
          </label>
          <input
            className={inputCls}
            value={content.about.hero.heading}
            onChange={(e) => update("heading", e.target.value)}
            placeholder="e.g. About Movico"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">
            Main heading displayed in the page hero
          </p>
        </div>

        {/* Preview */}
        <div className="mt-2 p-5 bg-black rounded-xl border border-slate-200 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-2">Preview</p>
          <p
            className="text-[10px] uppercase tracking-[0.2em] mb-3"
            style={{ color: "#d98629" }}
          >
            {content.about.hero.label || "Label"}
          </p>
          <p className="text-slate-900 font-bold text-2xl" style={{ fontFamily: "Satoshi, sans-serif" }}>
            {content.about.hero.heading || "Heading"}
          </p>
        </div>
      </div>
    </div>
  );
}
