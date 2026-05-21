"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Paintbrush,
  Save,
  ExternalLink,
  LogOut,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useCMS } from "./CMSContext";
import { DesignSidebar } from "./DesignSidebar";

// ─── CMSBar ───────────────────────────────────────────────────────────────────

export function CMSBar() {
  const {
    isAdmin,
    editMode,
    setEditMode,
    pendingContentChanges,
    pendingDesignChanges,
    saveContent,
    saveDesign,
    isSaving,
  } = useCMS();

  const [designOpen, setDesignOpen] = useState(false);

  if (!isAdmin) return null;

  const totalPending = pendingContentChanges + pendingDesignChanges;

  const handleSave = async () => {
    if (pendingContentChanges > 0) await saveContent();
    if (pendingDesignChanges > 0) await saveDesign();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/cms/auth", { method: "DELETE" });
    } finally {
      window.location.reload();
    }
  };

  return (
    <>
      <DesignSidebar isOpen={designOpen} onClose={() => setDesignOpen(false)} />

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 32, delay: 0.4 }}
        className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2"
        role="toolbar"
        aria-label="CMS toolbar"
      >
        <div
          className="flex items-center gap-1 rounded-full px-2 py-1.5"
          style={{
            background: "rgba(17,17,17,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: editMode
              ? "0 0 0 1px rgba(217,134,41,0.40), 0 8px 40px rgba(0,0,0,0.6)"
              : "0 8px 40px rgba(0,0,0,0.5)",
            transition: "box-shadow 0.25s ease",
          }}
        >
          {/* Movico logo mark */}
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-black"
            style={{ background: "#d98629", color: "#000" }}
            aria-hidden="true"
          >
            M
          </div>

          <Divider />

          {/* Edit mode toggle */}
          <BarButton
            onClick={() => setEditMode(!editMode)}
            active={editMode}
            icon={<Pencil size={12} />}
            label="Edit"
            aria-pressed={editMode}
          />

          <Divider />

          {/* Design panel */}
          <BarButton
            onClick={() => setDesignOpen(true)}
            active={designOpen}
            icon={<Paintbrush size={12} />}
            label="Design"
          />

          {/* Save button — only when there are pending changes */}
          {totalPending > 0 && (
            <>
              <Divider />
              <button
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all disabled:opacity-60"
                style={{ background: "#d98629", color: "#000" }}
                aria-label={`Save ${totalPending} change${totalPending !== 1 ? "s" : ""}`}
              >
                {isSaving ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Save size={11} />
                )}
                {isSaving ? "Saving…" : `Save (${totalPending})`}
              </button>
            </>
          )}

          <Divider />

          {/* Admin link */}
          <Link href="/admin" className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-white/50 transition-colors hover:text-white">
            <ExternalLink size={11} />
            Admin
          </Link>

          <Divider />

          {/* Logout */}
          <button
            onClick={() => void handleLogout()}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-white/40 transition-colors hover:text-red-400"
            aria-label="Log out of CMS"
            title="Log out"
          >
            <LogOut size={11} />
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      className="h-4 w-px shrink-0"
      style={{ background: "rgba(255,255,255,0.10)" }}
      aria-hidden="true"
    />
  );
}

interface BarButtonProps {
  onClick: () => void;
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  "aria-pressed"?: boolean;
}

function BarButton({ onClick, active = false, icon, label, ...props }: BarButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all"
      style={
        active
          ? { background: "#d98629", color: "#000" }
          : { color: "rgba(255,255,255,0.5)" }
      }
      {...(props["aria-pressed"] !== undefined
        ? { "aria-pressed": props["aria-pressed"] }
        : {})}
    >
      {icon}
      {label}
    </button>
  );
}
