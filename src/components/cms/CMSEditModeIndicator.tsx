"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCMS } from "./CMSContext";

// ─── CMSEditModeIndicator ─────────────────────────────────────────────────────

export function CMSEditModeIndicator() {
  const { isAdmin, editMode } = useCMS();

  if (!isAdmin) return null;

  return (
    <AnimatePresence>
      {editMode && (
        <>
          {/* Amber top bar */}
          <motion.div
            key="edit-bar"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-0 right-0 top-0 z-[9998]"
            style={{
              height: 2,
              background: "#d98629",
              transformOrigin: "left",
            }}
            aria-hidden="true"
          />

          {/* "EDIT MODE" label */}
          <motion.div
            key="edit-label"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, delay: 0.08 }}
            className="fixed right-2 top-2 z-[9998] select-none"
          >
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{ background: "#d98629", color: "#000" }}
              aria-live="polite"
              aria-label="Edit mode active"
            >
              Edit Mode
            </span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
