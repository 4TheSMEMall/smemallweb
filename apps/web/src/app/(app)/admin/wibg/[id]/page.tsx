"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import {
  GridIcon, TrophyIcon, WrenchIcon, UsersIcon, BuildingIcon, StarIcon, MegaphoneIcon,
} from "@/components/ui/icons";

const navItems = [
  { label: "Overview",      path: "/admin",              icon: <GridIcon /> },
  { label: "WIBG Pipeline", path: "/admin/wibg",         icon: <TrophyIcon /> },
  { label: "Services",      path: "/admin/services",     icon: <WrenchIcon /> },
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
  pitchVideoLink?: string;
  status: string;
  videoTagged: boolean;
  adminNotes?: string;
  createdAt: string;
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const id     = params?.id as string;

  const [app, setApp]             = useState<Application | null>(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [videoSending, setVideoSending] = useState(false);
  const [notes, setNotes]         = useState("");
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);

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

  async function sendVideoReminder() {
    if (!app) return;
    if (!confirm(`Send video-tag reminder email to ${app.founderEmail}?`)) return;
    setVideoSending(true);
    try {
      await api.post(`/admin/wibg/${id}/video-reminder`);
      showToast("Video reminder email sent.", true);
    } catch {
      showToast("Failed to send reminder email.", false);
    } finally {
      setVideoSending(false);
    }
  }

  async function toggleVideoTag(tagged: boolean) {
    if (!app) return;
    setSaving(true);
    try {
      const r = await api.patch<{ success: boolean; data: Application }>(`/admin/wibg/${id}/video-tag`, { tagged });
      setApp(r.data.data);
      showToast(tagged ? "Marked as tagged." : "Marked as not tagged.", true);
    } catch {
      showToast("Failed to update video tag status.", false);
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
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0"><BuildingIcon className="w-6 h-6 text-white/70" /></div>
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

            {/* Video tag */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Pitch Video</p>
              {app.pitchVideoLink ? (
                <a
                  href={app.pitchVideoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:text-blue-700 underline break-all mb-3"
                >
                  {app.pitchVideoLink}
                </a>
              ) : (
                <p className="text-gray-400 text-xs mb-3 italic">No video link submitted</p>
              )}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold mb-3 ${app.videoTagged ? "bg-green-50 border-green-100 text-green-700" : "bg-amber-50 border-amber-100 text-amber-700"}`}>
                <span>{app.videoTagged ? "✓ SME Mall tagged" : "⚠ Not yet tagged"}</span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => toggleVideoTag(!app.videoTagged)}
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 bg-navy-900 hover:bg-navy-800 text-white"
                >
                  {saving ? "Updating…" : app.videoTagged ? "Mark as Not Tagged" : "Mark as Tagged"}
                </button>
                <button
                  onClick={sendVideoReminder}
                  disabled={videoSending || app.videoTagged}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {videoSending ? "Sending…" : "Send Tag Reminder Email"}
                </button>
              </div>
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

