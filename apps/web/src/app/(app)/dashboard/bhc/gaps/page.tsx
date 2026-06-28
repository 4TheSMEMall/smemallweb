"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { bhcApi, gapPriorityColor, type TrackedGap, type GapPriority } from "@/lib/bhcApi";
import { serviceApi } from "@/lib/serviceApi";
import {
  GridIcon, ClipboardIcon, TrophyIcon, AppsIcon, UserIcon,
  CheckCircleIcon, ExclamationTriangleIcon,
} from "@/components/ui/icons";

const navItems = [
  { label: "Dashboard",   path: "/dashboard",          icon: <GridIcon /> },
  { label: "BHC",         path: "/dashboard/bhc",      icon: <ClipboardIcon /> },
  { label: "WIBG 2026",   path: "/dashboard/wibg",     icon: <TrophyIcon /> },
  { label: "My Services", path: "/dashboard/services", icon: <AppsIcon /> },
  { label: "Profile",     path: "/dashboard/profile",  icon: <UserIcon /> },
];

const PRIORITY_ORDER: GapPriority[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const PRIORITY_DOT: Record<GapPriority, string> = {
  CRITICAL: "bg-red-500",
  HIGH:     "bg-amber-500",
  MEDIUM:   "bg-blue-500",
  LOW:      "bg-gray-400",
};

const STATUS_BADGE: Record<TrackedGap["status"], string> = {
  OPEN:        "",
  REQUESTED:   "text-blue-700 bg-blue-50 border-blue-200",
  IN_PROGRESS: "text-amber-700 bg-amber-50 border-amber-200",
  CLOSED:      "text-emerald-700 bg-emerald-50 border-emerald-200",
};

const STATUS_LABEL: Record<TrackedGap["status"], string> = {
  OPEN:        "",
  REQUESTED:   "Requested",
  IN_PROGRESS: "In Progress",
  CLOSED:      "Fixed",
};

export default function BhcGapsPage() {
  const queryClient = useQueryClient();
  const [priorityFilter, setPriorityFilter] = useState<GapPriority | "ALL">("ALL");
  const [sectionFilter, setSectionFilter]   = useState<string>("ALL");
  const [showClosed, setShowClosed]         = useState(false);
  const [toast, setToast]                   = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [requesting, setRequesting]         = useState<string | null>(null);

  const { data: history } = useQuery({
    queryKey: ["bhc-history"],
    queryFn:  () => bhcApi.getHistory().then((r) => r.data.data!),
  });

  const { data: allGaps, isLoading } = useQuery({
    queryKey: ["bhc-gaps"],
    queryFn:  () => bhcApi.getGaps().then((r) => r.data.data!),
  });

  const latest = history?.latest ?? null;
  const gaps: TrackedGap[] = allGaps ?? [];
  const activeGaps = gaps.filter((g) => g.status !== "CLOSED");
  const visibleGaps = showClosed ? gaps : activeGaps;

  const sections = Array.from(new Set(visibleGaps.map((g) => g.section)));
  const criticalCount = activeGaps.filter((g) => g.priority === "CRITICAL").length;
  const highCount     = activeGaps.filter((g) => g.priority === "HIGH").length;

  const filtered = visibleGaps
    .filter((g) => priorityFilter === "ALL" || g.priority === priorityFilter)
    .filter((g) => sectionFilter === "ALL" || g.section === sectionFilter)
    .sort((a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority));

  async function handleFixThis(gap: TrackedGap) {
    setRequesting(gap.id);
    try {
      await serviceApi.requestService(gap.id);
      setToast({ type: "success", text: `Request sent for "${gap.gapTitle}". Our team will match you with a vetted provider shortly — track progress on your Fix-It Tracker.` });
      queryClient.invalidateQueries({ queryKey: ["bhc-gaps"] });
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not send the request. Please try again.";
      setToast({ type: "error", text: message });
    } finally {
      setRequesting(null);
    }
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-4xl w-full space-y-5">

        {/* ── Breadcrumb ──────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/bhc" className="text-gray-400 hover:text-navy-900 text-sm transition-colors">
              BHC
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-navy-900 text-sm font-semibold">My Fix-It Plan</span>
          </div>
          <Link href="/dashboard/bhc/tracker" className="text-xs font-bold text-navy-900 hover:text-red-500 transition-colors">
            View Fix-It Tracker →
          </Link>
        </div>

        {/* ── Toast ───────────────────────────────────────── */}
        {toast && (
          <div className={`border text-sm rounded-2xl px-5 py-3.5 flex items-start gap-3 ${
            toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
          }`}>
            {toast.type === "success"
              ? <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
              : <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />}
            <p className="flex-1">{toast.text}</p>
            <button onClick={() => setToast(null)} className={`flex-shrink-0 ${toast.type === "success" ? "text-emerald-500 hover:text-emerald-700" : "text-red-500 hover:text-red-700"}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* ── Loading ─────────────────────────────────────── */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="bg-gray-100 rounded-2xl h-20 animate-pulse" />)}
          </div>
        )}

        {/* ── No assessment yet ───────────────────────────── */}
        {!isLoading && !latest && (
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-navy-50 rounded-3xl flex items-center justify-center mx-auto mb-5"><ClipboardIcon className="w-9 h-9 text-navy-300" /></div>
            <h3 className="text-xl font-extrabold text-navy-900 mb-2">Take the BHC first</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              Your Fix-It Plan is built from your Business Health Check. Complete the assessment to see your gaps.
            </p>
            <Link href="/dashboard/bhc" className="inline-flex items-center gap-2 bg-navy-900 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all">
              Go to BHC →
            </Link>
          </div>
        )}

        {!isLoading && latest && (
          <>
            {/* ── Summary header ──────────────────────────── */}
            <div className="relative bg-navy-900 rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
              <div className="relative p-6 sm:p-8">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-3">My Fix-It Plan</p>
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-5">
                  {activeGaps.length === 0
                    ? "No open gaps — you're in great shape"
                    : `${activeGaps.length} gap${activeGaps.length > 1 ? "s" : ""} to fix`}
                </h1>
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                  <div>
                    <p className="text-3xl font-black text-white">{latest.percentage}<span className="text-base text-gray-500">/100</span></p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Current score</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-3xl font-black text-red-400">{criticalCount}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Critical</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-3xl font-black text-amber-400">{highCount}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">High priority</p>
                  </div>
                </div>
              </div>
            </div>

            {activeGaps.length === 0 && !showClosed ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <CheckCircleIcon className="w-10 h-10 mb-3 mx-auto text-emerald-500" />
                <p className="font-bold text-emerald-800">No open gaps right now</p>
                <p className="text-emerald-700 text-sm mt-1">Keep your BHC up to date — retake it periodically to confirm you stay ahead.</p>
                {gaps.some((g) => g.status === "CLOSED") && (
                  <button onClick={() => setShowClosed(true)} className="mt-4 text-emerald-700 text-xs font-bold underline">
                    View fixed gaps →
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* ── Filters ──────────────────────────────── */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="flex gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-0.5">
                    {(["ALL", ...PRIORITY_ORDER] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriorityFilter(p)}
                        className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                          priorityFilter === p
                            ? "bg-navy-900 text-white border-navy-900"
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {p === "ALL" ? "All priorities" : p}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {sections.length > 1 && (
                      <select
                        value={sectionFilter}
                        onChange={(e) => setSectionFilter(e.target.value)}
                        className="text-xs font-semibold text-navy-900 bg-white border border-gray-200 rounded-full px-3 py-1.5 outline-none focus:border-navy-900 transition-colors"
                      >
                        <option value="ALL">All sections</option>
                        {sections.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 cursor-pointer whitespace-nowrap">
                      <input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} className="rounded" />
                      Show fixed
                    </label>
                  </div>
                </div>

                {/* ── Gap cards ────────────────────────────── */}
                <div className="space-y-3">
                  {filtered.map((gap, i) => {
                    const isClosed = gap.status === "CLOSED";
                    const accentBar = gap.priority === "CRITICAL" ? "bg-red-500" : gap.priority === "HIGH" ? "bg-amber-500" : gap.priority === "MEDIUM" ? "bg-blue-500" : "bg-gray-300";
                    return (
                      <div
                        key={gap.id}
                        className={`relative flex bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden transition-all duration-300 ${isClosed ? "opacity-60" : "hover:-translate-y-0.5 hover:shadow-card-hover"}`}
                        style={{ animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both` }}
                      >
                        <span className={`w-1.5 flex-shrink-0 ${accentBar}`} />
                        <div className="flex-1 p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[gap.priority]}`} />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{gap.section}</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {gap.status !== "OPEN" && (
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_BADGE[gap.status]}`}>
                                {STATUS_LABEL[gap.status]}
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${gapPriorityColor(gap.priority)}`}>
                              {gap.priority}
                            </span>
                          </div>
                        </div>
                        <p className={`font-extrabold text-base mb-1.5 ${isClosed ? "text-gray-500 line-through" : "text-navy-900"}`}>{gap.gapTitle}</p>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4">{gap.description}</p>
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          {gap.needsProvider && gap.serviceTag && (
                            <span className="text-[10px] font-bold text-navy-900 bg-gray-100 px-2.5 py-1 rounded-full">
                              Needs: {gap.serviceTag.replace(/_/g, " ")}
                            </span>
                          )}
                          {gap.status === "OPEN" && gap.needsProvider && (
                            <button
                              onClick={() => handleFixThis(gap)}
                              disabled={requesting === gap.id}
                              className="ml-auto inline-flex items-center gap-1.5 bg-navy-900 hover:bg-red-500 disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all hover:-translate-y-px"
                            >
                              {requesting === gap.id ? "Requesting…" : "Fix This →"}
                            </button>
                          )}
                          {gap.status === "OPEN" && !gap.needsProvider && (
                            <span className="ml-auto text-[11px] text-gray-400 font-medium">No provider needed — self-fixable</span>
                          )}
                        </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

