"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Info,
  Share2,
  Settings2,
  PanelRight,
  PanelRightClose,
  PanelLeft,
  PanelLeftClose,
  type LucideIcon,
} from "lucide-react";
import { ScaledPreviewPane } from "@/components/cms/ScaledPreviewPane";
import { useAdminLayout } from "@/contexts/AdminLayoutContext";

interface ContactCMS {
  contact: {
    hero: { heading: string; label: string };
    info: { email: string; phone: string; location: string; hours: string; sideText: string };
    social: { instagram: string; linkedin: string; youtube: string };
    formspreeId: string;
  };
}

type SectionId = "hero" | "info" | "social" | "form";

const sectionDefs: { id: SectionId; label: string; description: string; Icon: LucideIcon }[] = [
  { id: "hero",   label: "Hero",            description: "Heading & label",     Icon: Info     },
  { id: "info",   label: "Contact Info",    description: "Email, phone, hours", Icon: Phone    },
  { id: "social", label: "Social Links",    description: "Instagram, LinkedIn", Icon: Share2   },
  { id: "form",   label: "Form Settings",  description: "Formspree endpoint",  Icon: Settings2 },
];

const inputCls =
  "bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm w-full focus:border-[#d98629]/50 focus:outline-none placeholder:text-slate-400 transition-colors duration-150";

const textareaCls =
  "bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm w-full focus:border-[#d98629]/50 focus:outline-none placeholder:text-slate-400 transition-colors duration-150 resize-none";

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

// ─── Section editors ──────────────────────────────────────────────────────────

function HeroEditor({ data, set }: { data: ContactCMS["contact"]["hero"]; set: (path: string[], v: string) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Label" hint='Small label above the heading (e.g. "Get In Touch")'>
        <input
          className={inputCls}
          value={data.label}
          onChange={(e) => set(["contact", "hero", "label"], e.target.value)}
          placeholder="e.g. Get In Touch"
        />
      </Field>
      <Field label="Hero Heading" hint="Main heading on the contact page">
        <input
          className={inputCls}
          value={data.heading}
          onChange={(e) => set(["contact", "hero", "heading"], e.target.value)}
          placeholder="e.g. Let's Work Together."
        />
      </Field>
    </div>
  );
}

