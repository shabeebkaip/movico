"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useCMS } from "./CMSContext";

// ─── Section toggles config ───────────────────────────────────────────────────

const SECTION_KEYS = [
  { key: "hero",          label: "Hero" },
  { key: "marquee",       label: "Marquee" },
  { key: "clients",       label: "Clients" },
  { key: "about",         label: "About" },
  { key: "workShowcase",  label: "Work Showcase" },
  { key: "services",      label: "Services" },
  { key: "studioPromo",   label: "Studio Promo" },
  { key: "showreel",      label: "Showreel" },
  { key: "caseStudy",     label: "Case Study" },
  { key: "process",       label: "Process" },
  { key: "testimonials",  label: "Testimonials" },
  { key: "insights",      label: "Insights" },
  { key: "faq",           label: "FAQ" },
  { key: "cta",           label: "CTA" },
] as const;

type SectionKey = (typeof SECTION_KEYS)[number]["key"];

// ─── DesignSidebar ────────────────────────────────────────────────────────────

interface DesignSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesignSidebar({ isOpen, onClose }: DesignSidebarProps) {
  const { design, updateDesign, saveDesign, isSaving, pendingDesignChanges } = useCMS();
  const colorInputRef = useRef<HTMLInputElement>(null);
  const hexInputRef = useRef<HTMLInputElement>(null);

  // Sync CSS variable whenever primary color in design changes
  useEffect(() => {
    if (design?.colors.primary) {
      document.documentElement.style.setProperty(
        "--color-primary",
        design.colors.primary
      );
    }
  }, [design?.colors.primary]);

  // Trap focus / close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!design) return null;

  const sections = design.sections.home;

  const handleColorChange = (hex: string) => {
    // Live update CSS variable immediately
    document.documentElement.style.setProperty("--color-primary", hex);
    updateDesign("colors.primary", hex);
    if (hexInputRef.current) hexInputRef.current.value = hex;
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    // Accept valid 6-digit hex
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) {
      handleColorChange(raw);
      if (colorInputRef.current) colorInputRef.current.value = raw;
    }
  };

  const handleSectionToggle = (key: SectionKey, enabled: boolean) => {
    updateDesign(`sections.home.${key}`, enabled);
  };

  const handleColumnsChange = (cols: number) => {
    updateDesign("layout.servicesColumns", cols);
  };

  const handleAnimationsToggle = (enabled: boolean) => {
    updateDesign("animations.enabled", enabled);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9980] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            key="sidebar-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-[9985] flex flex-col overflow-hidden"
            style={{
              width: 320,
              background: "#0f0f0f",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
            }}
            aria-label="Design settings"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-500">
                  Design
                </p>
                <p className="text-[11px] text-white/30 mt-0.5">Live controls</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:border-white/20 hover:text-white"
                aria-label="Close design panel"
              >
                <X size={13} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">

              {/* ── Brand Color ── */}
              <Section title="Brand Color">
                <div className="flex items-center gap-3">
                  {/* Color swatch input */}
                  <div
                    className="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10 transition-transform hover:scale-105"
                    style={{ background: design.colors.primary }}
                    onClick={() => colorInputRef.current?.click()}
                    role="button"
                    aria-label="Pick brand color"
                  >
                    <input
                      ref={colorInputRef}
                      type="color"
                      defaultValue={design.colors.primary}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      tabIndex={-1}
                    />
                  </div>
                  {/* Hex text input */}
                  <div className="flex-1">
                    <input
                      ref={hexInputRef}
                      type="text"
                      defaultValue={design.colors.primary}
                      onChange={handleHexInput}
                      maxLength={7}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-sm text-white/80 focus:border-amber-500/40 focus:outline-none transition-colors"
                      placeholder="#d98629"
                      spellCheck={false}
                    />
                    <p className="mt-1 text-[10px] text-white/25">
                      Updates live — save to persist
                    </p>
                  </div>
                </div>
              </Section>

              {/* ── Section Visibility ── */}
              <Section title="Section Visibility">
                <div className="space-y-0.5">
                  {SECTION_KEYS.map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="text-sm text-white/60">{label}</span>
                      <Switch
                        checked={sections[key]}
                        onCheckedChange={(checked) =>
                          handleSectionToggle(key, checked)
                        }
                        aria-label={`Toggle ${label} section`}
                      />
                    </div>
                  ))}
                </div>
              </Section>

              {/* ── Layout ── */}
              <Section title="Layout">
                {/* Services columns */}
                <div className="space-y-2">
                  <p className="text-xs text-white/40">Services Columns</p>
                  <div className="flex gap-1.5">
                    {[2, 3, 4].map((cols) => (
                      <button
                        key={cols}
                        onClick={() => handleColumnsChange(cols)}
                        className="flex-1 rounded-lg border py-2 text-sm font-medium transition-all"
                        style={
                          design.layout.servicesColumns === cols
                            ? {
                                background: "#d98629",
                                borderColor: "#d98629",
                                color: "#000",
                              }
                            : {
                                borderColor: "rgba(255,255,255,0.1)",
                                color: "rgba(255,255,255,0.4)",
                              }
                        }
                      >
                        {cols}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animations toggle */}
                <div className="mt-4 flex items-center justify-between rounded-lg px-3 py-2.5 bg-white/[0.03]">
                  <div>
                    <p className="text-sm text-white/60">Animations</p>
                    <p className="text-[10px] text-white/25">GSAP & Framer Motion</p>
                  </div>
                  <Switch
                    checked={design.animations.enabled}
                    onCheckedChange={handleAnimationsToggle}
                    aria-label="Toggle animations"
                  />
                </div>
              </Section>
            </div>

            {/* Footer: Save button */}
            <div className="shrink-0 px-5 py-4 border-t border-white/[0.06]">
              {pendingDesignChanges > 0 && (
                <p className="mb-2 text-center text-[10px] text-amber-500/60">
                  {pendingDesignChanges} unsaved change{pendingDesignChanges !== 1 ? "s" : ""}
                </p>
              )}
              <button
                onClick={() => void saveDesign()}
                disabled={isSaving || pendingDesignChanges === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: pendingDesignChanges > 0 ? "#d98629" : "rgba(255,255,255,0.06)",
                  color: pendingDesignChanges > 0 ? "#000" : "rgba(255,255,255,0.3)",
                }}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Design"
                )}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4 border-b border-white/[0.05]">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
        {title}
      </p>
      {children}
    </div>
  );
}
