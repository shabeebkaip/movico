"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Loader2, FolderOpen, Database, Pencil,
  ArrowUp, ArrowDown, Star, Eye, EyeOff,
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

function ProjectCard({
  project, isFirst, isLast,
  onEdit, onToggle, onDelete, onMoveUp, onMoveDown,
}: {
  project: CMSProject;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
      project.visible
        ? "border-slate-200 hover:border-slate-300"
        : "border-slate-200 opacity-50 grayscale"
    }`}>
      {/* Cover image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-white/5" onClick={onEdit}>
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderOpen size={28} className="text-white/15" />
          </div>
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300" />

        {/* Hover actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="flex items-center gap-2 bg-[#d98629] text-black text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full hover:scale-105 transition-transform"
          >
            <Pencil size={11} />
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-8 h-8 bg-white/10 hover:bg-red-500/80 rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-500 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {project.number}
          </span>
          {project.featured && (
            <span className="flex items-center gap-1 text-[10px] bg-[#d98629]/90 text-black font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
              <Star size={8} fill="currentColor" />
              Featured
            </span>
          )}
        </div>

        {/* Top-right reorder */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            disabled={isFirst}
            className="w-6 h-6 bg-black/60 hover:bg-black/90 rounded-lg flex items-center justify-center text-slate-700 disabled:opacity-20 transition-all backdrop-blur-sm"
          >
            <ArrowUp size={11} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            disabled={isLast}
            className="w-6 h-6 bg-black/60 hover:bg-black/90 rounded-lg flex items-center justify-center text-slate-700 disabled:opacity-20 transition-all backdrop-blur-sm"
          >
            <ArrowDown size={11} />
          </button>
        </div>

        {/* Category pill — bottom left */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] uppercase tracking-[0.2em] bg-black/60 text-white/80 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {project.category}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white px-4 py-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1" onClick={onEdit}>
          <p className="text-slate-900 text-sm font-semibold leading-tight truncate">{project.title}</p>
          <p className="text-slate-400 text-[11px] mt-0.5 truncate">
            {project.client} · {project.location} · {project.year}
          </p>
        </div>

        {/* Visibility toggle */}
        <button
          onClick={onToggle}
          className={`shrink-0 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-lg transition-all duration-200 ${
            project.visible
              ? "text-[#d98629] bg-[#d98629]/[0.1] hover:bg-[#d98629]/20"
              : "text-slate-400 bg-white/[0.04] hover:bg-slate-100"
          }`}
        >
          {project.visible ? <Eye size={11} /> : <EyeOff size={11} />}
          {project.visible ? "Live" : "Hidden"}
        </button>
      </div>
    </div>
  );
}

export default function ProjectsAdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
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

  useEffect(() => { load(); }, [load]);

  async function toggleVisible(project: CMSProject) {
    const next = !project.visible;
    setProjects((prev) => prev.map((p) => p._id === project._id ? { ...p, visible: next } : p));
    await fetch(`/api/cms/projects/${project._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: next }),
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
    const a = sorted[idx];
    const b = sorted[swapIdx];
    setProjects((prev) =>
      prev.map((p) => {
        if (p._id === a._id) return { ...p, order: b.order };
        if (p._id === b._id) return { ...p, order: a.order };
        return p;
      })
    );
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
        load();
      } else {
        const err = await res.json();
        toast.error(err.error || "Seed failed");
      }
    } finally {
      setSeeding(false);
    }
  }

  const sorted = [...projects].sort((a, b) => a.order - b.order);
  const visibleCount = sorted.filter((p) => p.visible).length;

  return (
    <div className="p-8 container mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-1">Pages</p>
          <h1 className="text-slate-900 font-bold text-xl" style={{ fontFamily: "Satoshi, sans-serif" }}>
            Projects
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            {projects.length > 0
              ? `${projects.length} total · ${visibleCount} visible`
              : "Manage portfolio projects and case studies"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {projects.length === 0 && !loading && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 text-slate-500 hover:text-white text-xs uppercase tracking-[0.12em] px-4 py-2.5 rounded-full border border-slate-200 hover:border-slate-300 transition-all disabled:opacity-40"
            >
              {seeding ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
              {seeding ? "Seeding…" : "Seed Defaults"}
            </button>
          )}
          <button
            onClick={() => router.push("/admin/content/projects/new")}
            className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded-full"
            style={{ background: "#d98629" }}
          >
            <Plus size={12} />
            Add Project
          </button>
        </div>
      </div>

      {/* States */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={20} className="animate-spin text-slate-400" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center">
          <FolderOpen size={32} className="text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 text-sm mb-1">No projects yet</p>
          <p className="text-slate-400 text-xs mb-6">Seed the 3 default projects or add your own</p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 mx-auto text-black font-bold text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded-full"
            style={{ background: "#d98629" }}
          >
            {seeding ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
            {seeding ? "Seeding…" : "Seed 3 Defaults"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sorted.map((project, idx) => (
            <ProjectCard
              key={project._id}
              project={project}
              isFirst={idx === 0}
              isLast={idx === sorted.length - 1}
              onEdit={() => router.push(`/admin/content/projects/${project._id}`)}
              onToggle={() => toggleVisible(project)}
              onDelete={() => handleDelete(project)}
              onMoveUp={() => move(project, "up")}
              onMoveDown={() => move(project, "down")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
