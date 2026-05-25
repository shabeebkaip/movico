"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { CMSContent, CMSDesign } from "@/lib/cms/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split(".");
  const result = structuredClone(obj);
  let cursor: Record<string, unknown> = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (
      cursor[key] === null ||
      cursor[key] === undefined ||
      typeof cursor[key] !== "object"
    ) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return result;
}

// ─── Context shape ────────────────────────────────────────────────────────────

interface CMSContextValue {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  content: CMSContent | null;
  design: CMSDesign | null;
  updateContent: (path: string, value: unknown) => void;
  updateDesign: (path: string, value: unknown) => void;
  pendingContentChanges: number;
  pendingDesignChanges: number;
  saveContent: () => Promise<void>;
  saveDesign: () => Promise<void>;
  isSaving: boolean;
}

const CMSContext = createContext<CMSContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState<CMSContent | null>(null);
  const [design, setDesign] = useState<CMSDesign | null>(null);
  const [pendingContentChanges, setPendingContentChanges] = useState(0);
  const [pendingDesignChanges, setPendingDesignChanges] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Keep the latest content/design in refs for save callbacks
  const contentRef = useRef<CMSContent | null>(null);
  const designRef = useRef<CMSDesign | null>(null);
  contentRef.current = content;
  designRef.current = design;

  // ─── Mount: check auth + load data ──────────────────────────────────────────

  useEffect(() => {
    async function init() {
      try {
        const [contentRes, designRes] = await Promise.all([
          fetch("/api/cms/content"),
          fetch("/api/cms/design"),
        ]);

        if (contentRes.status === 401) {
          setIsAdmin(false);
          return;
        }

        if (contentRes.ok) {
          const contentData = (await contentRes.json()) as CMSContent;
          setContent(contentData);
          // Don't show admin UI when rendered inside a preview iframe
          const inIframe = typeof window !== "undefined" && window.self !== window.top;
          if (!inIframe) setIsAdmin(true);
        }

        if (designRes.ok) {
          const designData = (await designRes.json()) as CMSDesign;
          setDesign(designData);
        }
      } catch {
        setIsAdmin(false);
      }
    }
    void init();
  }, []);

  // ─── updateContent ───────────────────────────────────────────────────────────

  const updateContent = useCallback((path: string, value: unknown) => {
    setContent((prev) => {
      if (!prev) return prev;
      return setByPath(
        prev as unknown as Record<string, unknown>,
        path,
        value
      ) as unknown as CMSContent;
    });
    setPendingContentChanges((n) => n + 1);
  }, []);

  // ─── updateDesign ────────────────────────────────────────────────────────────

  const updateDesign = useCallback((path: string, value: unknown) => {
    setDesign((prev) => {
      if (!prev) return prev;
      return setByPath(
        prev as unknown as Record<string, unknown>,
        path,
        value
      ) as unknown as CMSDesign;
    });
    setPendingDesignChanges((n) => n + 1);
  }, []);

  // ─── saveContent ─────────────────────────────────────────────────────────────

  const saveContent = useCallback(async () => {
    if (!contentRef.current) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/cms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentRef.current),
      });
      if (!res.ok) throw new Error("Save failed");
      setPendingContentChanges(0);
      toast.success("Content saved successfully");
    } catch {
      toast.error("Failed to save content");
    } finally {
      setIsSaving(false);
    }
  }, []);

  // ─── saveDesign ──────────────────────────────────────────────────────────────

  const saveDesign = useCallback(async () => {
    if (!designRef.current) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/cms/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(designRef.current),
      });
      if (!res.ok) throw new Error("Save failed");
      setPendingDesignChanges(0);
      toast.success("Design saved successfully");
    } catch {
      toast.error("Failed to save design");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const value: CMSContextValue = {
    isAdmin,
    editMode,
    setEditMode,
    content,
    design,
    updateContent,
    updateDesign,
    pendingContentChanges,
    pendingDesignChanges,
    saveContent,
    saveDesign,
    isSaving,
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCMS(): CMSContextValue {
  const ctx = useContext(CMSContext);
  if (!ctx) {
    // Return a safe no-op value when used outside provider (e.g. during SSR)
    return {
      isAdmin: false,
      editMode: false,
      setEditMode: () => {},
      content: null,
      design: null,
      updateContent: () => {},
      updateDesign: () => {},
      pendingContentChanges: 0,
      pendingDesignChanges: 0,
      saveContent: async () => {},
      saveDesign: async () => {},
      isSaving: false,
    };
  }
  return ctx;
}
