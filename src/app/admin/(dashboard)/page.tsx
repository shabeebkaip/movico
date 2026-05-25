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
  TrendingUp,
  Clock,
  Mail,
  Star,
} from "lucide-react";
import { listEnquiries, countNewEnquiries } from "@/lib/cms/enquiries";
import { projectCount } from "@/lib/cms/projects";
import { clientCount } from "@/lib/cms/clients";

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
];

const systemStatus = [
  { label: "Content API", status: "Operational", ok: true },
  { label: "Design API",  status: "Operational", ok: true },
  { label: "Auth",        status: "Active",       ok: true },
  { label: "Media CDN",   status: "Operational", ok: true },
];

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const serviceColors: Record<string, { bg: string; text: string }> = {
  "Video Production": { bg: "#e0f2fe", text: "#0369a1" },
  "Event Production": { bg: "#fce7f3", text: "#be185d" },
  "Brand Identity":   { bg: "#f3e8ff", text: "#7e22ce" },
  "Spatial & Booth":  { bg: "#d1fae5", text: "#065f46" },
  "Photography":      { bg: "#fef9c3", text: "#854d0e" },
  "Other":            { bg: "#f1f5f9", text: "#475569" },
};

export default async function AdminDashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const [enquiries, newCount, projects, clients] = await Promise.all([
    listEnquiries(),
    countNewEnquiries(),
    projectCount(),
    clientCount(),
  ]);

  const recentEnquiries = enquiries.slice(0, 6);
  const totalEnquiries = enquiries.length;
  const thisMonth = enquiries.filter((e) => {
    const d = new Date(e.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      label: "New Enquiries",
      value: newCount,
      sub: "Awaiting response",
      icon: Mail,
      accent: newCount > 0 ? "#f59e0b" : "#10b981",
      accentBg: newCount > 0 ? "#fef3c7" : "#d1fae5",
      highlight: newCount > 0,
    },
    {
      label: "This Month",
      value: thisMonth,
      sub: "Enquiries received",
      icon: TrendingUp,
      accent: "#0ea5e9",
      accentBg: "#e0f2fe",
      highlight: false,
    },
    {
      label: "Total Projects",
      value: projects,
      sub: "In portfolio",
      icon: Star,
      accent: "#7c3aed",
      accentBg: "#f3f0ff",
      highlight: false,
    },
    {
      label: "Clients",
      value: clients,
      sub: "Featured on site",
      icon: Users,
      accent: "#6366f1",
      accentBg: "#eef2ff",
      highlight: false,
    },
  ];

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

      <div className="px-8 py-8 max-w-6xl space-y-8">

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map(({ label, value, sub, icon: Icon, accent, accentBg, highlight }) => (
            <div
              key={label}
              className={`bg-white rounded-xl border p-5 transition-all ${
                highlight
                  ? "border-amber-200 shadow-sm shadow-amber-100"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">{label}</span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: accentBg }}
                >
                  <Icon size={13} style={{ color: accent }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 leading-none mb-1">{value}</p>
              <p className="text-[11px] text-slate-400">{sub}</p>
            </div>
          ))}
        </div>

        {/* Main content: recent enquiries + quick actions */}
        <div className="grid grid-cols-3 gap-4">

          {/* Recent enquiries — left 2 cols */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-800">Recent Enquiries</span>
                {newCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                    {newCount} new
                  </span>
                )}
              </div>
              <Link
                href="/admin/enquiries"
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
              >
                View all <ArrowUpRight size={11} />
              </Link>
            </div>

            {recentEnquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Inbox size={32} className="text-slate-200 mb-3" />
                <p className="text-sm font-medium text-slate-400">No enquiries yet</p>
                <p className="text-xs text-slate-300 mt-1">They'll show up here when people reach out</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentEnquiries.map((enq) => {
                  const sc = serviceColors[enq.service] ?? serviceColors["Other"];
                  return (
                    <Link
                      key={String(enq._id)}
                      href="/admin/enquiries"
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group"
                    >
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-slate-500">
                          {enq.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Name + company */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-800 truncate">{enq.name}</p>
                          {enq.status === "new" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {enq.company ? `${enq.company} · ` : ""}{enq.email}
                        </p>
                      </div>

                      {/* Service badge */}
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: sc.bg, color: sc.text }}
                      >
                        {enq.service}
                      </span>

                      {/* Budget */}
                      <span className="text-[11px] text-slate-400 shrink-0 w-16 text-right">
                        {enq.budget}
                      </span>

                      {/* Time */}
                      <span className="text-[11px] text-slate-300 shrink-0 w-14 text-right">
                        {timeAgo(enq.createdAt)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right column: top services breakdown + quick brand card */}
          <div className="flex flex-col gap-4">

            {/* Enquiry breakdown by service */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                By Service
              </p>
              {totalEnquiries === 0 ? (
                <p className="text-xs text-slate-300 text-center py-4">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(
                    enquiries.reduce<Record<string, number>>((acc, e) => {
                      acc[e.service] = (acc[e.service] ?? 0) + 1;
                      return acc;
                    }, {})
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([service, count]) => {
                      const sc = serviceColors[service] ?? serviceColors["Other"];
                      const pct = Math.round((count / totalEnquiries) * 100);
                      return (
                        <div key={service}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600 truncate max-w-[130px]">{service}</span>
                            <span className="text-xs font-semibold text-slate-700">{count}</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, background: sc.text }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Brand card */}
            <div
              className="rounded-xl p-5 flex flex-col justify-between"
              style={{ background: "linear-gradient(135deg, #1a0a00 0%, #3d1f00 100%)" }}
            >
              <div>
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center mb-3"
                  style={{ background: "#d98629" }}
                >
                  <span className="text-black font-black text-[11px]">M</span>
                </div>
                <p className="text-white font-bold text-sm leading-tight mb-1">Movico CMS</p>
                <p className="text-white/50 text-[11px] leading-relaxed">
                  Content live & operational.
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

        {/* Quick Actions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Quick Actions</h2>
            <span className="text-xs text-slate-400">— jump to any section</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map(({ label, description, href, icon: Icon, color, bg }) => (
              <Link
                key={href}
                href={href}
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

        {/* System Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
            System Status
          </p>
          <div className="grid grid-cols-4 gap-2">
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

      </div>
    </div>
  );
}
