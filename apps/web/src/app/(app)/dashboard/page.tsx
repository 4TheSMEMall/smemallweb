"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { bhcApi, type BhcResult } from "@/lib/bhcApi";
import api from "@/lib/api";

interface WibgStatus { businessName: string; status: string; }

function scoreColor(status: string) {
  switch (status.toLowerCase()) {
    case "critical":  return "#ef4444";
    case "fair":      return "#f59e0b";
    case "good":      return "#3b82f6";
    case "excellent": return "#10b981";
    default:          return "#6b7280";
  }
}
function loanReadiness(pct: number) {
  if (pct >= 70) return { label: "High",   dot: "bg-emerald-400" };
  if (pct >= 50) return { label: "Medium", dot: "bg-amber-400"   };
  return           { label: "Low",    dot: "bg-red-400"     };
}
function statusPill(status: string) {
  switch (status.toLowerCase()) {
    case "critical":  return "text-red-700 bg-red-50 border-red-200";
    case "fair":      return "text-amber-700 bg-amber-50 border-amber-200";
    case "good":      return "text-blue-700 bg-blue-50 border-blue-200";
    case "excellent": return "text-emerald-700 bg-emerald-50 border-emerald-200";
    default:          return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

const WIBG_LABELS: Record<string, string> = {
  SUBMITTED: "Submitted", UNDER_REVIEW: "Under Review",
  TOP_20: "Top 20", TOP_6: "Finalist",
  WINNER_1ST: "1st Place", WINNER_2ND: "2nd Place", WINNER_3RD: "3rd Place",
  REJECTED: "Not Shortlisted",
};

const navItems = [
  { label: "Dashboard",   path: "/dashboard",          icon: <GridIcon /> },
  { label: "BHC",         path: "/dashboard/bhc",      icon: <ClipboardIcon /> },
  { label: "WIBG 2026",   path: "/dashboard/wibg",     icon: <TrophyIcon /> },
  { label: "My Services", path: "/dashboard/services", icon: <AppsIcon /> },
  { label: "Profile",     path: "/dashboard/profile",  icon: <UserIcon /> },
];

const COMING_SOON = [
  { id: "paddy",       name: "SME Paddy",       category: "Bookkeeping",  desc: "Invoicing, expenses & cash flow automation.",   iconBg: "bg-teal-50",   iconCl: "text-teal-600",   ring: "ring-teal-100/60",   icon: <ReceiptIcon /> },
  { id: "training",    name: "Training Hub",    category: "Learning",     desc: "BHC-matched courses, video lessons & quizzes.", iconBg: "bg-violet-50", iconCl: "text-violet-600", ring: "ring-violet-100/60", icon: <PlayIcon /> },
  { id: "mentorship",  name: "Mentorship",      category: "Growth",       desc: "Match with verified Nigerian business mentors.",iconBg: "bg-orange-50", iconCl: "text-orange-600", ring: "ring-orange-100/60", icon: <PeopleIcon /> },
  { id: "loan",        name: "Loan Matching",   category: "Finance",      desc: "Matched lenders based on your BHC profile.",    iconBg: "bg-sky-50",    iconCl: "text-sky-600",    ring: "ring-sky-100/60",    icon: <WalletIcon /> },
  { id: "equity",      name: "Equity Matching", category: "Investment",   desc: "Connect with angels, VCs, and PE funds.",       iconBg: "bg-amber-50",  iconCl: "text-amber-600",  ring: "ring-amber-100/60",  icon: <TrendIcon /> },
  { id: "community",   name: "Community",       category: "Network",      desc: "12,000+ member peer groups & events.",          iconBg: "bg-rose-50",   iconCl: "text-rose-600",   ring: "ring-rose-100/60",   icon: <ChatIcon /> },
  { id: "cooperative", name: "Cooperative",     category: "Membership",   desc: "Low-interest loans, savings & insurance.",      iconBg: "bg-stone-50",  iconCl: "text-stone-600",  ring: "ring-stone-100/60",  icon: <HomeIcon /> },
];

export default function BusinessOwnerDashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const { data: bhcData } = useQuery({
    queryKey: ["bhc-history"],
    queryFn:  () => bhcApi.getHistory().then((r) => r.data.data!),
  });

  const [wibg, setWibg] = useState<WibgStatus | null | undefined>(undefined);
  useEffect(() => {
    api.get<{ success: boolean; data: WibgStatus | null }>("/wibg/my-status")
      .then((r) => setWibg(r.data.data))
      .catch(() => setWibg(null));
  }, []);

  const latest      = bhcData?.latest ?? null;
  const R           = 52;
  const CIRC        = 2 * Math.PI * R;
  const arcFill     = latest ? (latest.percentage / 100) * CIRC : 0;
  const stroke      = latest ? scoreColor(latest.status) : "";
  const rd          = latest ? loanReadiness(latest.percentage) : null;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-NG", { month: "short", year: "numeric" })
    : "—";
  const initials    = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <DashboardLayout navItems={navItems}>
      <div className="w-full max-w-5xl space-y-4 sm:space-y-5">

        {/* ╔══════════════════════ HERO ═══════════════════════╗ */}
        <div className="relative bg-navy-900 rounded-2xl sm:rounded-3xl overflow-hidden">

          {/* Decorative layers */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.028) 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(239,68,68,0.10) 0%, transparent 65%)" }} />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)" }} />

          {/* ── Mobile hero: stacked ──────────────────────────── */}
          <div className="sm:hidden relative px-5 pt-6 pb-0">
            {/* Top row: greeting + ring */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">{greeting}</span>
                </div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20">
                    <span className="text-xs font-black text-white">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-base font-black text-white leading-tight truncate">{user?.firstName} {user?.lastName}</h1>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Score ring — right of name on mobile */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="relative"
                  style={latest ? { filter: `drop-shadow(0 0 12px ${stroke}55)` } : {}}>
                  <svg viewBox="0 0 120 120" className="w-[72px] h-[72px]">
                    <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="11" />
                    {latest ? (
                      <circle cx="60" cy="60" r={R} fill="none" stroke={stroke} strokeWidth="11"
                        strokeLinecap="round" strokeDasharray={`${arcFill} ${CIRC}`}
                        transform="rotate(-90 60 60)" />
                    ) : (
                      <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="11" strokeDasharray="5 7" />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {latest ? (
                      <>
                        <span className="text-lg font-black leading-none" style={{ color: stroke }}>{latest.percentage}</span>
                        <span className="text-[8px] text-gray-600 font-bold">/100</span>
                      </>
                    ) : (
                      <span className="text-[9px] text-gray-600 font-bold text-center px-1">No score</span>
                    )}
                  </div>
                </div>
                <p className="text-[8px] font-black tracking-[0.18em] uppercase text-gray-600">BHC Score</p>
              </div>
            </div>

            {/* Description + CTA */}
            <p className="text-[11px] text-gray-500 leading-relaxed mb-4 max-w-[280px]">
              {latest
                ? `Score ${latest.percentage}/100 — ${latest.status} health. Review your lender panel.`
                : "Complete the 20-question BHC to unlock your score and lender matches."}
            </p>
            <div className="flex gap-2 pb-5">
              <Link href="/dashboard/bhc"
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-[11px] font-black py-3 rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-95">
                {latest ? "View BHC Report" : "Start Health Check"} <ArrowRight className="w-3 h-3" />
              </Link>
              <Link href="/dashboard/services"
                className="flex items-center justify-center px-3.5 py-3 rounded-xl border border-white/10 text-[11px] font-bold text-gray-500 active:scale-95">
                <AppsIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ── Desktop hero: side-by-side ───────────────────── */}
          <div className="hidden sm:flex items-center justify-between gap-6 relative px-8 sm:px-10 pt-8 pb-7">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-gray-500">{greeting}</span>
                <span className="text-gray-700 text-xs">·</span>
                <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-red-400">Business Owner</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/25">
                  <span className="text-sm font-black text-white">{initials}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white leading-tight">{user?.firstName} {user?.lastName}</h1>
                  <p className="text-[11px] text-gray-500">{user?.email}</p>
                </div>
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-6 max-w-sm">
                {latest
                  ? `Score ${latest.percentage}/100 — ${latest.status} health. Your lender panel and 90-day action plan are ready.`
                  : "Take the 20-question BHC to unlock your score, lender matches, and a personalised action plan."}
              </p>
              <div className="flex items-center gap-2.5">
                <Link href="/dashboard/bhc"
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-md shadow-red-500/20 hover:-translate-y-px">
                  {latest ? "View BHC Report" : "Start Health Check"} <ArrowRight className="w-3 h-3" />
                </Link>
                <Link href="/dashboard/services"
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-white border border-white/10 hover:border-white/20 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all">
                  All services
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-2"
              style={latest ? { filter: `drop-shadow(0 0 16px ${stroke}55)` } : {}}>
              <div className="relative">
                <svg viewBox="0 0 120 120" className="w-28 h-28">
                  <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="11" />
                  {latest ? (
                    <circle cx="60" cy="60" r={R} fill="none" stroke={stroke} strokeWidth="11"
                      strokeLinecap="round" strokeDasharray={`${arcFill} ${CIRC}`}
                      transform="rotate(-90 60 60)" />
                  ) : (
                    <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="11" strokeDasharray="5 7" />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {latest ? (
                    <>
                      <span className="text-3xl font-black leading-none" style={{ color: stroke }}>{latest.percentage}</span>
                      <span className="text-[9px] text-gray-500 font-bold mt-0.5">/100</span>
                    </>
                  ) : (
                    <span className="text-[10px] text-gray-600 font-bold text-center px-2">No score yet</span>
                  )}
                </div>
              </div>
              <p className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-600">BHC Score</p>
            </div>
          </div>

          {/* ── Stats strip (shared) ─────────────────────────── */}
          <div className="relative border-t border-white/[0.05]">
            {/* mobile: horizontal scroll; desktop: 3-col flex */}
            <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {[
                { label: "Loan Readiness", value: rd?.label ?? "—",    sub: rd ? `${latest!.percentage}% score` : "Take BHC",    dot: rd?.dot ?? "bg-gray-600" },
                { label: "Assessments",    value: String(bhcData?.totalAssessments ?? 0), sub: bhcData?.totalAssessments ? `Last: ${new Date(latest!.completedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}` : "None yet", dot: "bg-blue-400" },
                { label: "Member Since",   value: memberSince,           sub: "Active account",                                   dot: "bg-purple-400" },
              ].map((s, i) => (
                <div key={s.label} className={`flex-none sm:flex-1 flex items-center gap-2.5 py-3.5 px-5 sm:px-6 min-w-[130px] sm:min-w-0 ${i > 0 ? "border-l border-white/[0.05]" : ""}`}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{s.label}</p>
                    <p className="text-[11px] font-black text-white leading-snug">{s.value}</p>
                    <p className="text-[10px] text-gray-600 truncate">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ╔══════════════ MOBILE NEXT STEP (top priority) ═════╗ */}
        <div className="lg:hidden">
          <NextStepCard latest={latest} />
        </div>

        {/* ╔══════════════════ MAIN GRID ═══════════════════════╗ */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">

          {/* ━━━━━━━━━━━━━ LEFT COLUMN ━━━━━━━━━━━━━━ */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">

            {/* ── Active Services ─────────────────────────────── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider">Active Services</h2>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />2 live
                  </span>
                </div>
                <Link href="/dashboard/services" className="text-[11px] font-bold text-gray-400 hover:text-navy-900 transition-colors">
                  All →
                </Link>
              </div>

              <div className="space-y-3">
                {/* BHC card */}
                <Link href="/dashboard/bhc"
                  className="group block bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden active:scale-[0.99]">
                  <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-blue-50"
                    style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.07) 0%, rgba(59,130,246,0.01) 100%)" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-0.5 h-4 bg-blue-500 rounded-full" />
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Diagnostics</span>
                    </div>
                    {latest ? (
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusPill(latest.status)}`}>
                        {latest.percentage}% · <span className="capitalize">{latest.status}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full">Not started</span>
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4 mb-4">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <ChartBarIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-[15px] font-black text-navy-900 leading-snug mb-1">Business Health Checker</h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          20-question diagnostic across 6 pillars — get your score, lender panel, and 90-day action plan.
                        </p>
                      </div>
                    </div>

                    {/* Score bar */}
                    {latest ? (
                      <div className="mb-4 bg-gray-50/80 rounded-xl p-3 sm:p-3.5 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Health Score</span>
                          <span className="text-[11px] font-black" style={{ color: scoreColor(latest.status) }}>
                            {latest.percentage} <span className="text-gray-400 font-normal text-[10px]">/ 100</span>
                          </span>
                        </div>
                        <div className="h-2 sm:h-2.5 bg-white rounded-full overflow-hidden border border-gray-100">
                          <div className="h-full rounded-full" style={{ width: `${latest.percentage}%`, backgroundColor: scoreColor(latest.status) }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5 capitalize">
                          {latest.status} health · {latest.percentage >= 70 ? "Eligible for lender matching ✓" : `${70 - latest.percentage} pts from lender unlock`}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-4 bg-blue-50/40 border border-blue-100/60 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ChartBarIcon className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <p className="text-[11px] text-blue-700 font-medium">Complete the assessment to unlock your score and lender matches.</p>
                      </div>
                    )}

                    {/* Feature chips — horizontal scroll on mobile */}
                    <div className="flex gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-0.5 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                      {["Health score", "6-pillar breakdown", "Lender matching", "90-day plan"].map((f) => (
                        <span key={f} className="flex-none text-[10px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-900 group-hover:text-blue-600 transition-colors inline-flex items-center gap-1.5">
                        {latest ? "View report & lender matches" : "Start your assessment"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Grant card */}
                <Link href="/dashboard/wibg"
                  className="group block bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden active:scale-[0.99]">
                  <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-green-50"
                    style={{ background: "linear-gradient(90deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.01) 100%)" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-0.5 h-4 bg-green-500 rounded-full" />
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Grants & Funding</span>
                      <span className="text-[9px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">WIBG 2026 Open</span>
                    </div>
                    {wibg ? (
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">
                        {WIBG_LABELS[wibg.status] ?? wibg.status}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full">Not applied</span>
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4 mb-4">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-green-50 to-green-100/60 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <GiftIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-[15px] font-black text-navy-900 leading-snug mb-1">Women in Business Grant</h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          ₦3M in equity-free grants for female-led businesses. Apply and attend the grand finale.
                        </p>
                      </div>
                    </div>

                    {/* Deadline callout */}
                    <div className="mb-4 rounded-xl border border-amber-100 overflow-hidden"
                      style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.01) 100%)" }}>
                      <div className="flex items-center gap-3 px-3.5 sm:px-4 py-3">
                        <div className="w-8 h-8 bg-amber-100/70 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Grand Finale</p>
                          <p className="text-xs font-black text-amber-900">July 4, 2026</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[11px] font-black text-amber-700">₦3,000,000</p>
                          <p className="text-[9px] text-amber-500 font-bold">Equity-free</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-0.5 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                      {["Equity-free", "End-to-end apply", "Real-time status", "Grand Finale"].map((f) => (
                        <span key={f} className="flex-none text-[10px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>

                    <span className="text-xs font-bold text-navy-900 group-hover:text-green-600 transition-colors inline-flex items-center gap-1.5">
                      {wibg ? "View application status" : "Learn more & apply"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </div>
            </section>

            {/* ── Coming Soon ──────────────────────────────────── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider">Platform Roadmap</h2>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">7 upcoming</span>
                </div>
                <Link href="/dashboard/services" className="text-[11px] font-bold text-gray-400 hover:text-navy-900 transition-colors">See all →</Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {COMING_SOON.map((s) => (
                  <div key={s.id}
                    className={`relative bg-white rounded-2xl border border-gray-100 p-3.5 sm:p-4 ring-1 ${s.ring} overflow-hidden select-none`}>
                    <div className="absolute top-2.5 right-2.5">
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                        <LockIcon />
                      </div>
                    </div>
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 ${s.iconBg} rounded-xl flex items-center justify-center ${s.iconCl} mb-2.5`}>
                      {s.icon}
                    </div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{s.category}</p>
                    <p className="text-xs font-black text-navy-900 leading-snug mb-1">{s.name}</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed mb-2.5 line-clamp-2 sm:line-clamp-none">{s.desc}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-amber-400" />
                      <span className="text-[9px] font-bold text-amber-600">Coming soon</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Mobile: Quick Access ─────────────────────────── */}
            <div className="lg:hidden bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Access</p>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { label: "Business Health Check", sub: "Score & lender matching",  href: "/dashboard/bhc",      icon: <ChartBarIcon className="w-4 h-4" />, cl: "bg-blue-50 text-blue-600"    },
                  { label: "WIBG Grant 2026",        sub: "₦3M equity-free grants",  href: "/dashboard/wibg",     icon: <GiftIcon className="w-4 h-4" />,     cl: "bg-green-50 text-green-600"  },
                  { label: "All Services",           sub: "2 live · 7 coming soon",  href: "/dashboard/services", icon: <AppsIcon className="w-4 h-4" />,     cl: "bg-purple-50 text-purple-600"},
                  { label: "My Profile",             sub: "Account & status",         href: "/dashboard/profile",  icon: <UserIcon className="w-4 h-4" />,     cl: "bg-gray-50 text-gray-500"    },
                ].map((item) => (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50/70 active:bg-gray-100 transition-colors group">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.cl}`}>{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.label}</p>
                      <p className="text-[10px] text-gray-400 truncate">{item.sub}</p>
                    </div>
                    <svg className="w-3 h-3 text-gray-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Mobile: Platform Roadmap ─────────────────────── */}
            <div className="lg:hidden relative bg-navy-900 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }} />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)" }} />
              <div className="relative p-5">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Platform Roadmap</p>
                <div className="flex items-end justify-between mb-2">
                  <p className="text-sm font-black text-white">2 of 9 services live</p>
                  <p className="text-xs text-gray-500 font-bold">22%</p>
                </div>
                <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden mb-4">
                  <div className="h-full w-[22%] bg-gradient-to-r from-red-500 to-red-400 rounded-full" />
                </div>
                {/* Grid of all 9 services */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                  {[
                    { name: "Business Health Checker", live: true  },
                    { name: "Grant Matching",          live: true  },
                    { name: "SME Paddy",               live: false },
                    { name: "Training Hub",            live: false },
                    { name: "Loan Matching",           live: false },
                    { name: "Equity Matching",         live: false },
                    { name: "Mentorship",              live: false },
                    { name: "Community",               live: false },
                    { name: "Cooperative",             live: false },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.live ? "bg-emerald-400" : "bg-white/15"}`} />
                      <span className={`text-[10px] font-medium truncate ${item.live ? "text-white/80" : "text-gray-600"}`}>{item.name}</span>
                      {item.live && <span className="ml-auto text-[9px] font-black text-emerald-400 flex-shrink-0">LIVE</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── BHC History ──────────────────────────────────── */}
            {(bhcData?.history?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                <div className="px-4 sm:px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider">Assessment History</h2>
                  <Link href="/dashboard/bhc" className="text-[11px] font-bold text-gray-400 hover:text-navy-900 transition-colors">Full report →</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {bhcData!.history.slice(0, 4).map((r: BhcResult) => (
                    <div key={r.id} className="px-4 sm:px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${scoreColor(r.status)}18` }}>
                        <span className="text-[11px] font-black" style={{ color: scoreColor(r.status) }}>{r.percentage}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-navy-900 leading-none">{r.percentage}<span className="text-gray-400 text-[10px] font-normal"> / 100</span></p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{new Date(r.completedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${statusPill(r.status)}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ━━━━━━━━━━━━━━━━━ DESKTOP SIDEBAR ━━━━━━━━━━━━━━━━ */}
          <div className="hidden lg:flex lg:flex-col gap-4">

            {/* Next Step */}
            <NextStepCard latest={latest} />

            {/* Quick Access */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Access</p>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { label: "Business Health Check", sub: "Score & lender matching",  href: "/dashboard/bhc",      icon: <ChartBarIcon className="w-4 h-4" />, cl: "bg-blue-50 text-blue-600"    },
                  { label: "WIBG Grant 2026",        sub: "₦3M equity-free grants",  href: "/dashboard/wibg",     icon: <GiftIcon className="w-4 h-4" />,     cl: "bg-green-50 text-green-600"  },
                  { label: "All Services",           sub: "2 live · 7 coming soon",  href: "/dashboard/services", icon: <AppsIcon className="w-4 h-4" />,     cl: "bg-purple-50 text-purple-600"},
                  { label: "My Profile",             sub: "Account & status",         href: "/dashboard/profile",  icon: <UserIcon className="w-4 h-4" />,     cl: "bg-gray-50 text-gray-500"    },
                ].map((item) => (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/70 transition-colors group">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.cl}`}>{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.label}</p>
                      <p className="text-[10px] text-gray-400 truncate">{item.sub}</p>
                    </div>
                    <svg className="w-3 h-3 text-gray-200 group-hover:text-gray-400 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Platform Roadmap */}
            <div className="relative bg-navy-900 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }} />
              <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)" }} />
              <div className="relative p-5">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Platform Roadmap</p>
                <div className="flex items-end justify-between mb-2">
                  <p className="text-sm font-black text-white">2 of 9 live</p>
                  <p className="text-xs text-gray-500 font-bold">22%</p>
                </div>
                <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden mb-4">
                  <div className="h-full w-[22%] bg-gradient-to-r from-red-500 to-red-400 rounded-full" />
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: "Business Health Checker", live: true  },
                    { name: "Grant Matching (WIBG)",   live: true  },
                    { name: "SME Paddy",               live: false },
                    { name: "Training Hub",            live: false },
                    { name: "Loan Matching",           live: false },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.live ? "bg-emerald-400" : "bg-white/10"}`} />
                      <span className={`text-[11px] font-medium truncate flex-1 ${item.live ? "text-white/75" : "text-gray-600"}`}>{item.name}</span>
                      {item.live && <span className="text-[9px] font-black text-emerald-400">LIVE</span>}
                    </div>
                  ))}
                  <p className="text-[10px] text-gray-600 font-medium pt-0.5">+ 4 more in development</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ── Shared NextStep card (dark) ─────────────────────────────── */
function NextStepCard({ latest }: { latest: BhcResult | null }) {
  let icon = <ChartBarIcon className="w-5 h-5 text-red-400" />;
  let iconBg = "bg-red-500/10 border-red-500/15";
  let title = "Start your Health Check";
  let body  = "20 questions · 6 pillars · Unlock your score and lender matches.";
  let href  = "/dashboard/bhc";
  let btnCl = "bg-red-500 hover:bg-red-600 shadow-red-500/20";
  let btnTx = "Start assessment";

  if (latest && latest.percentage >= 70) {
    icon   = <BankIcon className="w-5 h-5 text-emerald-400" />;
    iconBg = "bg-emerald-500/10 border-emerald-500/15";
    title  = "Lender matching unlocked";
    body   = `Score ${latest.percentage}/100. Banks matched to your profile are ready.`;
    btnCl  = "bg-emerald-600 hover:bg-emerald-500";
    btnTx  = "View lender panel";
  } else if (latest && latest.percentage >= 50) {
    icon   = <TrendUpIcon className="w-5 h-5 text-amber-400" />;
    iconBg = "bg-amber-500/10 border-amber-500/15";
    title  = "On track — keep improving";
    body   = `Score ${latest.percentage}/100. Reach 70 to unlock lender matching.`;
    btnCl  = "bg-amber-500 hover:bg-amber-400";
    btnTx  = "View action plan";
  } else if (latest) {
    icon   = <TrendUpIcon className="w-5 h-5 text-red-400" />;
    iconBg = "bg-red-500/10 border-red-500/15";
    title  = "Improve your score";
    body   = `Score ${latest.percentage}/100. Your improvement plan has clear next steps.`;
    btnTx  = "See improvement plan";
  }

  return (
    <div className="relative bg-navy-900 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }} />
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)" }} />
      <div className="relative p-5 space-y-4">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Your next step</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${iconBg}`}>{icon}</div>
        <div>
          <p className="text-sm font-black text-white mb-1.5 leading-snug">{title}</p>
          <p className="text-[11px] text-gray-500 leading-relaxed">{body}</p>
        </div>
        <Link href={href}
          className={`w-full flex items-center justify-center gap-2 ${btnCl} text-white text-xs font-black py-3 rounded-xl transition-all shadow-md active:scale-[0.98]`}>
          {btnTx} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────────────── */
function ArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
}
function LockIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-2.5 h-2.5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>;
}
function GridIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function ClipboardIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>; }
function TrophyIcon({ className = "w-5 h-5" }: { className?: string }) { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>; }
function AppsIcon({ className = "w-5 h-5" }: { className?: string }) { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" /></svg>; }
function UserIcon({ className = "w-5 h-5" }: { className?: string }) { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>; }
function ChartBarIcon({ className = "w-5 h-5" }: { className?: string }) { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>; }
function GiftIcon({ className = "w-5 h-5" }: { className?: string }) { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1016.875 7.5c0-.073 0-.14-.004-.21M12 4.875A2.625 2.625 0 107.125 7.5c0-.073 0-.14.004-.21M12 4.875c-.073 0-.14 0-.21.004a2.625 2.625 0 10-4.54 2.621m4.75-2.625c.073 0 .14 0 .21.004a2.625 2.625 0 114.54 2.621M3 11.25h18M12 11.25v10.5" /></svg>; }
function BankIcon({ className = "w-5 h-5" }: { className?: string }) { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>; }
function TrendUpIcon({ className = "w-5 h-5" }: { className?: string }) { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>; }
function CalendarIcon({ className = "w-4 h-4" }: { className?: string }) { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>; }
function ReceiptIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>; }
function PlayIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>; }
function PeopleIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>; }
function WalletIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>; }
function TrendIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>; }
function ChatIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>; }
function HomeIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>; }
