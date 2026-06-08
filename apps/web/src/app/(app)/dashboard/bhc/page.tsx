"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { bhcApi, statusColor, statusBarColor, downloadBlob, type BhcResult } from "@/lib/bhcApi";

const BHC_FRONTEND_URL = process.env.NEXT_PUBLIC_BHC_URL ?? "https://bhcdemo-production.up.railway.app";

const navItems = [
  { label: "Dashboard",   path: "/dashboard",      icon: <GridIcon /> },
  { label: "BHC History", path: "/dashboard/bhc",  icon: <ClipboardIcon /> },
  { label: "My Services", path: "/dashboard/services", icon: <AppsIcon /> },
  { label: "Profile",     path: "/dashboard/profile",  icon: <UserIcon /> },
];

export default function BhcHistoryPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["bhc-history"],
    queryFn: () => bhcApi.getHistory().then((r) => r.data.data!),
  });

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

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-4xl space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-900">Business Health Check</h1>
            <p className="text-gray-500 text-sm mt-1">
              Your assessment history, scores and downloadable reports.
            </p>
          </div>
          <a
            href={BHC_FRONTEND_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            {data?.totalAssessments ? "Retake Assessment" : "Start Assessment"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        {/* Latest score card */}
        {data?.latest && <LatestScoreCard result={data.latest} onDownload={handleDownload} downloading={downloading} />}

        {/* History list */}
        {isLoading && <SkeletonList />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-sm">
            Could not load your BHC history. Please refresh the page.
          </div>
        )}

        {data && data.totalAssessments === 0 && <EmptyState />}

        {data && data.history.length > 1 && (
          <div>
            <h2 className="text-lg font-extrabold text-navy-900 mb-4">Assessment History</h2>
            <div className="space-y-3">
              {data.history.slice(1).map((result) => (
                <HistoryRow
                  key={result.id}
                  result={result}
                  onDownload={handleDownload}
                  downloading={downloading}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function LatestScoreCard({
  result,
  onDownload,
  downloading,
}: {
  result: BhcResult;
  onDownload: (r: BhcResult) => void;
  downloading: string | null;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
      <div className="bg-navy-900 p-6 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-1">
            Latest Score
          </p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-extrabold text-white">{result.percentage}</span>
            <span className="text-gray-400 text-xl mb-1">/100</span>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full border text-sm font-bold ${statusColor(result.status)}`}>
          {result.status}
        </div>
      </div>

      {/* Score bar */}
      <div className="px-6 py-3 bg-navy-950">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${statusBarColor(result.status)}`}
            style={{ width: `${result.percentage}%` }}
          />
        </div>
      </div>

      {/* Section scores */}
      <div className="p-6">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
          Section Breakdown
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {result.sectionScores.map((s) => (
            <div key={s.name} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-navy-900 truncate pr-2">{s.name}</span>
                <span className="text-sm font-bold text-navy-900 flex-shrink-0">
                  {s.score}/{s.max_score}
                </span>
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
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Completed {new Date(result.completedAt).toLocaleDateString("en-NG", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
          <button
            onClick={() => onDownload(result)}
            disabled={downloading === result.assessmentId}
            className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            {downloading === result.assessmentId ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            Download Report PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryRow({
  result,
  onDownload,
  downloading,
}: {
  result: BhcResult;
  onDownload: (r: BhcResult) => void;
  downloading: string | null;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 flex items-center gap-4">
      <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center flex-shrink-0">
        <span className="text-white font-extrabold text-sm">{result.percentage}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusColor(result.status)}`}>
            {result.status}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(result.completedAt).toLocaleDateString("en-NG", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden w-48">
          <div
            className={`h-full rounded-full ${statusBarColor(result.status)}`}
            style={{ width: `${result.percentage}%` }}
          />
        </div>
      </div>
      <button
        onClick={() => onDownload(result)}
        disabled={downloading === result.assessmentId}
        className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-navy-900 transition-colors disabled:opacity-50"
      >
        {downloading === result.assessmentId
          ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M4 20h16" /></svg>
        }
        PDF
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-12 text-center">
      <div className="w-20 h-20 bg-navy-50 rounded-3xl flex items-center justify-center mx-auto mb-5 text-4xl">📋</div>
      <h3 className="text-xl font-extrabold text-navy-900 mb-2">No assessments yet</h3>
      <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
        Take your first Business Health Check to see your score, understand your loan readiness, and get matched with lenders.
      </p>
      <a
        href={BHC_FRONTEND_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 bg-navy-900 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
      >
        Start your free assessment →
      </a>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-100 rounded-2xl h-20 animate-pulse" />
      ))}
    </div>
  );
}

function GridIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function ClipboardIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>; }
function AppsIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" /></svg>; }
function UserIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>; }
