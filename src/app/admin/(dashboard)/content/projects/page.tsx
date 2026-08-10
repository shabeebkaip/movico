"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Loader2, FolderOpen, Database, Pencil,
  ArrowUp, ArrowDown, Star, Eye, EyeOff, LayoutGrid, List,
  MapPin, Calendar, Tag,
} from "lucide-react";
import { DEFAULT_PROJECTS } from "./defaultProjects";

interface CMSProject {
  _id: string;
  slug: string;
  number: string;
  client: string;
  title: string;
  category: string;
  location: string;
  year: string;
  shortDescription: string;
  coverImage: string;
  featured: boolean;
  order: number;
  visible: boolean;
}

// ─── Grid Card ────────────────────────────────────────────────────────────────

function GridCard({
  project, isFirst, isLast,
  onEdit, onToggle, onToggleFeatured, onDelete, onMoveUp, onMoveDown,
}: {
  project: CMSProject; isFirst: boolean; isLast: boolean;
  onEdit: () => void; onToggle: () => void; onToggleFeatured: () => void; onDelete: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
}) {
  return (
    <div className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-200 hover:shadow-md ${
      project.visible ? "border-slate-200 hover:border-slate-300" : "border-slate-200 opacity-60"
    }`}>
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer" onClick={onEdit}>
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <FolderOpen size={24} className="text-slate-300" />
            <span className="text-[11px] text-slate-400">No cover image</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover edit button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="flex items-center gap-2 bg-[#d98629] text-black text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            <Pencil size={11} /> Edit Project
          </button>
        </div>

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[10px] font-mono bg-black/50 text-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
            #{project.number}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFeatured(); }}
            title={project.featured ? "Shown on homepage — click to remove" : "Not on homepage — click to show"}
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
              project.featured
                ? "bg-[#d98629] text-black"
                : "bg-black/50 text-white/60 hover:text-white backdrop-blur-sm"
            }`}
          >
            <Star size={8} fill={project.featured ? "currentColor" : "none"} /> Homepage
          </button>
        </div>

        {/* Top-right reorder */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={isFirst}
            className="w-6 h-6 bg-black/50 hover:bg-black/80 backdrop-blur-sm rounded-md flex items-center justify-center text-white disabled:opacity-20 transition-all">
            <ArrowUp size={10} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={isLast}
            className="w-6 h-6 bg-black/50 hover:bg-black/80 backdrop-blur-sm rounded-md flex items-center justify-center text-white disabled:opacity-20 transition-all">
            <ArrowDown size={10} />
          </button>
        </div>

        {/* Category pill bottom-left */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[9px] uppercase tracking-[0.18em] bg-black/55 text-white/90 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {project.category}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={onEdit}>
          <p className="text-slate-900 text-sm font-semibold truncate leading-snug">{project.title}</p>
          <p className="text-slate-400 text-[11px] mt-0.5 truncate">
            {project.client} · {project.location} · {project.year}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={onToggle}
            className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
              project.visible
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
            }`}>
            {project.visible ? <Eye size={10} /> : <EyeOff size={10} />}
            {project.visible ? "Live" : "Hidden"}
          </button>
          <button onClick={onDelete}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── List Row ─────────────────────────────────────────────────────────────────

function ListRow({
  project, isFirst, isLast,
  onEdit, onToggle, onToggleFeatured, onDelete, onMoveUp, onMoveDown,
}: {
  project: CMSProject; isFirst: boolean; isLast: boolean;
  onEdit: () => void; onToggle: () => void; onToggleFeatured: () => void; onDelete: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
}) {
  return (
    <div className={`group flex items-center gap-4 bg-white border rounded-xl px-4 py-3 transition-all hover:shadow-sm ${
      project.visible ? "border-slate-200 hover:border-slate-300" : "border-slate-200 opacity-60"
    }`}>
      {/* Thumb */}
      <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
        {project.coverImage
          ? <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
          : <div className="w-full h-full flex items-center justify-center"><FolderOpen size={14} className="text-slate-300" /></div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onEdit}>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-800 truncate">{project.title}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFeatured(); }}
            title={project.featured ? "Shown on homepage — click to remove" : "Not on homepage — click to show"}
            className={`shrink-0 flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
              project.featured
                ? "bg-[#d98629]/10 text-[#d98629]"
                : "bg-slate-100 text-slate-400 hover:text-slate-600"
            }`}
          >
            <Star size={7} fill={project.featured ? "currentColor" : "none"} /> Homepage
          </button>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-[11px] text-slate-400"><Tag size={9} />{project.category}</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400"><MapPin size={9} />{project.location}</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400"><Calendar size={9} />{project.year}</span>
        </div>
      </div>

      {/* Client */}
      <p className="text-xs text-slate-500 truncate w-32 shrink-0 hidden lg:block">{project.client}</p>

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
            project.visible ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
          }`}>
          {project.visible ? <Eye size={10} /> : <EyeOff size={10} />}
          {project.visible ? "Live" : "Hidden"}
        </button>
        <button onClick={onDelete}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsAdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterCategory, setFilterCategory] = useState("All");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/projects?all=true");
      if (res.ok) {
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  async function toggleVisible(project: CMSProject) {
    const next = !project.visible;
    setProjects((prev) => prev.map((p) => p._id === project._id ? { ...p, visible: next } : p));
    await fetch(`/api/cms/projects/${project._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: next }),
    });
  }

  async function toggleFeatured(project: CMSProject) {
    const next = !project.featured;
    setProjects((prev) => prev.map((p) => p._id === project._id ? { ...p, featured: next } : p));
    await fetch(`/api/cms/projects/${project._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: next }),
    });
  }

  async function handleDelete(project: CMSProject) {
    if (!confirm(`Delete "${project.title}"?`)) return;
    const res = await fetch(`/api/cms/projects/${project._id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
    } else {
      toast.error("Failed to delete");
    }
  }

  async function move(project: CMSProject, dir: "up" | "down") {
    const sorted = [...projects].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((p) => p._id === project._id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    setProjects((prev) => prev.map((p) => {
      if (p._id === a._id) return { ...p, order: b.order };
      if (p._id === b._id) return { ...p, order: a.order };
      return p;
    }));
    await Promise.all([
      fetch(`/api/cms/projects/${a._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: b.order }) }),
      fetch(`/api/cms/projects/${b._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }) }),
    ]);
  }

  async function handleSeed() {
    if (!confirm("Seed 3 default projects?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/cms/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_PROJECTS),
      });
      if (res.ok) {
        const { inserted } = await res.json();
        toast.success(`Seeded ${inserted} projects`);
        loadProjects();
      } else {
        toast.error((await res.json()).error || "Seed failed");
      }
    } finally {
      setSeeding(false);
    }
  }

  const sorted = [...projects].sort((a, b) => a.order - b.order);
  const categories = ["All", ...Array.from(new Set(sorted.map((p) => p.category).filter(Boolean)))];
  const displayed = filterCategory === "All" ? sorted : sorted.filter((p) => p.category === filterCategory);
  const visibleCount = sorted.filter((p) => p.visible).length;
  const featuredCount = sorted.filter((p) => p.featured).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-0.5">Pages</p>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Projects</h1>
          </div>
          <div className="flex items-center gap-2">
            {projects.length === 0 && !loading && (
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
              onClick={() => router.push("/admin/content/projects/new")}
              className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-[0.12em] px-5 py-2.5 rounded-full transition-all hover:opacity-90"
              style={{ background: "#d98629" }}
            >
              <Plus size={12} /> Add Project
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">

        {/* Stats row */}
        {projects.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Projects", value: projects.length, color: "text-slate-700", bg: "bg-white" },
              { label: "Live", value: visibleCount, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "On Homepage", value: featuredCount, color: "text-[#d98629]", bg: "bg-[#d98629]/5" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} border border-slate-200 rounded-xl px-5 py-4`}>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter + view toggle bar */}
        {projects.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            {/* Category filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                    filterCategory === cat
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {cat}{cat !== "All" && ` (${sorted.filter(p => p.category === cat).length})`}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 gap-0.5">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-md transition-all ${view === "grid" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-md transition-all ${view === "list" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}
              >
                <List size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={20} className="animate-spin text-slate-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={28} className="text-slate-400" />
            </div>
            <p className="text-slate-700 text-sm font-semibold mb-1">No projects yet</p>
            <p className="text-slate-400 text-xs mb-6">Seed the 3 default projects or create your own</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="flex items-center gap-2 text-slate-600 text-xs font-medium px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-40"
              >
                {seeding ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
                {seeding ? "Seeding…" : "Seed 3 Defaults"}
              </button>
              <button
                onClick={() => router.push("/admin/content/projects/new")}
                className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-[0.12em] px-5 py-2 rounded-full"
                style={{ background: "#d98629" }}
              >
                <Plus size={12} /> Add Project
              </button>
            </div>
          </div>
        ) : displayed.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <p className="text-slate-500 text-sm">No projects in this category</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayed.map((project, idx) => (
              <GridCard
                key={project._id}
                project={project}
                isFirst={idx === 0}
                isLast={idx === displayed.length - 1}
                onEdit={() => router.push(`/admin/content/projects/${project._id}`)}
                onToggle={() => toggleVisible(project)}
                onToggleFeatured={() => toggleFeatured(project)}
                onDelete={() => handleDelete(project)}
                onMoveUp={() => move(project, "up")}
                onMoveDown={() => move(project, "down")}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {displayed.map((project, idx) => (
              <ListRow
                key={project._id}
                project={project}
                isFirst={idx === 0}
                isLast={idx === displayed.length - 1}
                onEdit={() => router.push(`/admin/content/projects/${project._id}`)}
                onToggle={() => toggleVisible(project)}
                onToggleFeatured={() => toggleFeatured(project)}
                onDelete={() => handleDelete(project)}
                onMoveUp={() => move(project, "up")}
                onMoveDown={() => move(project, "down")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
