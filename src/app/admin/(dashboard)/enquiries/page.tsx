"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Inbox,
  Mail,
  Phone,
  Building2,
  Briefcase,
  DollarSign,
  MessageSquare,
  Trash2,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

type EnquiryStatus = "new" | "viewed" | "archived";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget: string;
  message?: string;
  status: EnquiryStatus;
  createdAt: string;
}

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  new:      "bg-amber-50 text-amber-600 border-amber-200",
  viewed:   "bg-blue-50 text-blue-600 border-blue-200",
  archived: "bg-slate-100 text-slate-400 border-slate-200",
};

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new:      "New",
  viewed:   "Viewed",
  archived: "Archived",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<EnquiryStatus | "all">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/enquiries");
      if (res.ok) setEnquiries(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function markViewed(id: string) {
    await fetch(`/api/cms/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "viewed" }),
    });
    setEnquiries((prev) => prev.map((e) => e._id === id ? { ...e, status: "viewed" } : e));
  }

  async function archive(id: string) {
    await fetch(`/api/cms/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "archived" }),
    });
    setEnquiries((prev) => prev.map((e) => e._id === id ? { ...e, status: "archived" } : e));
  }

  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/cms/enquiries/${id}`, { method: "DELETE" });
    setEnquiries((prev) => prev.filter((e) => e._id !== id));
    toast.success("Enquiry deleted");
  }

  function toggleExpand(id: string, status: EnquiryStatus) {
    setExpanded((prev) => prev === id ? null : id);
    if (status === "new") markViewed(id);
  }

  const counts = {
    all:      enquiries.length,
    new:      enquiries.filter((e) => e.status === "new").length,
    viewed:   enquiries.filter((e) => e.status === "viewed").length,
    archived: enquiries.filter((e) => e.status === "archived").length,
  };

  const filtered = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-1">CMS</p>
          <h1 className="text-slate-900 font-bold text-xl">Enquiries</h1>
          <p className="text-slate-500 text-xs mt-0.5">All contact form submissions</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:border-slate-300 transition-all"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 w-fit">
        {(["all", "new", "viewed", "archived"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 capitalize ${
              filter === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "new" && counts.new > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold">
                {counts.new}
              </span>
            )}
            {tab === "all" ? `All (${counts.all})` : `${STATUS_LABELS[tab as EnquiryStatus]} (${counts[tab]})`}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-24 bg-white border border-slate-200 rounded-xl">
          <Inbox size={32} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium text-sm">No enquiries yet</p>
          <p className="text-slate-400 text-xs mt-1">Submissions from the contact form will appear here.</p>
        </div>
      )}

      {/* Enquiry list */}
      <div className="space-y-2">
        {filtered.map((enq) => (
          <div
            key={enq._id}
            className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
              enq.status === "new" ? "border-amber-200" : "border-slate-200"
            }`}
          >
            {/* Row */}
            <button
              onClick={() => toggleExpand(enq._id, enq.status)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              {/* Status dot */}
              <div className={`w-2 h-2 rounded-full shrink-0 ${enq.status === "new" ? "bg-amber-400" : enq.status === "viewed" ? "bg-blue-400" : "bg-slate-300"}`} />

              {/* Name + company */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">{enq.name}</p>
                  {enq.company && <span className="text-xs text-slate-400 truncate hidden sm:block">· {enq.company}</span>}
                </div>
                <p className="text-xs text-slate-400 truncate">{enq.email}</p>
              </div>

              {/* Service chip */}
              <span className="hidden md:block shrink-0 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                {enq.service}
              </span>

              {/* Budget chip */}
              <span className="hidden lg:block shrink-0 text-xs text-slate-500 font-mono">
                {enq.budget}
              </span>

              {/* Status + time */}
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_STYLES[enq.status]}`}>
                  {STATUS_LABELS[enq.status]}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:block">{timeAgo(enq.createdAt)}</span>
              </div>

              {expanded === enq._id ? <ChevronDown size={14} className="text-slate-400 shrink-0" /> : <ChevronRight size={14} className="text-slate-400 shrink-0" />}
            </button>

            {/* Expanded detail */}
            {expanded === enq._id && (
              <div className="border-t border-slate-100 px-5 py-5 bg-slate-50">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                  <Detail icon={Mail}         label="Email"    value={<a href={`mailto:${enq.email}`} className="text-[#d98629] hover:underline">{enq.email}</a>} />
                  {enq.phone   && <Detail icon={Phone}       label="Phone"    value={enq.phone} />}
                  {enq.company && <Detail icon={Building2}   label="Company"  value={enq.company} />}
                  <Detail icon={Briefcase}    label="Service"  value={enq.service} />
                  <Detail icon={DollarSign}   label="Budget"   value={enq.budget} />
                  <Detail icon={Mail}         label="Received" value={new Date(enq.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} />
                </div>

                {enq.message && (
                  <div className="mb-5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <MessageSquare size={12} className="text-slate-400" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400">Message</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg px-4 py-3">
                      {enq.message}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {enq.status !== "archived" && (
                    <button
                      onClick={() => archive(enq._id)}
                      className="text-xs text-slate-500 hover:text-slate-900 border border-slate-200 bg-white rounded-lg px-3 py-1.5 hover:border-slate-300 transition-all"
                    >
                      Archive
                    </button>
                  )}
                  {enq.status === "archived" && (
                    <button
                      onClick={() => markViewed(enq._id)}
                      className="text-xs text-slate-500 hover:text-slate-900 border border-slate-200 bg-white rounded-lg px-3 py-1.5 hover:border-slate-300 transition-all"
                    >
                      Restore
                    </button>
                  )}
                  <a
                    href={`mailto:${enq.email}?subject=Re: Your Enquiry — Movico`}
                    className="text-xs text-white bg-[#d98629] hover:bg-[#c4771e] rounded-lg px-3 py-1.5 transition-all font-medium"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => remove(enq._id)}
                    className="ml-auto text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg p-1.5 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={11} className="text-slate-400" />
        <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400">{label}</span>
      </div>
      <p className="text-sm text-slate-800 font-medium">{value}</p>
    </div>
  );
}
