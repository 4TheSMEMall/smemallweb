"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/lib/api";

const navItems = [
  { label: "Overview",      path: "/admin",              icon: <DashIcon /> },
  { label: "WIBG Pipeline", path: "/admin/wibg",         icon: <TrophyIcon /> },
  { label: "Users",         path: "/admin/users",        icon: <UsersIcon /> },
  { label: "Partners",      path: "/admin/partners",     icon: <BuildingIcon /> },
  { label: "Consultants",   path: "/admin/consultants",  icon: <StarIcon /> },
  { label: "Announcements", path: "/admin/content",      icon: <MegaphoneIcon /> },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  SUBMITTED:    { label: "Submitted",    color: "bg-blue-50 text-blue-700 border-blue-100" },
  UNDER_REVIEW: { label: "Under Review", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  TOP_20:       { label: "Top 20",       color: "bg-green-50 text-green-700 border-green-100" },
  TOP_6:        { label: "Top 6",        color: "bg-amber-50 text-amber-700 border-amber-100" },
  WINNER_1ST:   { label: "1st Place",    color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  WINNER_2ND:   { label: "2nd Place",    color: "bg-gray-50 text-gray-600 border-gray-100" },
  WINNER_3RD:   { label: "3rd Place",    color: "bg-orange-50 text-orange-700 border-orange-100" },
  REJECTED:     { label: "Rejected",     color: "bg-red-50 text-red-700 border-red-100" },
};

const PIPELINE_ACTIONS = [
  { status: "UNDER_REVIEW", label: "Mark Under Review",   color: "bg-indigo-600 hover:bg-indigo-700 text-white" },
  { status: "TOP_20",       label: "Shortlist — Top 20",  color: "bg-green-600 hover:bg-green-700 text-white" },
  { status: "TOP_6",        label: "Advance — Top 6",     color: "bg-amber-500 hover:bg-amber-600 text-white" },
  { status: "WINNER_1ST",   label: "Award 1st Place",     color: "bg-yellow-500 hover:bg-yellow-600 text-white" },
  { status: "WINNER_2ND",   label: "Award 2nd Place",     color: "bg-gray-500 hover:bg-gray-600 text-white" },
  { status: "WINNER_3RD",   label: "Award 3rd Place",     color: "bg-orange-500 hover:bg-orange-600 text-white" },
  { status: "REJECTED",     label: "Reject Application",  color: "bg-red-600 hover:bg-red-700 text-white" },
];

interface Application {
  id: string;
  founderName: string;
  founderEmail: string;
  founderPhone: string;
  businessName: string;
  cacStatus: string;
  cacNumber?: string;
  problem: string;
  solution: string;
  market: string;
  traction: string;
  revenue3m: number;
  proj12m: number;
  bizStage: string;
  bhcRef?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const id     = params?.id as string;

  const [app, setApp]         = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [notes, setNotes]     = useState("");
  const [toast, setToast]     = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    api.get<{ success: boolean; data: Application }>(`/admin/wibg/${id}`)
      .then((r) => {
        setApp(r.data.data);
        setNotes(r.data.data.adminNotes ?? "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status: string) {
    if (!app) return;
    if (!confirm(`Set status to "${STATUS_LABELS[status]?.label ?? status}"? This will send an email to ${app.founderEmail}.`)) return;
    setSaving(true);
    try {
      const r = await api.patch<{ success: boolean; data: Application }>(`/admin/wibg/${id}/status`, { status, adminNotes: notes || undefined });
      setApp(r.data.data);
      showToast("Status updated and email sent.", true);
    } catch {
      showToast("Failed to update status.", false);
    } finally {
      setSaving(false);
    }
  }

  async function saveNotes() {
    if (!app) return;
    setSaving(true);
    try {
      const r = await api.patch<{ success: boolean; data: Application }>(`/admin/wibg/${id}/status`, { status: app.status, adminNotes: notes });
      setApp(r.data.data);
      showToast("Notes saved.", true);
    } catch {
      showToast("Failed to save notes.", false);
    } finally {
      setSaving(false);
    }
  }

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  if (loading) {
    return (
      <DashboardLayout navItems={navItems}>
        <div className="flex items-center justify-center py-24">
          <svg className="w-6 h-6 animate-spin text-gray-300" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </DashboardLayout>
    );
  }

  if (!app) {
    return (
      <DashboardLayout navItems={navItems}>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-gray-500 font-medium">Application not found.</p>
          <a href="/admin/wibg" className="mt-4 text-sm font-bold text-navy-900 hover:text-red-500">← Back to pipeline</a>
        </div>
      </DashboardLayout>
    );
  }

  const s = STATUS_LABELS[app.status] ?? { label: app.status, color: "bg-gray-50 text-gray-600 border-gray-100" };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-4xl space-y-6">

        {/* Breadcrumb + status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <a href="/admin/wibg" className="text-gray-400 hover:text-navy-900 transition-colors">Pipeline</a>
            <span className="text-gray-300">/</span>
            <span className="text-navy-900 font-semibold truncate max-w-xs">{app.businessName}</span>
          </div>
          <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border ${s.color}`}>{s.label}</span>
        </div>

        {/* Header card */}
        <div className="bg-navy-900 rounded-2xl p-7">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-extrabold text-white">{app.businessName}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{app.founderName}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <a href={`mailto:${app.founderEmail}`} className="text-green-400 text-sm hover:text-green-300 transition-colors">{app.founderEmail}</a>
                <span className="text-gray-600 text-sm">{app.founderPhone}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-gray-500 text-xs">Applied</p>
              <p className="text-gray-300 text-sm font-semibold">
                {new Date(app.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left — application content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Business info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Business Info</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "CAC Status",   val: app.cacStatus },
                  { label: "CAC Number",   val: app.cacNumber || "—" },
                  { label: "Business Stage", val: app.bizStage },
                  { label: "BHC Reference", val: app.bhcRef || "—" },
                  { label: "Revenue (3 mo)", val: `₦${Number(app.revenue3m).toLocaleString()}` },
                  { label: "Projection (12 mo)", val: `₦${Number(app.proj12m).toLocaleString()}` },
                ].map((r) => (
                  <div key={r.label}>
                    <p className="text-gray-400 text-xs font-medium mb-0.5">{r.label}</p>
                    <p className="text-navy-900 text-sm font-semibold">{r.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitch content */}
            {[
              { title: "Problem", content: app.problem },
              { title: "Solution", content: app.solution },
              { title: "Target Market", content: app.market },
              { title: "Traction", content: app.traction },
            ].map((s) => (
              <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{s.title}</p>
                <p className="text-gray-700 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>

          {/* Right — actions */}
          <div className="space-y-4">
            {/* Admin notes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Admin Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Internal notes (not sent to applicant)…"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy-900 placeholder-gray-400 focus:outline-none focus:border-navy-900 focus:ring-2 focus:ring-navy-900/10 transition-colors resize-none"
              />
              <button
                onClick={saveNotes}
                disabled={saving}
                className="w-full mt-2 bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                {saving ? "Saving…" : "Save Notes"}
              </button>
            </div>

            {/* Status actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Pipeline Actions</p>
              <p className="text-xs text-gray-400 mb-3">Each action sends an automatic email to the applicant.</p>
              <div className="space-y-2">
                {PIPELINE_ACTIONS.map((a) => (
                  <button
                    key={a.status}
                    onClick={() => updateStatus(a.status)}
                    disabled={saving || app.status === a.status}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${a.color} ${app.status === a.status ? "ring-2 ring-offset-1 ring-current" : ""}`}
                  >
                    {app.status === a.status ? "✓ " : ""}{a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold z-50 transition-all ${toast.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}
    </DashboardLayout>
  );
}

function DashIcon()     { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function TrophyIcon()   { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>; }
function UsersIcon()    { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>; }
function BuildingIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>; }
function StarIcon()     { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>; }
function MegaphoneIcon(){ return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg>; }
