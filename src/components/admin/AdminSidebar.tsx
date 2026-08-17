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
  Layers,
  Paintbrush,
  Settings,
  Image as ImageIcon,
  Inbox,
  Clapperboard,
  PanelLeftClose,
  PanelLeft,
  SearchCheck,
  BookOpen,
} from "lucide-react";
import { useAdminLayout } from "@/contexts/AdminLayoutContext";

type NavItem = { label: string; href: string; icon: LucideIcon; exact?: boolean };

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Pages",
    items: [
      { label: "Home",     href: "/admin/content",          icon: Globe,        exact: true },
      { label: "About",    href: "/admin/content/about",    icon: Info },
      { label: "Contact",  href: "/admin/content/contact",  icon: Phone },
      { label: "Clients",  href: "/admin/content/clients",  icon: Users },
      { label: "Projects", href: "/admin/content/projects", icon: FolderOpen },
      { label: "Services", href: "/admin/content/services", icon: Layers },
      { label: "Studio",   href: "/admin/content/studio",   icon: Clapperboard },
      { label: "Blog",     href: "/admin/blog",              icon: BookOpen },
    ],
  },
  {
    title: "Leads",
    items: [
      { label: "Enquiries", href: "/admin/enquiries", icon: Inbox },
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
    title: "SEO",
    items: [
      { label: "SEO Settings", href: "/admin/seo", icon: SearchCheck },
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

function NavLink({ href, icon: Icon, label, exact, collapsed }: NavItem & { collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : (pathname === href || pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`group relative flex items-center gap-3 rounded-lg transition-all duration-150 ${
        collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
      } ${
        isActive
          ? "text-[#d98629] bg-[#d98629]/10"
          : "text-slate-400 hover:text-white hover:bg-slate-700/50"
      }`}
    >
      <Icon size={14} className="shrink-0" />
      {!collapsed && <span className="text-sm">{label}</span>}
      {!collapsed && isActive && <ChevronRight size={12} className="ml-auto text-[#d98629]/60" />}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
          {label}
        </span>
      )}
    </Link>
  );
}

export default function AdminSidebar() {
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useAdminLayout();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/cms/auth", { method: "DELETE" });
    } finally {
      router.push("/admin/login");
    }
  }

  const collapsed = !sidebarOpen;

  return (
    <aside
      className="fixed top-0 left-0 h-full bg-[#0f172a] border-r border-slate-700/50 flex flex-col z-50 transition-[width] duration-200 overflow-hidden"
      style={{ width: collapsed ? "56px" : "224px" }}
    >
      {/* Brand + toggle */}
      <div className={`border-b border-slate-700/50 flex items-center shrink-0 ${collapsed ? "px-0 py-4 justify-center" : "px-4 py-4 gap-3"}`}>
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: "#d98629" }}>
              <span className="text-black font-black text-[11px]">M</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm tracking-[0.08em] uppercase leading-none truncate">Movico</p>
              <p className="text-slate-400 text-[10px] tracking-[0.12em] uppercase mt-0.5">CMS</p>
            </div>
          </Link>
        )}

        {collapsed && (
          <Link href="/admin">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#d98629" }}>
              <span className="text-black font-black text-[11px]">M</span>
            </div>
          </Link>
        )}

        {!collapsed && (
          <button
            onClick={toggleSidebar}
            className="shrink-0 text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700/50"
            title="Collapse sidebar"
          >
            <PanelLeftClose size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 py-4 space-y-5 overflow-y-auto ${collapsed ? "px-0" : "px-3"}`}>
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 px-3 mb-2">
                {section.title}
              </p>
            )}
            {collapsed && <div className="h-px bg-slate-700/40 mx-2 mb-2" />}
            <div className={`space-y-0.5 ${collapsed ? "px-2" : ""}`}>
              {section.items.map((item) => (
                <NavLink key={item.href} {...item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={`border-t border-slate-700/50 py-3 space-y-1 ${collapsed ? "px-2" : "px-3"}`}>
        {collapsed ? (
          <>
            <button
              onClick={toggleSidebar}
              className="group relative w-full flex items-center justify-center p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
              title="Expand sidebar"
            >
              <PanelLeft size={14} />
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                Expand sidebar
              </span>
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Logout"
              className="group relative w-full flex items-center justify-center p-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/[0.06] transition-all disabled:opacity-50"
            >
              <LogOut size={14} />
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                Logout
              </span>
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </aside>
  );
}