function InfoEditor({ data, set }: { data: ContactCMS["contact"]["info"]; set: (path: string[], v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email">
          <input
            className={inputCls}
            type="email"
            value={data.email}
            onChange={(e) => set(["contact", "info", "email"], e.target.value)}
            placeholder="info@movicoksa.com"
          />
        </Field>
        <Field label="Phone / WhatsApp">
          <input
            className={inputCls}
            value={data.phone}
            onChange={(e) => set(["contact", "info", "phone"], e.target.value)}
            placeholder="+966 53 666 0125"
          />
        </Field>
        <Field label="Location">
          <input
            className={inputCls}
            value={data.location}
            onChange={(e) => set(["contact", "info", "location"], e.target.value)}
            placeholder="Wadi Laban, Riyadh, Saudi Arabia"
          />
        </Field>
        <Field label="Business Hours">
          <input
            className={inputCls}
            value={data.hours}
            onChange={(e) => set(["contact", "info", "hours"], e.target.value)}
            placeholder="Sun – Thu · 9:00 AM – 6:00 PM AST"
          />
        </Field>
      </div>
      <Field label="Side Text" hint="Paragraph shown beside the form">
        <textarea
          className={textareaCls}
          rows={5}
          value={data.sideText}
          onChange={(e) => set(["contact", "info", "sideText"], e.target.value)}
        />
      </Field>
    </div>
  );
}

function SocialEditor({ data, set }: { data: ContactCMS["contact"]["social"]; set: (path: string[], v: string) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Instagram URL">
        <input
          className={inputCls}
          value={data.instagram}
          onChange={(e) => set(["contact", "social", "instagram"], e.target.value)}
          placeholder="https://instagram.com/..."
        />
      </Field>
      <Field label="LinkedIn URL">
        <input
          className={inputCls}
          value={data.linkedin}
          onChange={(e) => set(["contact", "social", "linkedin"], e.target.value)}
          placeholder="https://linkedin.com/..."
        />
      </Field>
      <Field label="YouTube URL">
        <input
          className={inputCls}
          value={data.youtube}
          onChange={(e) => set(["contact", "social", "youtube"], e.target.value)}
          placeholder="https://youtube.com/..."
        />
      </Field>
    </div>
  );
}

function FormEditor({ value, set }: { value: string; set: (path: string[], v: string) => void }) {
  return (
    <div className="space-y-4">
      <Field
        label="Formspree Endpoint ID"
        hint='The ID from your Formspree form URL (e.g. "xabcdef" from formspree.io/f/xabcdef)'
      >
        <input
          className={inputCls}
          value={value}
          onChange={(e) => set(["contact", "formspreeId"], e.target.value)}
          placeholder="xabcdef"
        />
      </Field>
      {value ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 flex items-center gap-2">
          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-emerald-700">Endpoint active</p>
            <p className="text-[11px] text-emerald-600 font-mono mt-0.5">formspree.io/f/{value}</p>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
          <AlertCircle size={13} className="text-red-400 shrink-0" />
          <p className="text-xs text-red-600">No endpoint ID — contact form will not submit</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type SaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

export default function ContactContentPage() {
  const { sidebarOpen, toggleSidebar } = useAdminLayout();
  const [content, setContent] = useState<ContactCMS | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [unsavedCount, setUnsavedCount] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [sectionNavExpanded, setSectionNavExpanded] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/cms/content")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setContent(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const refreshPreview = useCallback(() => {
    if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
  }, []);

  const save = useCallback(async (data: ContactCMS) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/cms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaveStatus("saved");
        setUnsavedCount(0);
        refreshPreview();
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
        toast.error("Failed to save");
      }
    } catch {
      setSaveStatus("error");
      toast.error("Network error");
    }
  }, [refreshPreview]);

  function set(path: string[], value: string) {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContactCMS;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cur: any = next;
    for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
    cur[path[path.length - 1]] = value;
    setContent(next);
    setSaveStatus("unsaved");
    setUnsavedCount((c) => c + 1);
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
        <p className="text-slate-400 text-sm">Failed to load content.</p>
      </div>
    );
  }

  const c = content.contact;

  const statusNode = (() => {
    if (saveStatus === "saved")
      return <span className="flex items-center gap-1.5 text-green-600 text-xs"><CheckCircle2 size={12} /> All saved</span>;
    if (saveStatus === "saving")
      return <span className="flex items-center gap-1.5 text-[#d98629] text-xs animate-pulse"><Loader2 size={12} className="animate-spin" /> Saving…</span>;
    if (saveStatus === "unsaved")
      return <span className="flex items-center gap-1.5 text-amber-500 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Unsaved ({unsavedCount})</span>;
    if (saveStatus === "error")
      return <span className="flex items-center gap-1.5 text-red-500 text-xs"><AlertCircle size={12} /> Save failed</span>;
    return null;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Bar */}
      <header className="h-14 border-b border-slate-200 flex items-center px-4 gap-2 shrink-0 bg-white z-10">
        <div className="flex items-center flex-1 min-w-0">
          <span className="text-slate-400 text-xs">Pages /</span>
          <span className="text-slate-900 text-xs font-semibold ml-1">Contact</span>
        </div>
        <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1">
          <button onClick={toggleSidebar} title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className={`p-1.5 rounded-md transition-all ${sidebarOpen ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"}`}>
            {sidebarOpen ? <PanelLeftClose size={13} /> : <PanelLeft size={13} />}
          </button>
          <button onClick={() => setSectionNavExpanded((v) => !v)} title={sectionNavExpanded ? "Collapse section nav" : "Expand section nav"}
            className={`p-1.5 rounded-md transition-all ${sectionNavExpanded ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"}`}>
            {sectionNavExpanded ? <PanelLeftClose size={13} /> : <PanelLeft size={13} />}
          </button>
          <button onClick={() => setShowPreview((v) => !v)} title={showPreview ? "Hide preview" : "Show preview"}
            className={`p-1.5 rounded-md transition-all ${showPreview ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"}`}>
            {showPreview ? <PanelRightClose size={13} /> : <PanelRight size={13} />}
          </button>
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
        <a href="/contact" target="_blank" rel="noreferrer"
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs border border-slate-200 px-3 py-1.5 rounded-lg hover:border-slate-300 transition-all">
          ↗ View Page
        </a>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {sectionNavExpanded ? (
          <nav className="w-44 shrink-0 border-r border-slate-200 overflow-y-auto bg-slate-50 py-3">
            {sectionDefs.map(({ id, label, description, Icon }) => {
              const isActive = activeSection === id;
              return (
                <button key={id} onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 border-l-2 ${
                    isActive ? "bg-[#d98629]/10 border-[#d98629] text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium leading-tight">{label}</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">{description}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        ) : (
          <nav className="w-10 shrink-0 border-r border-slate-200 overflow-y-auto bg-slate-50 py-3 flex flex-col items-center gap-0.5">
            {sectionDefs.map(({ id, label, Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  title={label}
                  className={`group relative w-full flex items-center justify-center py-2.5 transition-all border-l-2 ${
                    isActive
                      ? "border-[#d98629] bg-[#d98629]/10 text-[#d98629]"
                      : "border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={14} />
                  <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap bg-slate-800 text-white text-[11px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        <div className={`${showPreview ? "w-[400px] shrink-0" : "flex-1"} overflow-y-auto p-6 border-r border-slate-200 bg-slate-50`}>
          <div className="mb-6">
            <h2 className="text-slate-900 font-semibold text-base">{sectionDefs.find((s) => s.id === activeSection)?.label}</h2>
            <p className="text-slate-400 text-xs mt-0.5">{sectionDefs.find((s) => s.id === activeSection)?.description}</p>
          </div>
          {activeSection === "hero"   && <HeroEditor   data={c.hero}   set={set} />}
          {activeSection === "info"   && <InfoEditor   data={c.info}   set={set} />}
          {activeSection === "social" && <SocialEditor data={c.social} set={set} />}
          {activeSection === "form"   && <FormEditor   value={c.formspreeId} set={set} />}
        </div>

        {showPreview && (
          <ScaledPreviewPane src="/contact" iframeRef={iframeRef} onRefresh={refreshPreview} />
        )}
      </div>
    </div>
  );
}
