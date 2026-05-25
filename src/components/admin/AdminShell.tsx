"use client";

import { AdminLayoutProvider, useAdminLayout } from "@/contexts/AdminLayoutContext";
import AdminSidebar from "./AdminSidebar";

function ShellInner({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAdminLayout();
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main
        className="flex-1 min-h-screen bg-slate-50 overflow-x-hidden transition-[margin] duration-200"
        style={{ marginLeft: sidebarOpen ? "224px" : "56px" }}
      >
        {children}
      </main>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutProvider>
      <ShellInner>{children}</ShellInner>
    </AdminLayoutProvider>
  );
}
