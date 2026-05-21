"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Image,
  Paintbrush,
  Settings,
  LogOut,
  ChevronRight,
  Film,
  Globe,
  Info,
  Phone,
  Briefcase,
} from "lucide-react";

const navSections = [
  {
    title: "Pages",
    icon: LayoutGrid,
    items: [
      { label: "Home", href: "/admin/content", icon: Globe },
      { label: "About", href: "/admin/content/about", icon: Info },
      { label: "Services", href: "/admin/content/services", icon: Briefcase },
      { label: "Contact", href: "/admin/content/contact", icon: Phone },
    ],
  },
  {
    title: "Assets",
    icon: Image,
    items: [
      { label: "Showreel", href: "/admin/showreel", icon: Film },
      { label: "Media Library", href: "/admin/media", icon: Image },
    ],
  },
  {
    title: "Design",
    icon: Paintbrush,
    items: [
      { label: "Design Panel", href: "/admin/design", icon: Paintbrush },
    ],
  },
  {
    title: "System",
    icon: Settings,
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
        isActive
          ? "text-[#d98629] bg-[#d98629]/[0.08]"
          : "text-white/50 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <Icon size={14} className="shrink-0" />
      <span>{label}</span>
      {isActive && (
        <ChevronRight size={12} className="ml-auto text-[#d98629]/60" />
      )}
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Login page renders without the sidebar shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/cms/auth", { method: "DELETE" });
    } finally {
      router.push("/admin/login");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-[#0f0f0f] border-r border-white/[0.05] flex flex-col z-50">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/[0.05]">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
              style={{ background: "#d98629" }}
            >
              <span className="text-black font-black text-[11px]">M</span>
            </div>
            <div>
              <p
                className="text-white font-bold text-sm tracking-[0.08em] uppercase leading-none"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Movico
              </p>
              <p className="text-white/30 text-[10px] tracking-[0.12em] uppercase mt-0.5">
                CMS
              </p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/25 px-3 mb-2">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/[0.05] space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all duration-150"
          >
            <Globe size={14} />
            <span>View Live Site</span>
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-150 disabled:opacity-50"
          >
            <LogOut size={14} />
            <span>{loggingOut ? "Logging out…" : "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
