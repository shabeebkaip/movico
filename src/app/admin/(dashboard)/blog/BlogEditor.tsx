"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Trash2, ExternalLink, Eye, EyeOff, Info, AlertCircle } from "lucide-react";
import { CloudinaryUploader } from "@/components/cms/CloudinaryUploader";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  publishedAt: string;
  visible: boolean;
  featured: boolean;
  seo: { title: string; description: string; ogImage: string; noindex: boolean; canonical: string };
}

const BLANK: Omit<BlogPost, "_id"> = {
  slug: "", title: "", excerpt: "", content: "",
  coverImage: "", coverAlt: "", category: "", tags: [],
  author: "Movico", readTime: "", publishedAt: new Date().toISOString().split("T")[0],
  visible: false, featured: false,
  seo: { title: "", description: "", ogImage: "", noindex: false, canonical: "" },
};

// ─── Atoms ────────────────────────────────────────────────────────────────────

const labelCls = "block text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-1.5";
const inputCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:border-[#d98629] focus:outline-none transition-colors placeholder:text-slate-400";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <h3 className="text-slate-500 text-[11px] uppercase tracking-[0.2em] font-medium">{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ on, onToggle, label, sub }: { on: boolean; onToggle: () => void; label: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-slate-900 text-sm font-medium">{label}</p>
        {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative w-10 h-5 rounded-full transition-all duration-200 ${on ? "bg-[#d98629]" : "bg-slate-200"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${on ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

// ─── Char counter ─────────────────────────────────────────────────────────────

function charBar(len: number, max: number) {
  const pct = Math.min((len / max) * 100, 100);
  if (len === 0) return { w: "0%", c: "bg-slate-200" };
  if (len <= max * 0.75) return { w: `${pct}%`, c: "bg-emerald-400" };
  if (len <= max) return { w: `${pct}%`, c: "bg-amber-400" };
  return { w: "100%", c: "bg-red-400" };
}

function charColor(len: number, max: number) {
  if (len === 0) return "text-slate-400";
  if (len <= max * 0.75) return "text-emerald-600";
  if (len <= max) return "text-amber-600";
  return "text-red-500";
}

function CharInput({ label, hint, value, onChange, placeholder, maxLength }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; maxLength: number;
}) {
  const bar = charBar(value.length, maxLength);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label className={labelCls}>{label}</label>
        {hint && <span title={hint} className="text-slate-400 cursor-help"><Info size={11} /></span>}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${bar.c}`} style={{ width: bar.w }} />
        </div>
        <span className={`text-[11px] tabular-nums font-medium ${charColor(value.length, maxLength)}`}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

// ─── SERP preview ─────────────────────────────────────────────────────────────

function SerpPreview({ title, description, slug }: { title: string; description: string; slug: string }) {
  return (
    <div className="bg-slate-950 rounded-xl p-4 border border-slate-700">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-medium">Google Preview</p>
      <div style={{ fontFamily: "arial, sans-serif" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-[22px] h-[22px] rounded-full bg-slate-700 flex items-center justify-center shrink-0">
            <span className="text-[8px] font-bold text-white">M</span>
          </div>
          <div>
            <p className="text-[13px] text-[#e8eaed] leading-tight">Movico</p>
            <p className="text-[11px] text-[#bdc1c6] leading-tight">movicoksa.com › blog › {slug || "post-slug"}</p>
          </div>
        </div>
        <p className="text-[18px] text-[#8ab4f8] leading-snug line-clamp-1">{title || "Post Title"}</p>
        <p className="text-[13px] text-[#bdc1c6] leading-snug mt-1 line-clamp-2">
          {description || "Post description will appear here."}
        </p>
      </div>
    </div>
  );
}

// ─── Editor ───────────────────────────────────────────────────────────────────

export default function BlogEditor({ initialData, postId }: { initialData?: BlogPost; postId?: string }) {
  const router = useRouter();
  const isEdit = !!postId;

  const [form, setForm] = useState<Omit<BlogPost, "_id">>(
    initialData
      ? { ...BLANK, ...initialData, seo: { ...BLANK.seo, ...initialData.seo } }
      : BLANK
  );
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (initialData) setTagsInput(initialData.tags.join(", "));
  }, [initialData]);

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setSeo<K extends keyof typeof form.seo>(key: K, value: typeof form.seo[K]) {
    setForm((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));
  }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) };
      if (isEdit) {
        const res = await fetch(`/api/cms/blog/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        toast.success("Post updated");
      } else {
        const res = await fetch("/api/cms/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        toast.success("Post created");
        router.push(`/admin/blog/${created._id}`);
      }
    } catch {
      toast.error("Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!postId || !confirm(`Delete "${form.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/cms/blog/${postId}`, { method: "DELETE" });
      toast.success("Post deleted");
      router.push("/admin/blog");
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/blog")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs uppercase tracking-[0.15em] transition-colors"
          >
            <ArrowLeft size={13} />
            Blog
          </button>
          <span className="text-slate-200">/</span>
          <span className="text-slate-500 text-sm truncate max-w-xs">
            {form.title || (isEdit ? "Edit Post" : "New Post")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && form.slug && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-xs uppercase tracking-[0.12em] px-3 py-2 rounded-lg hover:bg-slate-100 transition-all"
            >
              <ExternalLink size={11} />
              View
            </a>
          )}
          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-xs uppercase tracking-[0.12em] px-3 py-2 rounded-lg hover:bg-red-50 transition-all disabled:opacity-40"
            >
              {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !form.title.trim() || !form.slug.trim()}
            className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-[0.15em] px-5 py-2 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ background: "#d98629" }}
          >
            {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Publish Post"}
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="p-8">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">

        {/* ── Left column ── */}
        <div className="space-y-6">

          {/* Basics */}
          <SectionCard title="Post">
            <div>
              <label className={labelCls}>Title</label>
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!isEdit) set("slug", autoSlug(e.target.value));
                }}
                placeholder="Why cinematography matters more than budget"
              />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input
                className={inputCls}
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="why-cinematography-matters"
              />
            </div>
            <div>
              <label className={labelCls}>Excerpt</label>
              <textarea
                className={inputCls}
                rows={2}
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="One-paragraph summary shown on the blog listing page…"
              />
            </div>
          </SectionCard>

          {/* Cover image */}
          <SectionCard title="Cover Image">
            <CloudinaryUploader
              resourceType="image"
              folder="movico/blog"
              label="Upload cover image"
              currentUrl={form.coverImage || undefined}
              onUpload={({ url }) => set("coverImage", url)}
            />
            {form.coverImage && (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverImage} alt={form.coverAlt} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <label className={labelCls}>Alt Text</label>
              <input
                className={inputCls}
                value={form.coverAlt}
                onChange={(e) => set("coverAlt", e.target.value)}
                placeholder="Describe the cover image for accessibility and SEO…"
              />
            </div>
          </SectionCard>

          {/* Content */}
          <SectionCard title="Content">
            <p className="text-slate-400 text-xs -mt-1">
              Write your article below. Supports basic HTML (headings, bold, italic, links, lists).
            </p>
            <textarea
              className={`${inputCls} font-mono text-xs leading-relaxed`}
              rows={24}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder={`<h2>Introduction</h2>\n<p>Your article content goes here...</p>\n\n<h2>Main Point</h2>\n<p>Continue writing...</p>`}
            />
          </SectionCard>

          {/* SEO */}
          <SectionCard title="SEO">
            <CharInput
              label="SEO Title"
              hint="Shown in Google. Leave empty to use the post title."
              value={form.seo.title}
              onChange={(v) => setSeo("title", v)}
              placeholder="Leave empty to use post title"
              maxLength={60}
            />
            <CharInput
              label="Meta Description"
              hint="The snippet shown in Google results. 120–160 characters ideal."
              value={form.seo.description}
              onChange={(v) => setSeo("description", v)}
              placeholder="Compelling description to improve click-through rate…"
              maxLength={160}
            />
            <div className="pt-1">
              <SerpPreview
                title={form.seo.title || form.title}
                description={form.seo.description || form.excerpt}
                slug={form.slug}
              />
            </div>
            <div>
              <label className={labelCls}>OG Image URL</label>
              <input
                className={inputCls}
                value={form.seo.ogImage}
                onChange={(e) => setSeo("ogImage", e.target.value)}
                placeholder="Leave empty to use cover image"
              />
            </div>
            <div>
              <label className={labelCls}>Canonical URL</label>
              <input
                className={inputCls}
                value={form.seo.canonical}
                onChange={(e) => setSeo("canonical", e.target.value)}
                placeholder="https://movicoksa.com/blog/..."
              />
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-slate-900 text-sm font-medium">Hide from search engines</p>
                <p className="text-slate-400 text-xs mt-0.5">Adds noindex, nofollow to this post</p>
              </div>
              <button
                type="button"
                onClick={() => setSeo("noindex", !form.seo.noindex)}
                className={`relative w-10 h-5 rounded-full transition-all duration-200 ${form.seo.noindex ? "bg-[#d98629]" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${form.seo.noindex ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
            {form.seo.noindex && (
              <p className="text-xs text-amber-500 flex items-center gap-1">
                <AlertCircle size={11} /> This post will not appear in Google search results.
              </p>
            )}
          </SectionCard>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-6 xl:sticky xl:top-6">

          {/* Status */}
          <SectionCard title="Status">
            <Toggle
              on={form.visible}
              onToggle={() => set("visible", !form.visible)}
              label="Published"
              sub="Show on the public blog"
            />
            {!form.visible && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
                <EyeOff size={11} /> Draft — not visible to visitors
              </div>
            )}
            {form.visible && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
                <Eye size={11} /> Live — visible on the blog
              </div>
            )}
            <div className="h-px bg-slate-100" />
            <Toggle
              on={form.featured}
              onToggle={() => set("featured", !form.featured)}
              label="Featured"
              sub="Highlight as a featured post"
            />
          </SectionCard>

          {/* Publish info */}
          <SectionCard title="Publish">
            <div>
              <label className={labelCls}>Publish Date</label>
              <input
                type="date"
                className={inputCls}
                value={form.publishedAt}
                onChange={(e) => set("publishedAt", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Author</label>
              <input
                className={inputCls}
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                placeholder="Movico"
              />
            </div>
            <div>
              <label className={labelCls}>Read Time</label>
              <input
                className={inputCls}
                value={form.readTime}
                onChange={(e) => set("readTime", e.target.value)}
                placeholder="5 min read"
              />
            </div>
          </SectionCard>

          {/* Taxonomy */}
          <SectionCard title="Taxonomy">
            <div>
              <label className={labelCls}>Category</label>
              <input
                className={inputCls}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Production, Strategy, Events…"
              />
            </div>
            <div>
              <label className={labelCls}>Tags (comma-separated)</label>
              <input
                className={inputCls}
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="video production, riyadh, saudi arabia"
              />
              {tagsInput.trim() && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tagsInput.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-[0.1em] border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
      </div>
    </div>
  );
}
