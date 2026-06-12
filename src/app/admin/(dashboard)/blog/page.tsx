"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff,
  Loader2, FileText, Calendar, Tag, BookOpen,
} from "lucide-react";

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  visible: boolean;
  featured: boolean;
  excerpt: string;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/blog?all=true");
      if (res.ok) setPosts(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleField(id: string, field: "visible" | "featured", current: boolean) {
    await fetch(`/api/cms/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !current }),
    });
    setPosts((p) => p.map((post) => post._id === id ? { ...post, [field]: !current } : post));
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/cms/blog/${id}`, { method: "DELETE" });
      setPosts((p) => p.filter((post) => post._id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Blog Posts</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {loading ? "Loading…" : `${posts.length} post${posts.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-[0.1em] transition-all hover:opacity-90"
          style={{ background: "#d98629", color: "black" }}
        >
          <Plus size={13} />
          New Post
        </Link>
      </div>

      {/* Content */}
      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={20} className="animate-spin text-slate-300" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <BookOpen size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-900 font-semibold mb-1">No blog posts yet</p>
            <p className="text-slate-400 text-sm mb-8">Write your first post to share insights with your audience.</p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-[0.1em] transition-all hover:opacity-90"
              style={{ background: "#d98629", color: "black" }}
            >
              <Plus size={13} /> Write First Post
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_140px_120px_110px_80px] gap-4 px-6 py-3.5 border-b border-slate-100 bg-slate-50">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-medium">Title</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-medium">Category</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-medium">Published</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-medium">Status</p>
              <span />
            </div>

            {posts.map((post, i) => (
              <div
                key={post._id}
                className={`grid grid-cols-[1fr_140px_120px_110px_80px] gap-4 items-center px-6 py-4 transition-colors hover:bg-slate-50 ${
                  i !== posts.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                {/* Title */}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{post.title}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">/blog/{post.slug}</p>
                </div>

                {/* Category */}
                <div className="flex items-center gap-1.5">
                  <Tag size={10} className="text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-500 truncate">{post.category || "—"}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5">
                  <Calendar size={10} className="text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-500">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleField(post._id, "visible", post.visible)}
                    title={post.visible ? "Published — click to hide" : "Hidden — click to publish"}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em] transition-all border ${
                      post.visible
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {post.visible ? <Eye size={9} /> : <EyeOff size={9} />}
                    {post.visible ? "Live" : "Draft"}
                  </button>
                  <button
                    onClick={() => toggleField(post._id, "featured", post.featured)}
                    title={post.featured ? "Featured — click to unfeature" : "Click to feature"}
                    className={`p-1 rounded transition-colors ${post.featured ? "text-[#d98629]" : "text-slate-300 hover:text-slate-500"}`}
                  >
                    {post.featured ? <Star size={13} fill="currentColor" /> : <StarOff size={13} />}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 justify-end">
                  <Link
                    href={`/admin/blog/${post._id}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                    title="Edit post"
                  >
                    <Pencil size={13} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id, post.title)}
                    disabled={deletingId === post._id}
                    className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                    title="Delete post"
                  >
                    {deletingId === post._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats footer when posts exist */}
        {!loading && posts.length > 0 && (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
              <FileText size={12} className="text-slate-400" />
              <span className="text-xs text-slate-500"><span className="font-semibold text-slate-700">{posts.length}</span> total</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
              <Eye size={12} className="text-emerald-500" />
              <span className="text-xs text-slate-500"><span className="font-semibold text-slate-700">{posts.filter((p) => p.visible).length}</span> published</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
              <Star size={12} className="text-[#d98629]" />
              <span className="text-xs text-slate-500"><span className="font-semibold text-slate-700">{posts.filter((p) => p.featured).length}</span> featured</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
