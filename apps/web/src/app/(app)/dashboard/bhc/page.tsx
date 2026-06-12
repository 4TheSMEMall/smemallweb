"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  bhcApi,
  statusColor,
  statusBarColor,
  downloadBlob,
  type BhcResult,
  type SectionScore,
} from "@/lib/bhcApi";
import { BhcTrendChart }       from "./components/BhcTrendChart";
import { BhcActionPlan }       from "./components/BhcActionPlan";
import { BhcExpiryBadge }      from "./components/BhcExpiryBadge";
import { BhcConsultantPrompt } from "./components/BhcConsultantPrompt";
import { BhcLenderPanel }      from "./components/BhcLenderPanel";

const INTRO_SEEN_KEY = "bhc_intro_seen";

const navItems = [
  { label: "Dashboard",   path: "/dashboard",      icon: <GridIcon /> },
  { label: "BHC",         path: "/dashboard/bhc",  icon: <ClipboardIcon /> },
  { label: "My Services", path: "/dashboard/services", icon: <AppsIcon /> },
  { label: "Profile",     path: "/dashboard/profile",  icon: <UserIcon /> },
];

const bhcFeatures = [
  { icon: "📊", title: "Business Health Score", desc: "Get a 0–100 score across 6 key business dimensions." },
  { icon: "🏦", title: "Lender Matching",       desc: "See which banks and lenders your business qualifies for." },
  { icon: "📋", title: "Detailed Report",        desc: "Download a full PDF report you can share with lenders." },
  { icon: "📈", title: "Improvement Roadmap",    desc: "Get specific actions to improve your score over time." },
];

const improvementTips: Record<string, string[]> = {
  "Financial Management":   ["Track all expenses monthly", "Maintain a separate business bank account", "Keep at least 3 months of financial records"],
  "Business Operations":    ["Document your key processes", "Set measurable monthly targets", "Review your operations quarterly"],
  "Market Position":        ["Define your target customer clearly", "Monitor competitor pricing", "Collect customer feedback regularly"],
  "Legal & Compliance":     ["Register your business formally", "File taxes on time", "Keep all business licences current"],
  "Human Resources":        ["Create clear job descriptions", "Set a training plan for staff", "Document your HR policies"],
  "Technology & Innovation":["Adopt basic accounting software", "Build an online presence", "Use digital tools for customer communication"],
};

