"use client";

import Link from "next/link";
import {
  Paintbrush,
  ExternalLink,
  FileText,
  Users,
  FolderOpen,
  Info,
  Phone,
  Film,
  ArrowUpRight,
  CheckCircle2,
  Globe,
  Inbox,
  Clapperboard,
} from "lucide-react";

const quickLinks = [
  {
    label: "Home Content",
    description: "Edit hero, services & testimonials",
    href: "/admin/content",
    icon: FileText,
    color: "#d98629",
    bg: "#fef3e2",
  },
  {
    label: "Design Panel",
    description: "Brand colours, typography & layout",
    href: "/admin/design",
    icon: Paintbrush,
    color: "#7c3aed",
    bg: "#f3f0ff",
  },
  {
    label: "Projects",
    description: "Manage portfolio & case studies",
    href: "/admin/content/projects",
    icon: FolderOpen,
    color: "#0ea5e9",
    bg: "#e0f2fe",
  },
  {
    label: "About Page",
    description: "Team, story & brand values",
    href: "/admin/content/about",
    icon: Info,
    color: "#10b981",
    bg: "#d1fae5",
  },
  {
    label: "Showreel",
    description: "Manage highlight videos",
    href: "/admin/showreel",
    icon: Film,
    color: "#f43f5e",
    bg: "#ffe4e6",
  },
  {
    label: "Clients",
    description: "Logo grid & client showcase",
    href: "/admin/content/clients",
    icon: Users,
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    label: "Enquiries",
    description: "View all contact submissions",
    href: "/admin/enquiries",
    icon: Inbox,
    color: "#f59e0b",
    bg: "#fef9c3",
  },
  {
    label: "Contact Info",
    description: "Address, phone & social links",
    href: "/admin/content/contact",
    icon: Phone,
    color: "#64748b",
    bg: "#f1f5f9",
  },
  {
    label: "Studio Page",
    description: "Edit studio space & packages",
    href: "/admin/content/studio",
    icon: Clapperboard,
    color: "#0f766e",
    bg: "#ccfbf1",
  },
  {
    label: "View Live Site",
    description: "Preview the public website",
    href: "/",
    icon: Globe,
    color: "#64748b",
    bg: "#f1f5f9",
    external: true,
  },
];

const systemStatus = [
  { label: "Content API", status: "Operational", ok: true },
  { label: "Design API",  status: "Operational", ok: true },
  { label: "Auth",        status: "Active",       ok: true },
  { label: "Media CDN",   status: "Operational", ok: true },
];

export default function AdminDashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">{today}</p>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {greeting} 👋
            </h1>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-4 py-2 transition-colors"
          >
            <ExternalLink size={12} />
            View Live Site
          </Link>
        </div>
      </div>

      <div className="px-8 py-8 max-w-6xl">

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Quick Actions</h2>
            <span className="text-xs text-slate-400">— jump to any section</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map(({ label, description, href, icon: Icon, color, bg, external }) => (
              <Link
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all duration-150 flex flex-col gap-3"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105"
                  style={{ background: bg }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug mb-0.5 group-hover:text-slate-900">
                    {label}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{description}</p>
                </div>
                <ArrowUpRight
                  size={13}
                  className="text-slate-300 group-hover:text-slate-500 transition-colors self-end"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row: system status + brand */}
        <div className="grid grid-cols-3 gap-4">

          {/* System status */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              System Status
            </p>
            <div className="grid grid-cols-2 gap-2">
              {systemStatus.map(({ label, status, ok }) => (
                <div
                  key={label}
                  className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3"
                >
                  <span className="text-sm text-slate-700 font-medium">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className={ok ? "text-emerald-500" : "text-red-400"} />
                    <span className={`text-xs font-medium ${ok ? "text-emerald-600" : "text-red-500"}`}>
                      {status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand card */}
          <div
            className="rounded-xl p-5 flex flex-col justify-between"
            style={{ background: "linear-gradient(135deg, #1a0a00 0%, #3d1f00 100%)" }}
          >
            <div>
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center mb-4"
                style={{ background: "#d98629" }}
              >
                <span className="text-black font-black text-[11px]">M</span>
              </div>
              <p className="text-white font-bold text-base leading-tight mb-1">
                Movico CMS
              </p>
              <p className="text-white/50 text-xs leading-relaxed">
                Your content is live and operational.
              </p>
            </div>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#d98629] hover:text-[#e8972e] transition-colors mt-4"
            >
              <Globe size={11} />
              movicoksa.com
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
