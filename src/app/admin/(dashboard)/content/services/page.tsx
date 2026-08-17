"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Loader2, Database, Pencil,
  ArrowUp, ArrowDown, Eye, EyeOff, Layers, Tag,
} from "lucide-react";
import { DEFAULT_SERVICES } from "./defaultServices";

interface CMSService {
  _id: string;
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  heroImage?: string;
  icon: string;
  tags: string[];
  order: number;
  visible: boolean;
}

function ServiceRow({
  service, isFirst, isLast,
  onEdit, onToggle, onDelete, onMoveUp, onMoveDown,
}: {
  service: CMSService; isFirst: boolean; isLast: boolean;
  onEdit: () => void; onToggle: () => void; onDelete: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
}) {
  return (
    <div className={`group flex items-center gap-4 bg-white border rounded-xl px-4 py-3 transition-all hover:shadow-sm ${
      service.visible ? "border-slate-200 hover:border-slate-300" : "border-slate-200 opacity-60"
    }`}>
      {/* Thumb */}
      <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
        {service.heroImage
          ? <img src={service.heroImage} alt={service.title} className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
          : <div className="w-full h-full flex items-center justify-center"><Layers size={14} className="text-slate-300" /></div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onEdit}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400">#{service.number}</span>
          <p className="text-sm font-semibold text-slate-800 truncate">{service.title}</p>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-[11px] text-slate-400"><Layers size={9} />{service.icon}</span>
          {service.tags.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400 truncate"><Tag size={9} />{service.tags.join(", ")}</span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 truncate w-64 shrink-0 hidden lg:block">{service.shortDescription}</p>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <button onClick={onMoveUp} disabled={isFirst}
            className="w-5 h-5 flex items-center justify-center rounded text-slate-300 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-20 transition-all">
            <ArrowUp size={10} />
          </button>
          <button onClick={onMoveDown} disabled={isLast}
            className="w-5 h-5 flex items-center justify-center rounded text-slate-300 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-20 transition-all">
            <ArrowDown size={10} />
          </button>
        </div>
        <button onClick={onEdit}
          className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-all border border-slate-200">
          <Pencil size={10} /> Edit
        </button>
        <button onClick={onToggle}
          className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
            service.visible ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
          }`}>
          {service.visible ? <Eye size={10} /> : <EyeOff size={10} />}
          {service.visible ? "Live" : "Hidden"}
        </button>
        <button onClick={onDelete}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default function ServicesAdminPage() {
  const router = useRouter();
  const [services, setServices] = useState<CMSService[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/services?all=true");
      if (res.ok) {
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  async function toggleVisible(service: CMSService) {
    const next = !service.visible;
    setServices((prev) => prev.map((s) => s._id === service._id ? { ...s, visible: next } : s));
    await fetch(`/api/cms/services/${service._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: next }),
    });
  }

  async function handleDelete(service: CMSService) {
    if (!confirm(`Delete "${service.title}"?`)) return;
    const res = await fetch(`/api/cms/services/${service._id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      setServices((prev) => prev.filter((s) => s._id !== service._id));
    } else {
      toast.error("Failed to delete");
    }
  }

  async function move(service: CMSService, dir: "up" | "down") {
    const sorted = [...services].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s._id === service._id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    setServices((prev) => prev.map((s) => {
      if (s._id === a._id) return { ...s, order: b.order };
      if (s._id === b._id) return { ...s, order: a.order };
      return s;
    }));
    await Promise.all([
      fetch(`/api/cms/services/${a._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: b.order }) }),
      fetch(`/api/cms/services/${b._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }) }),
    ]);
  }

  async function handleSeed() {
    if (!confirm(`Seed ${DEFAULT_SERVICES.length} default services?`)) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/cms/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_SERVICES),
      });
      if (res.ok) {
        const { inserted } = await res.json();
        toast.success(`Seeded ${inserted} services`);
        loadServices();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Seed failed");
      }
    } finally {
      setSeeding(false);
    }
  }

  const sorted = [...services].sort((a, b) => a.order - b.order);
  const visibleCount = sorted.filter((s) => s.visible).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-0.5">Pages</p>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Services</h1>
          </div>
          <div className="flex items-center gap-2">
            {services.length === 0 && !loading && (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="flex items-center gap-2 text-slate-600 text-xs font-medium px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-40"
              >
                {seeding ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
                {seeding ? "Seeding…" : "Seed Defaults"}
              </button>
            )}
            <button
              onClick={() => router.push("/admin/content/services/new")}
              className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-[0.12em] px-5 py-2.5 rounded-full transition-all hover:opacity-90"
              style={{ background: "#d98629" }}
            >
              <Plus size={12} /> Add Service
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">

        {/* Stats row */}
        {services.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: "Total Services", value: services.length, color: "text-slate-700", bg: "bg-white" },
              { label: "Live", value: visibleCount, color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} border border-slate-200 rounded-xl px-5 py-4`}>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={20} className="animate-spin text-slate-400" />
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Layers size={28} className="text-slate-400" />
            </div>
            <p className="text-slate-700 text-sm font-semibold mb-1">No services yet</p>
            <p className="text-slate-400 text-xs mb-6">Seed the default services or create your own</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="flex items-center gap-2 text-slate-600 text-xs font-medium px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-40"
              >
                {seeding ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
                {seeding ? "Seeding…" : `Seed ${DEFAULT_SERVICES.length} Defaults`}
              </button>
              <button
                onClick={() => router.push("/admin/content/services/new")}
                className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-[0.12em] px-5 py-2 rounded-full"
                style={{ background: "#d98629" }}
              >
                <Plus size={12} /> Add Service
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((service, idx) => (
              <ServiceRow
                key={service._id}
                service={service}
                isFirst={idx === 0}
                isLast={idx === sorted.length - 1}
                onEdit={() => router.push(`/admin/content/services/${service._id}`)}
                onToggle={() => toggleVisible(service)}
                onDelete={() => handleDelete(service)}
                onMoveUp={() => move(service, "up")}
                onMoveDown={() => move(service, "down")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