export default function BhcPage() {
  const [showIntro, setShowIntro]       = useState(false);
  const [downloading, setDownloading]   = useState<string | null>(null);
  const [launching, setLaunching]       = useState(false);

  const handleLaunch = useCallback(async (closeFn?: () => void) => {
    setLaunching(true);
    try {
      await bhcApi.launchTest();
      closeFn?.();
    } catch {
      alert("Could not launch BHC. Please try again.");
    } finally {
      setLaunching(false);
    }
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["bhc-history"],
    queryFn:  () => bhcApi.getHistory().then((r) => r.data.data!),
    refetchOnWindowFocus: true,   // re-fetch when user returns from bhctestt.com tab
    staleTime: 0,                 // always treat as stale so it refetches on return
  });

  // Show intro modal on first ever visit OR if no assessments yet
  useEffect(() => {
    if (!data) return;
    const seen = localStorage.getItem(INTRO_SEEN_KEY);
    if (!seen || data.totalAssessments === 0) {
      setShowIntro(true);
    }
  }, [data]);

  const dismissIntro = () => {
    localStorage.setItem(INTRO_SEEN_KEY, "true");
    setShowIntro(false);
  };

  const handleDownload = async (result: BhcResult) => {
    setDownloading(result.assessmentId);
    try {
      const res = await bhcApi.downloadReport(result.assessmentId);
      downloadBlob(
        res.data as Blob,
        `BHC-Report-${result.percentage}pct-${new Date(result.completedAt).toLocaleDateString("en-NG")}.pdf`
      );
    } catch {
      alert("Could not download the report. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const latest  = data?.latest ?? null;
  const history = data?.history ?? [];
  const prev    = history.length > 1 ? history[1] : null;
  const scoreChange = latest && prev ? latest.percentage - prev.percentage : null;

  // Find 2 weakest sections for improvement tips
  const weakSections: SectionScore[] = latest
    ? [...latest.sectionScores].sort((a, b) => a.percentage - b.percentage).slice(0, 2)
    : [];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-4xl w-full space-y-6 sm:space-y-8">

        {/* ── Intro Modal ───────────────────────────────────── */}
        {showIntro && (
          <div className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
              {/* Modal header */}
              <div className="relative bg-navy-900 p-8">
                <div className="absolute inset-0 bg-dots opacity-20" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                    Available on The SME Mall
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">
                    Business Health Checker
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
                    Know exactly where your business stands — and what it takes
                    to get funded. The BHC gives you an honest, data-driven
                    score across 6 key business dimensions.
                  </p>
                </div>
                <button
                  onClick={dismissIntro}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Features grid */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bhcFeatures.map((f) => (
                  <div key={f.title} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                    <span className="text-2xl flex-shrink-0">{f.icon}</span>
                    <div>
                      <p className="font-bold text-navy-900 text-sm">{f.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* What to expect */}
              <div className="px-6 pb-2">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">⏱️</span>
                  <div>
                    <p className="font-bold text-amber-800 text-sm">Takes about 10–15 minutes</p>
                    <p className="text-amber-700 text-xs mt-0.5">
                      Answer honestly — the more accurate your answers, the more useful your score.
                      You can retake the assessment any time to track your progress.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => handleLaunch(dismissIntro)}
                  disabled={launching}
                  className="w-full sm:flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-center transition-all hover:shadow-lg text-sm flex items-center justify-center gap-2"
                >
                  {launching
                    ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Launching…</>
                    : "Take the Test →"
                  }
                </button>
                <button
                  onClick={dismissIntro}
                  className="w-full sm:w-auto px-5 py-3.5 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-navy-900 font-semibold rounded-xl transition-colors text-sm"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Page header ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900">Business Health Checker</h1>
            <p className="text-gray-500 text-sm mt-1">
              {latest
                ? `${data!.totalAssessments} assessment${data!.totalAssessments > 1 ? "s" : ""} completed`
                : "No assessments yet"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {latest && (
              <button
                onClick={() => { localStorage.removeItem(INTRO_SEEN_KEY); setShowIntro(true); }}
                className="text-xs text-gray-400 hover:text-navy-900 border border-gray-200 px-3 py-2 rounded-lg transition-colors"
              >
                About BHC
              </button>
            )}
            <button
              onClick={() => handleLaunch()}
              disabled={launching}
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              {launching
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Launching…</>
                : <>{latest ? "Retake Assessment" : "Take Assessment"}<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg></>
              }
            </button>
          </div>
        </div>

        {/* ── Loading skeleton ──────────────────────────────── */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Could not load your BHC history. <button onClick={() => refetch()} className="underline font-semibold ml-1">Retry</button>
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────── */}
        {data && data.totalAssessments === 0 && !showIntro && (
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-navy-50 rounded-3xl flex items-center justify-center mx-auto mb-5 text-4xl">📋</div>
            <h3 className="text-xl font-extrabold text-navy-900 mb-2">Take your first assessment</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              Find out exactly where your business stands and what lenders look for before approving a loan.
            </p>
            <button
              onClick={() => handleLaunch()}
              disabled={launching}
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-red-500 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              {launching ? "Launching…" : "Start free assessment →"}
            </button>
          </div>
        )}

        {latest && (
          <>
            {/* ── Loan readiness banner ─────────────────────── */}
            <LoanReadinessBanner percentage={latest.percentage} status={latest.status} />

            {/* ── Score card ────────────────────────────────── */}
            <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
              <div className="bg-navy-900 p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-1">Latest Score</p>
                    <div className="flex items-end gap-2 flex-wrap">
                      <span className="text-5xl font-extrabold text-white">{latest.percentage}</span>
                      <span className="text-gray-400 text-xl mb-1">/100</span>
                      {scoreChange !== null && (
                        <span className={`mb-1.5 text-sm font-bold px-2 py-0.5 rounded-full ${
                          scoreChange > 0 ? "bg-emerald-500/20 text-emerald-400" :
                          scoreChange < 0 ? "bg-red-500/20 text-red-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {scoreChange > 0 ? "+" : ""}{scoreChange} from last test
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`self-start px-4 py-2 rounded-full border text-sm font-bold ${statusColor(latest.status)}`}>
                    {latest.status}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${statusBarColor(latest.status)}`}
                    style={{ width: `${latest.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span><span>Critical</span><span>Fair</span><span>Good</span><span>100</span>
                </div>
              </div>

              {/* Section breakdown */}
              <div className="p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Section Scores</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {latest.sectionScores.map((s) => {
                    const isWeak = weakSections.some((w) => w.name === s.name);
                    return (
                      <div key={s.name} className={`rounded-xl p-4 border transition-colors ${isWeak ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-transparent"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            {isWeak && <span className="text-amber-500 text-xs">⚠</span>}
                            <span className="text-sm font-semibold text-navy-900 truncate">{s.name}</span>
                          </div>
                          <span className="text-sm font-bold text-navy-900 flex-shrink-0 ml-2">{s.score}/{s.max_score}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${statusBarColor(
                              s.percentage >= 75 ? "excellent" :
                              s.percentage >= 50 ? "good" :
                              s.percentage >= 25 ? "fair" : "critical"
                            )}`}
                            style={{ width: `${s.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{s.percentage}%</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Completed {new Date(latest.completedAt).toLocaleDateString("en-NG", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                  <button
                    onClick={() => handleDownload(latest)}
                    disabled={downloading === latest.assessmentId}
                    className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    {downloading === latest.assessmentId
                      ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    }
                    Download PDF Report
                  </button>
                </div>
              </div>
            </div>

            {/* ── Expiry badge ──────────────────────────────── */}
            <BhcExpiryBadge
              completedAt={latest.completedAt}
              onRetake={() => handleLaunch()}
            />

            {/* ── Lender matching panel ─────────────────────── */}
            <BhcLenderPanel percentage={latest.percentage} />

            {/* ── Score trend chart ─────────────────────────── */}
            <BhcTrendChart history={history} />

            {/* ── Consultant prompt ─────────────────────────── */}
            <BhcConsultantPrompt
              percentage={latest.percentage}
              status={latest.status}
            />

            {/* ── 90-day action plan ────────────────────────── */}
            <BhcActionPlan
              assessmentId={latest.assessmentId}
              sectionScores={latest.sectionScores}
              percentage={latest.percentage}
            />

            {/* ── Improvement tips ──────────────────────────── */}
            {weakSections.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xl">💡</span>
                  <h2 className="font-extrabold text-navy-900">Improvement Tips</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Based on your weakest sections</span>
                </div>
                <div className="space-y-4">
                  {weakSections.map((s) => {
                    const tips = improvementTips[s.name] ?? ["Review this area with a certified business consultant."];
                    return (
                      <div key={s.name} className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${statusColor(
                            s.percentage >= 50 ? "fair" : "critical"
                          )}`}>
                            {s.percentage}%
                          </span>
                          <p className="font-bold text-navy-900 text-sm">{s.name}</p>
                        </div>
                        <ul className="space-y-1.5">
                          {tips.map((tip) => (
                            <li key={tip} className="flex items-start gap-2 text-xs text-gray-700">
                              <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
                  <p className="text-xs text-gray-400 flex-1">
                    Want personalised guidance? Book a session with a certified consultant.
                  </p>
                  <Link
                    href="/consultant"
                    className="text-xs font-bold text-navy-900 hover:text-red-500 transition-colors whitespace-nowrap"
                  >
                    Find a consultant →
                  </Link>
                </div>
              </div>
            )}

            {/* ── Assessment history ────────────────────────── */}
            {history.length > 1 && (
              <div>
                <h2 className="text-lg font-extrabold text-navy-900 mb-4">Assessment History</h2>
                <div className="space-y-3">
                  {history.map((result, i) => (
                    <div key={result.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center flex-shrink-0 relative">
                          <span className="text-white font-extrabold text-sm">{result.percentage}</span>
                          {i === 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full">
                              Latest
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusColor(result.status)}`}>
                              {result.status}
                            </span>
                            {i > 0 && history[i - 1] && (
                              <span className={`text-xs font-semibold ${
                                result.percentage > history[i - 1].percentage ? "text-emerald-500" :
                                result.percentage < history[i - 1].percentage ? "text-red-500" : "text-gray-400"
                              }`}>
                                {result.percentage > history[i - 1].percentage ? "▲" : result.percentage < history[i - 1].percentage ? "▼" : "→"}
                                {" "}{Math.abs(result.percentage - history[i - 1].percentage)} pts
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              {new Date(result.completedAt).toLocaleDateString("en-NG", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden w-full sm:w-48">
                            <div className={`h-full rounded-full ${statusBarColor(result.status)}`} style={{ width: `${result.percentage}%` }} />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(result)}
                        disabled={downloading === result.assessmentId}
                        className="self-end sm:self-auto flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-navy-900 transition-colors disabled:opacity-50 border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-lg"
                      >
                        {downloading === result.assessmentId
                          ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M4 20h16" /></svg>
                        }
                        PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ── Loan Readiness Banner ───────────────────────────────── */
function LoanReadinessBanner({ percentage, status }: { percentage: number; status: string }) {
  if (percentage >= 70) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-lg">✓</div>
        <div>
          <p className="font-bold text-emerald-800">Loan Ready — your score qualifies you</p>
          <p className="text-emerald-700 text-sm mt-0.5">
            A score of {percentage}/100 ({status}) puts you in a strong position with most lenders on the platform.
            Head to your services to see matched partners.
          </p>
          <Link href="/partner" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 mt-2 transition-colors">
            View matched lenders →
          </Link>
        </div>
      </div>
    );
  }

  if (percentage >= 45) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-lg">⚡</div>
        <div>
          <p className="font-bold text-amber-800">Getting there — a few improvements needed</p>
          <p className="text-amber-700 text-sm mt-0.5">
            Your score of {percentage}/100 shows good progress. Work on the sections below to push above 70 and unlock more lenders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-lg">!</div>
      <div>
        <p className="font-bold text-red-800">Not yet loan ready — but improvement is achievable</p>
        <p className="text-red-700 text-sm mt-0.5">
          Your score of {percentage}/100 indicates areas that need attention before lenders will consider your application.
          Follow the tips below and retake the test in 30–60 days.
        </p>
        <Link href="/dashboard/bhc" className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 mt-2 transition-colors">
          Book a consultant to help →
        </Link>
      </div>
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────────── */
function GridIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function ClipboardIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>; }
function AppsIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" /></svg>; }
function UserIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>; }
