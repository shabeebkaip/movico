"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LogOut,
  ChevronRight,
  Film,
  Globe,
  Info,
  Phone,
  Users,
  FolderOpen,
  Paintbrush,
  Settings,
  Image as ImageIcon,
  Inbox,
  Clapperboard,
} from "lucide-react";

const navSections = [
  {
    title: "Pages",
    items: [
      { label: "Home",     href: "/admin/content",          icon: Globe },
      { label: "About",    href: "/admin/content/about",    icon: Info },
      { label: "Contact",  href: "/admin/content/contact",  icon: Phone },
      { label: "Clients",  href: "/admin/content/clients",  icon: Users },
      { label: "Projects", href: "/admin/content/projects", icon: FolderOpen },
      { label: "Studio",   href: "/admin/content/studio",   icon: Clapperboard },
    ],
  },
  {
    title: "Leads",
    items: [
      { label: "Enquiries",     href: "/admin/enquiries", icon: Inbox },
    ],
  },
  {
    title: "Assets",
    items: [
      { label: "Showreel",      href: "/admin/showreel", icon: Film },
      { label: "Media Library", href: "/admin/media",    icon: ImageIcon },
    ],
  },
  {
    title: "Design",
    items: [
      { label: "Design Panel", href: "/admin/design", icon: Paintbrush },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function NavLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
        isActive
          ? "text-[#d98629] bg-[#d98629]/10"
          : "text-slate-400 hover:text-white hover:bg-slate-700/50"
      }`}
    >
      <Icon size={14} className="shrink-0" />
      <span>{label}</span>
      {isActive && <ChevronRight size={12} className="ml-auto text-[#d98629]/60" />}
    </Link>
  );
}

export default function AdminSidebar() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/cms/auth", { method: "DELETE" });
    } finally {
      router.push("/admin/login");
    }
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#0f172a] border-r border-slate-700/50 flex flex-col z-50">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-700/50">
        <Link href="/admin" className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={{ background: "#d98629" }}
          >
            <span className="text-black font-black text-[11px]">M</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-[0.08em] uppercase leading-none">
              Movico
            </p>
            <p className="text-slate-400 text-[10px] tracking-[0.12em] uppercase mt-0.5">CMS</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 px-3 mb-2">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink key={item.href} href={item.href} icon={item.icon} label={item.label} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-700/50 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-150"
        >
          <Globe size={14} />
          <span>View Live Site</span>
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-150 disabled:opacity-50"
        >
          <LogOut size={14} />
          <span>{loggingOut ? "Logging out…" : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
