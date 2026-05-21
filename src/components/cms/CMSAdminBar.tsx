"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil, Paintbrush, Save, LayoutGrid, LogOut, Loader2, CheckCircle2,
} from "lucide-react";
import { useCMS } from "./CMSContext";
import { DesignSidebar } from "./DesignSidebar";

export function CMSAdminBar() {
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
  const [saved, setSaved] = useState(false);

  if (!isAdmin) return null;

  const totalPending = pendingContentChanges + pendingDesignChanges;

  async function handleSave() {
    if (pendingContentChanges > 0) await saveContent();
    if (pendingDesignChanges > 0) await saveDesign();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleLogout() {
    await fetch("/api/cms/auth", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <>
      <DesignSidebar isOpen={designOpen} onClose={() => setDesignOpen(false)} />

      {/* Amber edit-mode stripe */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            key="stripe"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-[10001] h-[2px] origin-left"
            style={{ background: "linear-gradient(90deg, #d98629, #f0a84a, #d98629)" }}
          />
        )}
      </AnimatePresence>

      {/* Admin bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-[10000] h-10 flex items-center justify-between px-4 transition-colors duration-300 ${
          editMode
            ? "bg-[#1a0f00] border-b border-[#d98629]/30"
            : "bg-[#0f0f0f] border-b border-white/[0.06]"
        }`}
      >
        {/* Left — brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-black shrink-0"
            style={{ background: "#d98629", color: "#000" }}
          >
            M
          </div>
          <span className="text-white/30 text-[10px] uppercase tracking-[0.2em] hidden sm:block">
            Movico CMS
          </span>

          {editMode && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[#d98629] text-[10px] uppercase tracking-[0.2em] font-semibold"
            >
              · Edit Mode
            </motion.span>
          )}
        </div>

        {/* Right — controls */}
        <div className="flex items-center gap-0.5">
          {/* Edit toggle */}
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-1.5 px-3 h-7 rounded-md text-[11px] font-semibold transition-all duration-200 ${
              editMode
                ? "bg-[#d98629] text-black"
                : "text-white/50 hover:text-white hover:bg-white/[0.08]"
            }`}
          >
            <Pencil size={10} />
            {editMode ? "Editing" : "Edit"}
          </button>

          {/* Design */}
          <button
            onClick={() => setDesignOpen(true)}
            className="flex items-center gap-1.5 px-3 h-7 rounded-md text-[11px] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
          >
            <Paintbrush size={10} />
            <span className="hidden sm:inline">Design</span>
          </button>

          {/* Save */}
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.span
                key="saved"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5 px-3 h-7 rounded-md text-[11px] text-green-400 bg-green-400/10"
              >
                <CheckCircle2 size={10} /> Saved
              </motion.span>
            ) : totalPending > 0 ? (
              <motion.button
                key="save"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3 h-7 rounded-md text-[11px] font-bold bg-[#d98629] text-black hover:bg-[#c4771e] disabled:opacity-60 transition-all"
              >
                {isSaving ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <Save size={10} />
                )}
                {isSaving ? "Saving…" : `Save ${totalPending} change${totalPending !== 1 ? "s" : ""}`}
              </motion.button>
            ) : null}
          </AnimatePresence>

          {/* Divider */}
          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Admin panel */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 h-7 rounded-md text-[11px] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
          >
            <LayoutGrid size={10} />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          {/* Logout */}
          <button
            onClick={() => void handleLogout()}
            className="flex items-center justify-center w-7 h-7 rounded-md text-white/30 hover:text-red-400 hover:bg-red-400/[0.08] transition-all duration-200"
            title="Log out"
          >
            <LogOut size={10} />
          </button>
        </div>
      </div>
    </>
  );
}
