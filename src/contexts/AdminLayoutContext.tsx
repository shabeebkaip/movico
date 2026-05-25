"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AdminLayoutContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType>({
  sidebarOpen: true,
  toggleSidebar: () => {},
});

export function AdminLayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar");
    if (saved !== null) setSidebarOpen(saved === "open");
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((v) => {
      const next = !v;
      localStorage.setItem("admin-sidebar", next ? "open" : "closed");
      return next;
    });
  }, []);

  return (
    <AdminLayoutContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </AdminLayoutContext.Provider>
  );
}

export const useAdminLayout = () => useContext(AdminLayoutContext);
