"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Users, Database, X, Save, Check, Pencil } from "lucide-react";
import { CloudinaryUploader } from "@/components/cms/CloudinaryUploader";
import { DEFAULT_CLIENTS } from "./defaultClients";

interface CMSClient {
  _id: string;
  name: string;
  logo: string;
  whiteBg?: boolean;
  order: number;
  visible: boolean;
}

const inputCls =
  "w-full bg-[#1a1a1a] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-[#d98629] focus:outline-none transition-colors";

function ClientCard({
  client, isFirst, isLast,
  onEdit, onToggle, onDelete, onMoveUp, onMoveDown,
}: {
  client: CMSClient;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="group relative bg-[#111111] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-all duration-200">
      {/* Logo area — white bg so all logos are clearly visible */}
      <div className="relative flex items-center justify-center px-5 py-7 bg-white" style={{ minHeight: 108 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={client.logo}
          alt={client.name}
          className="max-h-14 w-auto max-w-[80%] object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />

        {/* Hover action overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="w-8 h-8 bg-[#d98629] rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 bg-white/10 hover:bg-red-500/80 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Reorder arrows — top-left on hover */}
        <div className="absolute top-2 left-2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="w-5 h-5 bg-black/50 hover:bg-black/80 rounded flex items-center justify-center text-white/70 disabled:opacity-20 transition-all text-[10px] leading-none"
          >↑</button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="w-5 h-5 bg-black/50 hover:bg-black/80 rounded flex items-center justify-center text-white/70 disabled:opacity-20 transition-all text-[10px] leading-none"
          >↓</button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2.5 border-t border-white/[0.05]">
        <p className={`text-[11px] font-medium truncate mr-2 ${client.visible ? "text-white/70" : "text-white/25"}`}>
          {client.name}
        </p>
        {/* Visibility toggle */}
        <button
          onClick={onToggle}
          className={`shrink-0 relative w-8 h-4 rounded-full transition-all duration-200 ${
            client.visible ? "bg-[#d98629]" : "bg-white/10"
          }`}
        >
          <span
            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all duration-200 ${
              client.visible ? "left-[18px]" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default function ClientsAdminPage() {
  const [clients, setClients] = useState<CMSClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [editTarget, setEditTarget] = useState<CMSClient | null>(null);
  const [saving, setSaving] = useState(false);
  const [formName, setFormName] = useState("");
  const [formLogo, setFormLogo] = useState("");
  const [formWhiteBg, setFormWhiteBg] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/clients?all=true");
      if (res.ok) {
        const data = await res.json();
        setClients(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditTarget(null);
    setFormName("");
    setFormLogo("");
    setFormWhiteBg(false);
    setShowPanel(true);
  }

  function openEdit(client: CMSClient) {
    setEditTarget(client);
    setFormName(client.name);
    setFormLogo(client.logo);
    setFormWhiteBg(client.whiteBg ?? false);
    setShowPanel(true);
  }

  async function handleSave() {
    if (!formName.trim() || !formLogo.trim()) {
      toast.error("Name and logo are required");
      return;
    }
    setSaving(true);
    try {
      if (editTarget) {
        const res = await fetch(`/api/cms/clients/${editTarget._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName, logo: formLogo, whiteBg: formWhiteBg }),
        });
        if (res.ok) {
          toast.success("Client updated");
          setClients((prev) =>
            prev.map((c) =>
              c._id === editTarget._id ? { ...c, name: formName, logo: formLogo, whiteBg: formWhiteBg } : c
            )
          );
          setShowPanel(false);
        } else {
          toast.error("Failed to update");
        }
      } else {
        const nextOrder = clients.length > 0 ? Math.max(...clients.map((c) => c.order)) + 1 : 0;
        const res = await fetch("/api/cms/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName, logo: formLogo, whiteBg: formWhiteBg, order: nextOrder, visible: true }),
        });
        if (res.ok) {
          const created = await res.json();
          toast.success("Client added");
          setClients((prev) => [...prev, created]);
          setShowPanel(false);
        } else {
          toast.error("Failed to add client");
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(client: CMSClient) {
    const next = !client.visible;
    setClients((prev) => prev.map((c) => c._id === client._id ? { ...c, visible: next } : c));
    await fetch(`/api/cms/clients/${client._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: next }),
    });
  }

  async function handleDelete(client: CMSClient) {
    if (!confirm(`Remove "${client.name}"?`)) return;
    const res = await fetch(`/api/cms/clients/${client._id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Removed");
      setClients((prev) => prev.filter((c) => c._id !== client._id));
    } else {
      toast.error("Failed to delete");
    }
  }

  async function move(client: CMSClient, dir: "up" | "down") {
    const sorted = [...clients].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((c) => c._id === client._id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    setClients((prev) =>
      prev.map((c) => {
        if (c._id === a._id) return { ...c, order: b.order };
        if (c._id === b._id) return { ...c, order: a.order };
        return c;
      })
    );
    await Promise.all([
      fetch(`/api/cms/clients/${a._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: b.order }) }),
      fetch(`/api/cms/clients/${b._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }) }),
    ]);
  }

  async function handleSeed() {
    if (!confirm("Seed all 39 default clients?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/cms/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_CLIENTS),
      });
      if (res.ok) {
        const { inserted } = await res.json();
        toast.success(`Seeded ${inserted} clients`);
        load();
      } else {
        const err = await res.json();
        toast.error(err.error || "Seed failed");
      }
    } finally {
      setSeeding(false);
    }
  }

  const sorted = [...clients].sort((a, b) => a.order - b.order);
  const visibleCount = sorted.filter((c) => c.visible).length;

  return (
    <div className="p-8 container mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 mb-1">Pages</p>
          <h1 className="text-white font-bold text-xl" style={{ fontFamily: "Satoshi, sans-serif" }}>
            Clients
          </h1>
          <p className="text-white/40 text-xs mt-0.5">
            {clients.length > 0
              ? `${clients.length} total · ${visibleCount} visible in marquee`
              : "Manage client logos shown in the marquee section"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {clients.length === 0 && !loading && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 text-white/60 hover:text-white text-xs uppercase tracking-[0.12em] px-4 py-2.5 rounded-full border border-white/10 hover:border-white/20 transition-all disabled:opacity-40"
            >
              {seeding ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
              {seeding ? "Seeding…" : "Seed Defaults"}
            </button>
          )}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded-full"
            style={{ background: "#d98629" }}
          >
            <Plus size={12} />
            Add Client
          </button>
        </div>
      </div>

      {/* Grid / states */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={20} className="animate-spin text-white/30" />
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-16 text-center">
          <Users size={32} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-sm mb-1">No clients yet</p>
          <p className="text-white/20 text-xs mb-6">Seed all 39 defaults or add manually</p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 mx-auto text-black font-bold text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded-full"
            style={{ background: "#d98629" }}
          >
            {seeding ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
            {seeding ? "Seeding…" : "Seed 39 Defaults"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-3">
          {sorted.map((client, idx) => (
            <ClientCard
              key={client._id}
              client={client}
              isFirst={idx === 0}
              isLast={idx === sorted.length - 1}
              onEdit={() => openEdit(client)}
              onToggle={() => toggleVisible(client)}
              onDelete={() => handleDelete(client)}
              onMoveUp={() => move(client, "up")}
              onMoveDown={() => move(client, "down")}
            />
          ))}
        </div>
      )}

      {/* Add / Edit panel */}
      {showPanel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPanel(false)} />
          <div className="relative ml-auto w-full max-w-sm bg-[#111111] border-l border-white/[0.06] flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <h2 className="text-white font-semibold text-sm">{editTarget ? "Edit Client" : "Add Client"}</h2>
              <button onClick={() => setShowPanel(false)} className="text-white/30 hover:text-white"><X size={16} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <CloudinaryUploader
                resourceType="image"
                folder="movico/clients"
                label="Upload Logo"
                currentUrl={formLogo || undefined}
                onUpload={({ url }) => setFormLogo(url)}
              />
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Or paste URL / path</label>
                <input
                  className={inputCls}
                  value={formLogo}
                  onChange={(e) => setFormLogo(e.target.value)}
                  placeholder="/clients/logo.png or https://..."
                />
              </div>
              {formLogo && (
                <div className={`h-24 rounded-xl flex items-center justify-center border ${
                  formWhiteBg ? "bg-white border-white/20" : "bg-[#0a0a0a] border-white/[0.06]"
                }`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formLogo} alt="preview" className="max-h-16 max-w-[80%] object-contain" />
                </div>
              )}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Client Name</label>
                <input
                  className={inputCls}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Saudi Aramco"
                />
              </div>
              <div className="flex items-center justify-between py-3 border-t border-white/[0.06]">
                <div>
                  <p className="text-white text-sm font-medium">White Background</p>
                  <p className="text-white/30 text-xs mt-0.5">For dark logos on the live site marquee</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormWhiteBg((v) => !v)}
                  className={`relative w-10 h-5 rounded-full transition-all duration-200 ${formWhiteBg ? "bg-[#d98629]" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${formWhiteBg ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/[0.06]">
              <button
                onClick={handleSave}
                disabled={saving || !formName.trim() || !formLogo.trim()}
                className="w-full flex items-center justify-center gap-2 text-black font-bold text-xs uppercase tracking-[0.15em] py-3 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#d98629" }}
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : editTarget ? <Check size={12} /> : <Save size={12} />}
                {saving ? "Saving…" : editTarget ? "Save Changes" : "Add Client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
