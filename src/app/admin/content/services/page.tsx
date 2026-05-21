"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Loader2, Plus, Trash2, Edit2, X, GripVertical } from "lucide-react";

interface ServiceItem {
  number: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
}

interface ServicesContent {
  label: string;
  headingLine1: string;
  headingHighlight: string;
  subheading: string;
  items: ServiceItem[];
}

interface CMSContent {
  global: Record<string, unknown>;
  home: {
    services: ServicesContent;
    [key: string]: unknown;
  };
  about: Record<string, unknown>;
  contact: Record<string, unknown>;
}

const inputCls =
  "w-full bg-[#1a1a1a] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-[#d98629] focus:outline-none transition-colors";
const textareaCls =
  "w-full bg-[#1a1a1a] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-[#d98629] focus:outline-none transition-colors resize-none";

function TagInput({
  values,
  onChange,
}: {
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function addTag() {
    const t = input.trim();
    if (t && !values.includes(t)) onChange([...values, t]);
    setInput("");
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[28px]">
        {values.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1 text-[#d98629] text-xs px-2 py-0.5 rounded-full"
            style={{ background: "#d9862912", border: "1px solid #d9862930" }}
          >
            {tag}
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))}>
              <X size={9} className="text-[#d98629]/60 hover:text-[#d98629]" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className={inputCls + " flex-1"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
          placeholder="Add tag and press Enter…"
        />
        <button
          type="button"
          onClick={addTag}
          className="border border-white/10 text-white/50 text-xs px-3 py-2 rounded-lg hover:border-white/30 hover:text-white transition-all"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function ServicesContentPage() {
  const [content, setContent] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/cms/content")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setContent(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function updateField(field: keyof ServicesContent, value: string) {
    if (!content) return;
    setDirty(true);
    setContent({
      ...content,
      home: {
        ...content.home,
        services: { ...content.home.services, [field]: value },
      },
    });
  }

  function updateItems(items: ServiceItem[]) {
    if (!content) return;
    setDirty(true);
    setContent({
      ...content,
      home: {
        ...content.home,
        services: { ...content.home.services, items },
      },
    });
  }

  function updateItem(i: number, updated: Partial<ServiceItem>) {
    if (!content) return;
    const items = [...content.home.services.items];
    items[i] = { ...items[i], ...updated };
    updateItems(items);
  }

  function addService() {
    if (!content) return;
    const items = content.home.services.items;
    updateItems([
      ...items,
      {
        number: String(items.length + 1).padStart(2, "0"),
        icon: "Film",
        title: "New Service",
        description: "Service description goes here.",
        tags: [],
        href: "/services",
      },
    ]);
    setEditIdx(items.length);
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/cms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        toast.success("Services content saved");
        setDirty(false);
      } else {
        toast.error("Failed to save. Check authentication.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-white/30" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-8">
        <p className="text-white/40 text-sm">Failed to load content. Make sure the CMS API is running.</p>
      </div>
    );
  }

  const svc = content.home.services;

  return (
    <div className="p-8 container mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 mb-1">Pages</p>
          <h1 className="text-white font-bold text-xl" style={{ fontFamily: "Satoshi, sans-serif" }}>
            Services Content
          </h1>
          <p className="text-white/40 text-xs mt-0.5">
            Manage services section content and individual service items.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#d98629" }}
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          {saving ? "Saving…" : "Save Changes"}
          {dirty && !saving && <span className="w-1.5 h-1.5 rounded-full bg-black/40 ml-0.5" />}
        </button>
      </div>

      <div className="space-y-4">
        {/* Section headings */}
        <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
            <div className="w-1 h-4 rounded-full" style={{ background: "#d98629" }} />
            <p className="text-white font-semibold text-sm">Section Header</p>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Label</label>
            <input className={inputCls} value={svc.label} onChange={(e) => updateField("label", e.target.value)} placeholder="e.g. What We Do" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Heading Line 1</label>
              <input className={inputCls} value={svc.headingLine1} onChange={(e) => updateField("headingLine1", e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Heading Highlight</label>
              <input className={inputCls} value={svc.headingHighlight} onChange={(e) => updateField("headingHighlight", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Subheading</label>
            <input className={inputCls} value={svc.subheading} onChange={(e) => updateField("subheading", e.target.value)} />
          </div>
        </div>

        {/* Services list */}
        <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: "#d98629" }} />
              <p className="text-white font-semibold text-sm">Service Items</p>
              <span className="text-xs text-white/30 bg-white/[0.06] px-2 py-0.5 rounded-full">
                {svc.items.length}
              </span>
            </div>
            <button
              type="button"
              onClick={addService}
              className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-[0.1em] px-4 py-2 rounded-full transition-all"
              style={{ background: "#d98629" }}
            >
              <Plus size={11} /> Add Service
            </button>
          </div>

          {svc.items.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/[0.08] rounded-xl">
              <p className="text-white/30 text-sm mb-2">No services yet</p>
              <p className="text-white/20 text-xs">Click "Add Service" to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {svc.items.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center gap-3 p-3.5 bg-[#1a1a1a] rounded-xl border border-white/[0.06] hover:border-white/[0.10] transition-all">
                    <GripVertical size={12} className="text-white/20 shrink-0" />
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{ background: "#d9862918", color: "#d98629" }}
                    >
                      {item.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.title}</p>
                      <p className="text-white/40 text-xs truncate mt-0.5">{item.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {item.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] text-white/40 bg-white/[0.05] px-1.5 py-0.5 rounded-full">{t}</span>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="text-[10px] text-white/30">+{item.tags.length - 2}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        type="button"
                        onClick={() => setEditIdx(editIdx === i ? null : i)}
                        className="p-2 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]"
                      >
                        {editIdx === i ? <X size={13} /> : <Edit2 size={13} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => { updateItems(svc.items.filter((_, idx) => idx !== i)); if (editIdx === i) setEditIdx(null); }}
                        className="p-2 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/[0.06]"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {editIdx === i && (
                    <div className="mt-2 p-5 bg-[#161616] rounded-xl border border-white/[0.06] space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Number</label>
                          <input className={inputCls + " text-center"} value={item.number} onChange={(e) => updateItem(i, { number: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Icon (Lucide)</label>
                          <input className={inputCls} value={item.icon} onChange={(e) => updateItem(i, { icon: e.target.value })} placeholder="Film" />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Href</label>
                          <input className={inputCls} value={item.href} onChange={(e) => updateItem(i, { href: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Title</label>
                        <input className={inputCls} value={item.title} onChange={(e) => updateItem(i, { title: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Description</label>
                        <textarea className={textareaCls} rows={3} value={item.description} onChange={(e) => updateItem(i, { description: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Tags</label>
                        <TagInput
                          values={item.tags}
                          onChange={(tags) => updateItem(i, { tags })}
                        />
                      </div>
                      <div className="flex justify-end pt-2 border-t border-white/[0.06]">
                        <button
                          type="button"
                          onClick={() => setEditIdx(null)}
                          className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-[0.1em] px-4 py-2 rounded-full"
                          style={{ background: "#d98629" }}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
