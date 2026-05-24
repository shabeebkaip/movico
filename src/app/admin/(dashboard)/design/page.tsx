"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import {
  Loader2,
  Save,
  Eye,
  Palette,
  Type,
  Layout,
  Layers,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CMSDesign {
  colors: { primary: string; primaryDark: string };
  typography: { headingScale: number; bodyScale: number };
  spacing: { sectionPadding: "compact" | "default" | "spacious" };
  layout: {
    servicesColumns: 2 | 3 | 4;
    heroStyle: "fullscreen" | "split";
    testimonialsLayout: "columns" | "carousel" | "grid";
    processLayout: "horizontal" | "vertical";
  };
  sections: {
    home: {
      hero: boolean;
      marquee: boolean;
      clients: boolean;
      about: boolean;
      workShowcase: boolean;
      services: boolean;
      studioPromo: boolean;
      showreel: boolean;
      caseStudy: boolean;
      process: boolean;
      testimonials: boolean;
      insights: boolean;
      faq: boolean;
      cta: boolean;
    };
  };
  animations: { enabled: boolean };
  sceneDividers: { enabled: boolean };
}

const defaultDesign: CMSDesign = {
  colors: { primary: "#d98629", primaryDark: "#b8711e" },
  typography: { headingScale: 1.0, bodyScale: 1.0 },
  spacing: { sectionPadding: "default" },
  layout: {
    servicesColumns: 3,
    heroStyle: "fullscreen",
    testimonialsLayout: "columns",
    processLayout: "horizontal",
  },
  sections: {
    home: {
      hero: true,
      marquee: true,
      clients: true,
      about: true,
      workShowcase: true,
      services: true,
      studioPromo: true,
      showreel: true,
      caseStudy: true,
      process: true,
      testimonials: true,
      insights: true,
      faq: true,
      cta: true,
    },
  },
  animations: { enabled: true },
  sceneDividers: { enabled: true },
};

const homeSections: { key: keyof CMSDesign["sections"]["home"]; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "marquee", label: "Marquee Ticker" },
  { key: "clients", label: "Clients" },
  { key: "about", label: "About" },
  { key: "workShowcase", label: "Work Showcase" },
  { key: "services", label: "Services" },
  { key: "studioPromo", label: "Studio Promo" },
  { key: "showreel", label: "Showreel" },
  { key: "caseStudy", label: "Case Study" },
  { key: "process", label: "Process" },
  { key: "testimonials", label: "Testimonials" },
  { key: "insights", label: "Insights" },
  { key: "faq", label: "FAQ" },
  { key: "cta", label: "CTA" },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

function ControlCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200">
        <Icon size={14} className="text-slate-500" />
        <span className="text-slate-900 font-semibold text-sm">{title}</span>
      </div>
      <div className="px-5 py-5 space-y-5">{children}</div>
    </div>
  );
}

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 text-xs py-1.5 rounded-md transition-all duration-150 font-medium ${
            value === opt.value
              ? "bg-[#d98629] text-black"
              : "text-slate-500 hover:text-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Save status indicator ─────────────────────────────────────────────────────

type SaveStatus = "idle" | "saving" | "saved" | "error";

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  if (status === "saved")
    return (
      <span className="flex items-center gap-1.5 text-green-400 text-xs">
        <CheckCircle2 size={12} /> All saved
      </span>
    );
  if (status === "saving")
    return (
      <span className="flex items-center gap-1.5 text-[#d98629] text-xs animate-pulse">
        <Loader2 size={12} className="animate-spin" /> Saving…
      </span>
    );
  if (status === "error")
    return (
      <span className="flex items-center gap-1.5 text-red-400 text-xs">
        <AlertCircle size={12} /> Save failed
      </span>
    );
  return null;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DesignPage() {
  const [design, setDesign] = useState<CMSDesign>(defaultDesign);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch("/api/cms/design")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setDesign(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function set<T>(path: string[], value: T) {
    setDesign((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as CMSDesign;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let cursor: any = next;
      for (let i = 0; i < path.length - 1; i++) cursor = cursor[path[i]];
      cursor[path[path.length - 1]] = value;
      return next;
    });
  }

  const refreshPreview = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }, []);

  async function handleApply() {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/cms/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(design),
      });
      if (res.ok) {
        toast.success("Design settings applied successfully");
        setSaveStatus("saved");
        refreshPreview();
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        toast.error("Failed to save design settings.");
        setSaveStatus("error");
      }
    } catch {
      toast.error("Network error. Please try again.");
      setSaveStatus("error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Bar */}
      <header className="h-14 border-b border-slate-200 flex items-center px-6 justify-between shrink-0 bg-slate-50 z-10">
        <div className="flex items-center">
          <span className="text-slate-400 text-xs">Pages /</span>
          <span className="text-slate-900 text-xs font-semibold ml-1">Design</span>
        </div>
        <SaveStatusIndicator status={saveStatus} />
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-slate-500 hover:text-white text-xs border border-slate-200 px-3 py-1.5 rounded-lg hover:border-slate-300 transition-all"
          >
            ↗ View Site
          </a>
          <button
            onClick={handleApply}
            disabled={saveStatus === "saving"}
            className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            style={{ background: "#d98629" }}
          >
            {saveStatus === "saving" ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Save size={12} />
            )}
            {saveStatus === "saving" ? "Applying…" : "Apply Design"}
          </button>
        </div>
      </header>

      {/* Body — two-column split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left — Controls (scrollable) */}
        <div className="w-[380px] shrink-0 border-r border-slate-200 overflow-y-auto p-6 space-y-4 bg-slate-50">

          {/* Brand Colors */}
          <ControlCard icon={Palette} title="Brand Colors">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={design.colors.primary}
                    onChange={(e) => set(["colors", "primary"], e.target.value)}
                    className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent p-0.5"
                    style={{ background: design.colors.primary }}
                  />
                </div>
                <input
                  className="flex-1 bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:border-[#d98629] focus:outline-none transition-colors font-mono uppercase"
                  value={design.colors.primary}
                  onChange={(e) => set(["colors", "primary"], e.target.value)}
                  maxLength={7}
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-2">
                Primary Dark
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={design.colors.primaryDark}
                  onChange={(e) => set(["colors", "primaryDark"], e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer p-0.5"
                  style={{ background: design.colors.primaryDark }}
                />
                <input
                  className="flex-1 bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:border-[#d98629] focus:outline-none transition-colors font-mono uppercase"
                  value={design.colors.primaryDark}
                  onChange={(e) => set(["colors", "primaryDark"], e.target.value)}
                  maxLength={7}
                />
              </div>
            </div>
            {/* Swatch preview */}
            <div className="flex gap-2 mt-1">
              <div className="flex-1 h-6 rounded-lg" style={{ background: design.colors.primary }} title="Primary" />
              <div className="flex-1 h-6 rounded-lg" style={{ background: design.colors.primaryDark }} title="Primary Dark" />
              <div className="flex-1 h-6 rounded-lg" style={{ background: `${design.colors.primary}40` }} title="Primary 25%" />
            </div>
          </ControlCard>

          {/* Typography */}
          <ControlCard icon={Type} title="Typography">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Heading Scale</label>
                <span className="text-xs font-mono font-semibold" style={{ color: design.colors.primary }}>
                  {design.typography.headingScale.toFixed(2)}×
                </span>
              </div>
              <Slider
                min={0.7}
                max={1.4}
                step={0.05}
                value={[design.typography.headingScale]}
                onValueChange={([v]) => set(["typography", "headingScale"], v)}
                className="mb-3"
              />
              <div className="flex items-end gap-2 p-3 bg-white rounded-lg border border-slate-200">
                <span
                  className="font-bold leading-none"
                  style={{ fontSize: `${24 * design.typography.headingScale}px`, color: design.colors.primary }}
                >
                  Aa
                </span>
                <span className="text-slate-500 text-xs mb-0.5">Heading preview</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Body Scale</label>
                <span className="text-xs font-mono font-semibold" style={{ color: design.colors.primary }}>
                  {design.typography.bodyScale.toFixed(2)}×
                </span>
              </div>
              <Slider
                min={0.9}
                max={1.2}
                step={0.05}
                value={[design.typography.bodyScale]}
                onValueChange={([v]) => set(["typography", "bodyScale"], v)}
                className="mb-3"
              />
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <p className="text-slate-500 leading-relaxed" style={{ fontSize: `${14 * design.typography.bodyScale}px` }}>
                  Body text preview at selected scale.
                </p>
              </div>
            </div>
          </ControlCard>

          {/* Spacing */}
          <ControlCard icon={Layers} title="Spacing">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-2">
                Section Padding
              </label>
              <SegmentedControl
                options={[
                  { label: "Compact", value: "compact" as const },
                  { label: "Default", value: "default" as const },
                  { label: "Spacious", value: "spacious" as const },
                ]}
                value={design.spacing.sectionPadding}
                onChange={(v) => set(["spacing", "sectionPadding"], v)}
              />
            </div>
          </ControlCard>

          {/* Layout Variants */}
          <ControlCard icon={Layout} title="Layout Variants">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-2">Services Columns</label>
              <SegmentedControl
                options={[
                  { label: "2", value: 2 as const },
                  { label: "3", value: 3 as const },
                  { label: "4", value: 4 as const },
                ]}
                value={design.layout.servicesColumns}
                onChange={(v) => set(["layout", "servicesColumns"], v)}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-2">Hero Style</label>
              <SegmentedControl
                options={[
                  { label: "Fullscreen", value: "fullscreen" as const },
                  { label: "Split", value: "split" as const },
                ]}
                value={design.layout.heroStyle}
                onChange={(v) => set(["layout", "heroStyle"], v)}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-2">Testimonials Layout</label>
              <SegmentedControl
                options={[
                  { label: "Columns", value: "columns" as const },
                  { label: "Carousel", value: "carousel" as const },
                  { label: "Grid", value: "grid" as const },
                ]}
                value={design.layout.testimonialsLayout}
                onChange={(v) => set(["layout", "testimonialsLayout"], v)}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-2">Process Layout</label>
              <SegmentedControl
                options={[
                  { label: "Horizontal", value: "horizontal" as const },
                  { label: "Vertical", value: "vertical" as const },
                ]}
                value={design.layout.processLayout}
                onChange={(v) => set(["layout", "processLayout"], v)}
              />
            </div>
          </ControlCard>

          {/* Section Visibility */}
          <ControlCard icon={Eye} title="Section Visibility — Home">
            <div className="space-y-1">
              {homeSections.map(({ key, label }) => {
                const visible = design.sections.home[key];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0"
                  >
                    <span className={`text-sm transition-all duration-150 ${visible ? "text-slate-900" : "text-slate-400 line-through"}`}>
                      {label}
                    </span>
                    <Switch
                      checked={visible}
                      onCheckedChange={(checked) => set(["sections", "home", key], checked)}
                    />
                  </div>
                );
              })}
            </div>
          </ControlCard>

          {/* Animations */}
          <ControlCard icon={Zap} title="Animations & Effects">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-slate-900 text-sm">Master Animations</p>
                <p className="text-slate-500 text-xs mt-0.5">Enables all scroll and entrance animations</p>
              </div>
              <Switch
                checked={design.animations.enabled}
                onCheckedChange={(checked) => set(["animations", "enabled"], checked)}
              />
            </div>
            <div className="flex items-center justify-between py-1 border-t border-slate-200">
              <div>
                <p className="text-slate-900 text-sm">Scene Dividers</p>
                <p className="text-slate-500 text-xs mt-0.5">Decorative dividers between sections</p>
              </div>
              <Switch
                checked={design.sceneDividers.enabled}
                onCheckedChange={(checked) => set(["sceneDividers", "enabled"], checked)}
              />
            </div>
          </ControlCard>

          {/* Design Tokens Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-400 mb-3">Design Tokens</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Primary", value: design.colors.primary },
                { label: "Primary Dark", value: design.colors.primaryDark },
                { label: "Heading Scale", value: `${design.typography.headingScale}×` },
                { label: "Body Scale", value: `${design.typography.bodyScale}×` },
                { label: "Padding", value: design.spacing.sectionPadding },
                { label: "Hero Style", value: design.layout.heroStyle },
                { label: "Services Grid", value: `${design.layout.servicesColumns} cols` },
                { label: "Testimonials", value: design.layout.testimonialsLayout },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between bg-white rounded-lg px-2.5 py-2">
                  <span className="text-slate-500 text-[10px]">{label}</span>
                  <span className="text-slate-900 font-mono text-[10px]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Live Preview (iframe) */}
        <div className="flex-1 relative bg-[#050505]">
          <div className="absolute inset-0 flex flex-col">
            {/* Preview toolbar */}
            <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-3 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-[11px] text-slate-400">
                localhost:3000
              </div>
              <button
                onClick={refreshPreview}
                className="text-slate-400 hover:text-slate-700 transition-colors"
                title="Refresh preview"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            {/* iframe */}
            <iframe
              ref={iframeRef}
              src="/"
              className="flex-1 w-full border-0"
              title="Site Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
