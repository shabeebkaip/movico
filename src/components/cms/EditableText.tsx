"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useCMS } from "./CMSContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getByPath(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as unknown) as string ?? "";
}

function formatLabel(path: string): string {
  const parts = path.split(".");
  // Drop the leading section (e.g. "home") for brevity, format each part
  const display = parts.slice(1).map((p) => {
    // Convert camelCase to Title Case
    return p
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  });
  return display.join(" › ");
}

// ─── Popover ──────────────────────────────────────────────────────────────────

interface PopoverProps {
  anchorRect: DOMRect;
  path: string;
  initialValue: string;
  multiline: boolean;
  onSave: (value: string) => void;
  onCancel: () => void;
}

function EditPopover({
  anchorRect,
  path,
  initialValue,
  multiline,
  onSave,
  onCancel,
}: PopoverProps) {
  const [localValue, setLocalValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (!multiline) {
      inputRef.current?.select();
    }
  }, [multiline]);

  // Position: prefer above, fall back to below
  const popoverWidth = 320;
  const popoverHeight = multiline ? 180 : 130;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1200;

  const spaceAbove = anchorRect.top;
  const spaceBelow = viewportH - anchorRect.bottom;
  const placeAbove = spaceAbove > popoverHeight || spaceAbove > spaceBelow;

  let top = placeAbove
    ? anchorRect.top + window.scrollY - popoverHeight - 8
    : anchorRect.bottom + window.scrollY + 8;

  let left = anchorRect.left + window.scrollX;
  // Clamp horizontally so the popover doesn't overflow right edge
  if (left + popoverWidth > viewportW - 8) {
    left = viewportW - popoverWidth - 8;
  }
  if (left < 8) left = 8;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      onSave(localValue);
    }
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9990]"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Popover panel */}
      <div
        role="dialog"
        aria-label={`Edit ${formatLabel(path)}`}
        className="absolute z-[9995] rounded-xl border shadow-2xl"
        style={{
          top,
          left,
          width: popoverWidth,
          background: "#1a1a1a",
          borderColor: "rgba(217,134,41,0.3)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(217,134,41,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/[0.07]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-500/80">
            {formatLabel(path)}
          </span>
          <button
            onClick={onCancel}
            className="text-white/30 hover:text-white/70 transition-colors text-xs leading-none"
            aria-label="Cancel"
          >
            ✕
          </button>
        </div>

        {/* Input */}
        <div className="px-4 pt-3 pb-3">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="Enter value…"
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="Enter value…"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <button
            onClick={() => onSave(localValue)}
            className="flex-1 rounded-lg bg-[#d98629] px-3 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
          >
            Save Field
          </button>
          <button
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition-colors hover:text-white hover:border-white/20"
          >
            Cancel
          </button>
          {!multiline && (
            <span className="text-[9px] text-white/20 ml-auto">↵ to save</span>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

// ─── EditableText ─────────────────────────────────────────────────────────────

interface EditableTextProps {
  path: string;
  fallback: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  multiline?: boolean;
  children?: React.ReactNode;
}

export function EditableText({
  path,
  fallback,
  as: Tag = "span",
  className,
  multiline = false,
  children,
}: EditableTextProps) {
  const cms = useCMS();
  const [isEditing, setIsEditing] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  // Resolve current value from CMS content or fall back to prop
  const value =
    cms.content
      ? getByPath(cms.content as unknown as Record<string, unknown>, path) || fallback
      : fallback;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!cms.editMode || !cms.isAdmin) return;
      e.stopPropagation();
      if (elementRef.current) {
        setAnchorRect(elementRef.current.getBoundingClientRect());
      }
      setIsEditing(true);
    },
    [cms.editMode, cms.isAdmin]
  );

  const handleSave = useCallback(
    (newValue: string) => {
      cms.updateContent(path, newValue);
      setIsEditing(false);
    },
    [cms, path]
  );

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  // When not admin — pure passthrough, zero overhead
  if (!cms.isAdmin) {
    return React.createElement(Tag, { className }, children ?? value);
  }

  const editStyles =
    cms.editMode
      ? {
          borderBottom: "2px solid rgba(245,158,11,0.6)",
          cursor: "text",
          display: "inline",
        }
      : {};

  return (
    <>
      {React.createElement(
        Tag,
        {
          ref: elementRef,
          className,
          style: editStyles,
          onClick: handleClick,
          title: cms.editMode ? `Edit: ${formatLabel(path)}` : undefined,
        },
        children ?? value
      )}

      {isEditing && anchorRect && (
        <EditPopover
          anchorRect={anchorRect}
          path={path}
          initialValue={typeof value === "string" ? value : fallback}
          multiline={multiline}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
