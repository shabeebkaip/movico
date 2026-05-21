"use client";

import Link from "next/link";
import {
  LayoutGrid,
  Paintbrush,
  Briefcase,
  ExternalLink,
  FileText,
  Users,
  HelpCircle,
  Layers,
  ArrowRight,
} from "lucide-react";

const stats = [
  { label: "Sections", value: "14", icon: Layers },
  { label: "Services", value: "8", icon: Briefcase },
  { label: "Testimonials", value: "9", icon: Users },
  { label: "FAQs", value: "6", icon: HelpCircle },
];

const quickLinks = [
  {
    label: "Edit Home Page",
    description: "Hero, services, testimonials, and more",
    href: "/admin/content",
    icon: FileText,
    accent: "#d98629",
  },
  {
    label: "Design Panel",
    description: "Colors, layout, typography, visibility",
    href: "/admin/design",
    icon: Paintbrush,
    accent: "#7c3aed",
  },
  {
    label: "Edit Services",
    description: "Manage service items and descriptions",
    href: "/admin/content/services",
    icon: Briefcase,
    accent: "#0ea5e9",
  },
  {
    label: "View Live Site",
    description: "See how the site looks to visitors",
    href: "/",
    icon: ExternalLink,
    accent: "#22c55e",
    external: true,
  },
];

export default function AdminDashboard() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-8 container mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 mb-2">
          {greeting}
        </p>
        <h1
          className="text-3xl font-bold text-white mb-1"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Movico CMS
        </h1>
        <p className="text-white/40 text-sm">
          Manage your website content and design from one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-[#111111] border border-white/[0.06] rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon size={14} className="text-white/30" />
              <span
                className="text-[10px] uppercase tracking-[0.15em]"
                style={{ color: "#d98629" }}
              >
                Total
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-[11px] text-white/40 uppercase tracking-[0.12em]">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.15em] text-white/30 mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map(({ label, description, href, icon: Icon, accent, external }) => (
            <Link
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              className="group bg-[#111111] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-all duration-200 flex items-start gap-4"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-110"
                style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
              >
                <Icon size={15} style={{ color: accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm mb-1 group-hover:text-white transition-colors">
                  {label}
                </p>
                <p className="text-white/40 text-xs leading-relaxed">{description}</p>
              </div>
              <ArrowRight
                size={14}
                className="text-white/20 group-hover:text-white/50 mt-0.5 shrink-0 transition-all duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-5">
        <p className="text-[11px] uppercase tracking-[0.15em] text-white/30 mb-4">
          System Status
        </p>
        <div className="space-y-3">
          {[
            { label: "Content API", status: "Operational" },
            { label: "Design API", status: "Operational" },
            { label: "Authentication", status: "Active" },
          ].map(({ label, status }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-white/50 text-sm">{label}</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 text-xs">{status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
