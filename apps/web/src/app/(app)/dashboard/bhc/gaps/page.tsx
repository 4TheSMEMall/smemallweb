"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { bhcApi, gapPriorityColor, type Gap, type GapPriority } from "@/lib/bhcApi";

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

export default function BhcGapsPage() {
  const [priorityFilter, setPriorityFilter] = useState<GapPriority | "ALL">("ALL");
  const [sectionFilter, setSectionFilter]   = useState<string>("ALL");
  const [toast, setToast]                   = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["bhc-history"],
    queryFn:  () => bhcApi.getHistory().then((r) => r.data.data!),
  });

  const latest = data?.latest ?? null;
  const gaps: Gap[] = latest?.gaps ?? [];

  const sections = Array.from(new Set(gaps.map((g) => g.section)));
  const criticalCount = gaps.filter((g) => g.priority === "CRITICAL").length;
  const highCount     = gaps.filter((g) => g.priority === "HIGH").length;

  const filtered = gaps
    .filter((g) => priorityFilter === "ALL" || g.priority === priorityFilter)
    .filter((g) => sectionFilter === "ALL" || g.section === sectionFilter)
    .sort((a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority));

  function handleFixThis(gap: Gap) {
    setToast(`We're building the service marketplace for "${gap.gap_title}". You'll be notified the moment it launches.`);
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-4xl w-full space-y-5">

        {/* ── Breadcrumb ──────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard/bhc" className="text-gray-400 hover:text-navy-900 text-sm transition-colors">
            BHC
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-navy-900 text-sm font-semibold">My Fix-It Plan</span>
        </div>

        {/* ── Toast ───────────────────────────────────────── */}
        {toast && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl px-5 py-3.5 flex items-start gap-3">
            <span className="text-lg flex-shrink-0">🚧</span>
            <p className="flex-1">{toast}</p>
            <button onClick={() => setToast(null)} className="text-amber-500 hover:text-amber-700 flex-shrink-0">
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
            <div className="w-20 h-20 bg-navy-50 rounded-3xl flex items-center justify-center mx-auto mb-5 text-4xl">📋</div>
            <h3 className="text-xl font-extrabold text-navy-900 mb-2">Take the BHC first</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              Your Fix-It Plan is built from your Business Health Check. Complete the assessment to see your gaps.
            </p>
            <Link href="/dashboard/bhc" className="inline-flex items-center gap-2 bg-navy-900 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all">
              Go to BHC →
            </Link>
          </div>
        )}

        {latest && (
          <>
            {/* ── Summary header ──────────────────────────── */}
            <div className="relative bg-navy-900 rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
              <div className="relative p-6 sm:p-8">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-3">My Fix-It Plan</p>
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-5">
                  {gaps.length === 0
                    ? "No gaps found — you're in great shape"
                    : `${gaps.length} gap${gaps.length > 1 ? "s" : ""} found in your last assessment`}
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

            {gaps.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <span className="text-4xl mb-3 block">✓</span>
                <p className="font-bold text-emerald-800">No gaps identified in your last assessment</p>
                <p className="text-emerald-700 text-sm mt-1">Keep your BHC up to date — retake it periodically to confirm you stay ahead.</p>
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
                </div>

                {/* ── Gap cards ────────────────────────────── */}
                <div className="space-y-3">
                  {filtered.map((gap, i) => (
                    <div key={`${gap.gap_title}-${i}`} className={`bg-white rounded-2xl border shadow-card p-5 sm:p-6 ${gapPriorityColor(gap.priority).split(" ").find((c) => c.startsWith("border-"))}`}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[gap.priority]}`} />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{gap.section}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${gapPriorityColor(gap.priority)}`}>
                          {gap.priority}
                        </span>
                      </div>
                      <p className="font-extrabold text-navy-900 text-base mb-1.5">{gap.gap_title}</p>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4">{gap.description}</p>
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        {gap.needs_provider && gap.service_tag && (
                          <span className="text-[10px] font-bold text-navy-900 bg-gray-100 px-2.5 py-1 rounded-full">
                            Needs: {gap.service_tag.replace(/_/g, " ")}
                          </span>
                        )}
                        {gap.needs_provider ? (
                          <button
                            onClick={() => handleFixThis(gap)}
                            className="ml-auto inline-flex items-center gap-1.5 bg-navy-900 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                          >
                            Fix This →
                          </button>
                        ) : (
                          <span className="ml-auto text-[11px] text-gray-400 font-medium">No provider needed — self-fixable</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ── Icons ───────────────────────────────────────────────────── */
function GridIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function ClipboardIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>; }
function TrophyIcon()    { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>; }
function AppsIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" /></svg>; }
function UserIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>; }
