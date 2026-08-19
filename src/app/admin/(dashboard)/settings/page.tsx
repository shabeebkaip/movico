"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Save, Loader2, CheckCircle2, AlertCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { CMSContent } from "@/lib/cms/types";

const inputCls =
  "bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm w-full focus:border-[#d98629]/50 focus:outline-none placeholder:text-slate-400 transition-colors duration-150";

const textareaCls = `${inputCls} resize-none`;
const labelCls = "text-[10px] uppercase tracking-[0.12em] text-slate-400 mb-1.5 block";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>}
    </div>
  );
}

type SaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

export default function SettingsPage() {
  const [content, setContent] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/cms/content")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setContent(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (data: CMSContent) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/cms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
        toast.error("Failed to save");
      }
    } catch {
      setSaveStatus("error");
      toast.error("Network error");
    }
  }, []);

  function set(field: keyof CMSContent["global"], value: string) {
    if (!content) return;
    const next = { ...content, global: { ...content.global, [field]: value } };
    setContent(next);
    setSaveStatus("unsaved");
  }

  useEffect(() => {
    if (saveStatus !== "unsaved" || !content) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => save(content), 1500);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [content, saveStatus, save]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 size={20} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-400 text-sm">Failed to load settings.</p>
      </div>
    );
  }

  const g = content.global;

  const statusNode = (() => {
    if (saveStatus === "saved")
      return <span className="flex items-center gap-1.5 text-green-600 text-xs"><CheckCircle2 size={12} /> All saved</span>;
    if (saveStatus === "saving")
      return <span className="flex items-center gap-1.5 text-[#d98629] text-xs animate-pulse"><Loader2 size={12} className="animate-spin" /> Saving…</span>;
    if (saveStatus === "unsaved")
      return <span className="flex items-center gap-1.5 text-amber-500 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Unsaved</span>;
    if (saveStatus === "error")
      return <span className="flex items-center gap-1.5 text-red-500 text-xs"><AlertCircle size={12} /> Save failed</span>;
    return null;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="h-14 border-b border-slate-200 flex items-center px-4 gap-2 shrink-0 bg-white z-10">
        <div className="flex items-center flex-1 min-w-0">
          <span className="text-slate-900 text-xs font-semibold">Settings</span>
        </div>
        <div className="flex items-center gap-2">
          {statusNode}
          <button
            onClick={() => content && save(content)}
            disabled={saveStatus === "saving" || saveStatus === "saved" || saveStatus === "idle"}
            className="flex items-center gap-2 bg-[#d98629] hover:bg-[#c4771e] disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          >
            {saveStatus === "saving" ? <><Loader2 size={12} className="animate-spin" /> Saving…</>
              : saveStatus === "saved" ? <><CheckCircle2 size={12} /> Saved</>
              : <><Save size={12} /> Save Changes</>}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Site Identity</h3>
            <Field label="Site Name">
              <input className={inputCls} value={g.siteName} onChange={(e) => set("siteName", e.target.value)} placeholder="Movico" />
            </Field>
            <Field label="Tagline" hint="Shown in the footer brand column">
              <textarea className={textareaCls} rows={3} value={g.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Contact Details</h3>
            <p className="text-[11px] text-slate-400 -mt-2">Used site-wide in the footer and WhatsApp button.</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email">
                <input className={inputCls} type="email" value={g.email} onChange={(e) => set("email", e.target.value)} placeholder="info@movicoksa.com" />
              </Field>
              <Field label="Phone">
                <input className={inputCls} value={g.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+966 53 666 0125" />
              </Field>
              <Field label="WhatsApp Number">
                <input className={inputCls} value={g.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+966536660125" />
              </Field>
              <Field label="Address">
                <input className={inputCls} value={g.address} onChange={(e) => set("address", e.target.value)} placeholder="Wadi Laban, Riyadh, Saudi Arabia" />
              </Field>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-start gap-3">
            <Share2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Social Media Links</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Instagram, LinkedIn and YouTube URLs are managed under{" "}
                <Link href="/admin/content/contact" className="text-[#d98629] hover:underline">Content → Contact → Social Links</Link>.
                They power both the footer icons and the contact page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
