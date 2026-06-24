"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/lib/api";

const navItems = [
  { label: "Dashboard",   path: "/dashboard",          icon: <GridIcon /> },
  { label: "BHC",         path: "/dashboard/bhc",      icon: <ClipboardIcon /> },
  { label: "WIBG 2026",   path: "/dashboard/wibg",     icon: <TrophyIcon /> },
  { label: "My Services", path: "/dashboard/services", icon: <AppsIcon /> },
  { label: "Profile",     path: "/dashboard/profile",  icon: <UserIcon /> },
];

/* ── Competition phases ──────────────────────────────────────── */
const PHASES = [
  { num: "01", label: "BHC Diagnostic",    date: "From Apr 1",    done: true,   active: false },
  { num: "02", label: "Applications",      date: "Closed Jun 24", done: true,   active: false },
  { num: "03", label: "Training Webinars", date: "Jun 7–22",      done: true,   active: false },
  { num: "04", label: "Virtual Semi-Final",date: "Jun 28",        done: false,  active: true  },
  { num: "05", label: "Grand Finale",      date: "Jul 4, Lagos",  done: false,  active: false },
];

/* ── Status config ───────────────────────────────────────────── */
const STATUS_CONFIG: Record<string, {
  label: string; emoji: string;
  bg: string; border: string; headCl: string; bodyCl: string; badgeCl: string;
  desc: string;
}> = {
  SUBMITTED:    { label: "Application Submitted",    emoji: "📩", bg: "bg-blue-50",   border: "border-blue-100",   headCl: "text-blue-900",    bodyCl: "text-blue-700",   badgeCl: "bg-blue-100 text-blue-800 border-blue-200",   desc: "Your application has been received. Our panel will review all submissions after the June 24 deadline." },
  UNDER_REVIEW: { label: "Under Review",             emoji: "🔍", bg: "bg-indigo-50", border: "border-indigo-100", headCl: "text-indigo-900",  bodyCl: "text-indigo-700", badgeCl: "bg-indigo-100 text-indigo-800 border-indigo-200", desc: "Our judging panel is actively reviewing your application. Results will be announced shortly." },
  TOP_20:       { label: "Shortlisted — Top 20 🎉",  emoji: "⭐", bg: "bg-emerald-50",border: "border-emerald-200",headCl: "text-emerald-900", bodyCl: "text-emerald-700",badgeCl: "bg-emerald-100 text-emerald-800 border-emerald-200", desc: "You made the Top 20! Check your email for virtual pitch briefing details. The Semi-Final is June 28." },
  TOP_6:        { label: "You're a Grand Finalist 🏆",emoji: "🏆", bg: "bg-amber-50",  border: "border-amber-200",  headCl: "text-amber-900",   bodyCl: "text-amber-700",  badgeCl: "bg-amber-100 text-amber-800 border-amber-200",   desc: "You're one of six finalists! Check your email for the Grand Finale briefing. See you in Lagos on July 4." },
  WINNER_1ST:   { label: "1st Place Winner 🥇",      emoji: "🥇", bg: "bg-yellow-50", border: "border-yellow-200", headCl: "text-yellow-900",  bodyCl: "text-yellow-700", badgeCl: "bg-yellow-100 text-yellow-800 border-yellow-300", desc: "You won the WIBG 2026 Grand Prize of ₦1,500,000! Congratulations — you made history." },
  WINNER_2ND:   { label: "2nd Place Winner 🥈",      emoji: "🥈", bg: "bg-slate-50",  border: "border-slate-200",  headCl: "text-slate-900",   bodyCl: "text-slate-600",  badgeCl: "bg-slate-100 text-slate-700 border-slate-200",   desc: "You placed 2nd and won ₦1,000,000! Congratulations on an outstanding pitch." },
  WINNER_3RD:   { label: "3rd Place Winner 🥉",      emoji: "🥉", bg: "bg-orange-50", border: "border-orange-100", headCl: "text-orange-900",  bodyCl: "text-orange-700", badgeCl: "bg-orange-100 text-orange-800 border-orange-200", desc: "You placed 3rd and won ₦500,000! A brilliant performance — you should be incredibly proud." },
  REJECTED:     { label: "Application Reviewed",     emoji: "📋", bg: "bg-gray-50",   border: "border-gray-200",   headCl: "text-gray-800",    bodyCl: "text-gray-600",   badgeCl: "bg-gray-100 text-gray-700 border-gray-200",     desc: "Thank you for applying. You'll receive a detailed personalised email update from our team." },
};

interface WibgApplication {
  id: string; businessName: string; status: string; createdAt: string;
}

/* ── Page ────────────────────────────────────────────────────── */
export default function WibgOverviewPage() {
  const [application, setApplication] = useState<WibgApplication | null | undefined>(undefined);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    api.get<{ success: boolean; data: WibgApplication | null }>("/wibg/my-status")
      .then((r) => setApplication(r.data.data))
      .catch(() => setApplication(null));
  }, []);

  useEffect(() => {
    const finale = new Date("2026-07-04T00:00:00");
    const now    = new Date();
    const diff   = Math.ceil((finale.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    setDaysLeft(Math.max(0, diff));
  }, []);

  const applied    = !!application;
  const statusConf = application ? (STATUS_CONFIG[application.status] ?? STATUS_CONFIG["SUBMITTED"]) : null;

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-4xl w-full space-y-5">

        {/* ══════════════════ STATUS BANNER ════════════════════ */}
        {application && statusConf && (
          <div className={`rounded-2xl border p-5 sm:p-6 ${statusConf.bg} ${statusConf.border}`}>
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0 mt-0.5">{statusConf.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <p className={`text-base font-black ${statusConf.headCl}`}>{application.businessName}</p>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusConf.badgeCl}`}>
                    {statusConf.label}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed mb-1.5 ${statusConf.bodyCl}`}>{statusConf.desc}</p>
                <p className={`text-[11px] font-medium ${statusConf.bodyCl} opacity-70`}>
                  Applied {new Date(application.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ HERO ═════════════════════════ */}
        <div className="relative bg-navy-900 rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 80% at 85% -5%, rgba(34,197,94,0.14), transparent)" }} />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 65%)" }} />

          <div className="relative p-6 sm:p-10">
            {/* Top label row */}
            <div className="flex items-center gap-2 mb-5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">WIBG × SME Mall</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">2026 Edition</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
                  Women in Business<br />
                  <span className="text-green-400">Grant Competition</span>
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed max-w-lg mb-6">
                  A structured capacity-building programme and live pitch competition for female-led Nigerian businesses.
                  Win equity-free capital, mentorship, and direct investor access.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  {applied ? (
                    <div className="inline-flex items-center gap-2 bg-green-500/15 border border-green-500/25 text-green-400 font-bold px-5 py-2.5 rounded-xl text-sm cursor-default">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      Application Submitted
                    </div>
                  ) : (
                    <Link href="/dashboard/wibg/apply"
                      className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black px-6 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-green-500/20 hover:-translate-y-px active:scale-95">
                      Apply to Pitch
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </Link>
                  )}
                  <Link href="/wibg" target="_blank"
                    className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/25 text-gray-400 hover:text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm">
                    Full Info Page
                    <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </Link>
                </div>
              </div>

              {/* Countdown to Grand Finale */}
              {daysLeft !== null && daysLeft > 0 && (
                <div className="flex-shrink-0 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 text-center min-w-[140px]">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Grand Finale in</p>
                  <p className="text-5xl font-black text-white leading-none mb-1">{daysLeft}</p>
                  <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">days</p>
                  <div className="mt-3 pt-3 border-t border-white/[0.06]">
                    <p className="text-[10px] text-gray-500 font-medium">July 4 · Lagos</p>
                  </div>
                </div>
              )}
              {daysLeft === 0 && (
                <div className="flex-shrink-0 bg-green-500/10 border border-green-500/20 rounded-2xl p-5 text-center min-w-[140px]">
                  <p className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-2">Today!</p>
                  <p className="text-2xl font-black text-green-400 leading-none mb-1">🎉</p>
                  <p className="text-[10px] font-bold text-green-400">Grand Finale Day</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════ LIVE PHASE TRACKER ═══════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Where We Are Now</p>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />Live
            </span>
          </div>
          <div className="p-5 sm:p-6">
            {/* Desktop: horizontal */}
            <div className="hidden sm:flex items-start gap-0">
              {PHASES.map((phase, i) => (
                <div key={phase.num} className="flex-1 flex items-start">
                  <div className="flex flex-col items-center flex-1">
                    <div className="flex items-center w-full mb-3">
                      <div className={`relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs transition-all ${
                        phase.done   ? "bg-green-500 text-white shadow-md shadow-green-500/25" :
                        phase.active ? "bg-navy-900 text-white shadow-md ring-4 ring-green-200" :
                                       "bg-gray-100 text-gray-400"
                      }`}>
                        {phase.done
                          ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          : phase.active
                            ? <span className="absolute w-3 h-3 rounded-full bg-green-400 animate-ping opacity-60" />
                            : phase.num}
                        {phase.active && <span className="w-2 h-2 rounded-full bg-green-400" />}
                      </div>
                      {i < PHASES.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1.5 ${phase.done ? "bg-green-300" : "bg-gray-100"}`} />
                      )}
                    </div>
                    <div className="pr-2">
                      <p className={`text-xs font-black leading-snug ${phase.active ? "text-navy-900" : phase.done ? "text-green-700" : "text-gray-400"}`}>
                        {phase.label}
                      </p>
                      <p className={`text-[10px] font-medium mt-0.5 ${phase.active ? "text-green-600" : phase.done ? "text-green-500" : "text-gray-400"}`}>
                        {phase.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: vertical */}
            <div className="flex flex-col gap-0 sm:hidden">
              {PHASES.map((phase, i) => (
                <div key={phase.num} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs ${
                      phase.done   ? "bg-green-500 text-white" :
                      phase.active ? "bg-navy-900 text-white ring-4 ring-green-100" :
                                     "bg-gray-100 text-gray-400"
                    }`}>
                      {phase.done
                        ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        : phase.active ? <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> : phase.num}
                    </div>
                    {i < PHASES.length - 1 && <div className={`w-0.5 h-6 ${phase.done ? "bg-green-300" : "bg-gray-100"}`} />}
                  </div>
                  <div className="pb-4 pt-1">
                    <p className={`text-xs font-black ${phase.active ? "text-navy-900" : phase.done ? "text-green-700" : "text-gray-400"}`}>{phase.label}</p>
                    <p className={`text-[10px] font-medium ${phase.active ? "text-green-600" : phase.done ? "text-green-500" : "text-gray-400"}`}>{phase.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════ STATS ROW ════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { val: "₦3M",    label: "Total Prize Pool",    sub: "Equity-free capital",  cl: "text-green-600" },
            { val: "6",      label: "Finalists Selected",  sub: "From Top 20",          cl: "text-navy-900"  },
            { val: "500+",   label: "Live Audience",       sub: "Investors & press",     cl: "text-navy-900"  },
            { val: "Jul 4",  label: "Grand Finale",        sub: "Lagos · Live event",    cl: "text-red-500"   },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 sm:p-5">
              <p className={`text-2xl sm:text-3xl font-black leading-none mb-1 ${s.cl}`}>{s.val}</p>
              <p className="text-xs font-bold text-navy-900">{s.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ══════════════ ACE YOUR PITCH ═══════════════════════ */}
        <div className="bg-navy-900 rounded-2xl overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-green-400/80 uppercase tracking-widest">Ace Your Pitch</p>
              <p className="text-xs text-gray-500 mt-0.5">5 things that separate finalists from winners</p>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">July 4 · Lagos</span>
          </div>
          <div className="p-5 sm:p-6 space-y-3.5">
            {[
              { num: "01", tip: "Open with the problem — not your name", detail: "You have 30 seconds before judges form their first impression. Lead with a sharp, real problem statement. Your name can wait." },
              { num: "02", tip: "State your traction in the first 60 seconds", detail: "Revenue, customers, units sold, waitlist — any number beats zero. Judges want to see the market has already responded to you." },
              { num: "03", tip: "Know your numbers cold", detail: "Monthly revenue, burn rate, CAC, margins. You don't need all of them — but the ones you cite must be instant and accurate." },
              { num: "04", tip: "Make the ask crystal clear", detail: "Say exactly what the ₦1.5M is for and what milestone it unlocks. Vague plans lose to specific plans every single time." },
              { num: "05", tip: "End with why you — not why the idea", detail: "Ideas are cheap. Judges fund people. Close with one line about why you are the woman who will make this work." },
            ].map((item) => (
              <div key={item.num} className="flex gap-4 group">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-[10px] font-black text-green-400">{item.num}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white leading-snug mb-1">{item.tip}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ JUDGING SCORECARD ════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Judging Scorecard</p>
              <p className="text-xs text-gray-400 mt-0.5">How your pitch will be scored</p>
            </div>
            <span className="text-[10px] font-bold text-navy-900 bg-navy-900/5 border border-navy-900/10 px-2.5 py-0.5 rounded-full">100 pts total</span>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            {[
              { label: "Innovation & Uniqueness",  pct: 25, color: "bg-violet-500",  tip: "How original is the solution? Does it stand out in the Nigerian market?" },
              { label: "Market Viability",          pct: 20, color: "bg-blue-500",    tip: "Is there a real, large, accessible market? Can it scale?" },
              { label: "Team & Execution Ability",  pct: 20, color: "bg-green-500",   tip: "Does the founder have the skills, resilience, and drive to execute?" },
              { label: "Financial Clarity",         pct: 20, color: "bg-amber-500",   tip: "Revenue model, current numbers, use of grant — are they clear and credible?" },
              { label: "Pitch Delivery",            pct: 15, color: "bg-red-500",     tip: "Confidence, clarity, storytelling. Is the audience moved and convinced?" },
            ].map((criterion) => (
              <div key={criterion.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-black text-navy-900">{criterion.label}</p>
                  <span className="text-xs font-black text-gray-400">{criterion.pct} pts</span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                  <div className={`h-full rounded-full ${criterion.color}`} style={{ width: `${criterion.pct * 4}%` }} />
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{criterion.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ PRIZE BREAKDOWN ══════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grant Prizes</p>
          </div>
          <div className="p-5 sm:p-6">
            {/* Visual podium */}
            <div className="flex items-end justify-center gap-3 mb-6">
              {/* 2nd */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <span className="text-2xl">🥈</span>
                <div className="w-full bg-gradient-to-t from-slate-100 to-slate-50 border border-slate-100 rounded-t-xl h-20 flex items-center justify-center">
                  <p className="text-lg font-black text-slate-700">₦1M</p>
                </div>
                <p className="text-[10px] font-bold text-gray-400 text-center">2nd Place</p>
              </div>
              {/* 1st */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <span className="text-3xl">🏆</span>
                <div className="w-full bg-gradient-to-t from-yellow-100 to-yellow-50 border border-yellow-200 rounded-t-xl h-28 flex items-center justify-center">
                  <p className="text-xl font-black text-yellow-700">₦1.5M</p>
                </div>
                <p className="text-[10px] font-bold text-gray-400 text-center">1st Place</p>
              </div>
              {/* 3rd */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <span className="text-2xl">🥉</span>
                <div className="w-full bg-gradient-to-t from-orange-100 to-orange-50 border border-orange-100 rounded-t-xl h-14 flex items-center justify-center">
                  <p className="text-base font-black text-orange-700">₦500K</p>
                </div>
                <p className="text-[10px] font-bold text-gray-400 text-center">3rd Place</p>
              </div>
            </div>

            {/* Perks */}
            <div className="space-y-2.5">
              {[
                { place: "1st", amount: "₦1,500,000", emoji: "🏆", perks: ["Equity-free capital", "1-on-1 VC coaching", "Exhibition space at SME Mall"] },
                { place: "2nd", amount: "₦1,000,000", emoji: "🥈", perks: ["Equity-free capital", "6 months mentorship", "Co-working ticket"] },
                { place: "3rd", amount: "₦500,000",   emoji: "🥉", perks: ["Equity-free capital", "3 months capacity training"] },
              ].map((p) => (
                <div key={p.place} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-xl flex-shrink-0">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-black text-navy-900">{p.place} Place</p>
                      <p className="text-sm font-black text-navy-900">{p.amount}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {p.perks.map((perk) => (
                        <span key={perk} className="text-[10px] font-semibold text-gray-500 bg-white border border-gray-100 px-2 py-0.5 rounded-full">{perk}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════ TRAINING WEBINARS ════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Capacity Training Webinars</p>
            <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">Attend 2 of 3 · Mandatory</span>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { weekend: "Weekend 1", dates: "Sat 7 & Sun 8 June 2026",  pillar: "Pillar 1 — Business Foundations & Legal"   },
              { weekend: "Weekend 2", dates: "Sat 14 & Sun 15 June 2026", pillar: "Pillar 2 — Finance, Growth & Sales"        },
              { weekend: "Weekend 3", dates: "Sat 21 & Sun 22 June 2026", pillar: "Pillar 3 — Pitching & Investor Readiness"  },
            ].map((w) => (
              <div key={w.weekend} className="px-5 sm:px-6 py-4 flex items-start gap-4">
                <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-navy-900">{w.weekend} — {w.dates}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{w.pillar}</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 mt-0.5">Completed</span>
              </div>
            ))}
          </div>
          <div className="px-5 sm:px-6 py-3.5 bg-amber-50/60 border-t border-amber-100">
            <p className="text-amber-700 text-[11px] leading-relaxed">
              <strong>All sessions have passed.</strong> Applicants who attended at least 2 of 3 weekends (both days each) remain eligible for shortlisting.
            </p>
          </div>
        </div>

        {/* ══════════════ JOURNEY TIMELINE ═════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Journey to the Stage</p>
          </div>
          <div className="p-5 sm:p-6">
            <div className="space-y-0">
              {[
                { num: "01", title: "BHC Diagnostic",     desc: "Complete the 20-question BHC via your SME Mall account. The ₦15,000 fee is your entry point.", date: "Opens Apr 1",  done: true,  active: false },
                { num: "02", title: "Full Application",   desc: "Submit your profile, financials, CAC status, and a 2-minute pitch video link.", date: "Closed Jun 24", done: true,  active: false },
                { num: "03", title: "Capacity Webinars",  desc: "Attend Saturday and Sunday training across at least 2 of 3 June weekends. Mandatory for shortlisting.", date: "Jun 7–22",   done: true,  active: false },
                { num: "04", title: "Virtual Semi-Final", desc: "Top 20 applicants pitch virtually. Six finalists advance to the Grand Finale.", date: "Jun 28",      done: false, active: true  },
                { num: "05", title: "Grand Finale",       desc: "Six finalists pitch live at the SME Mall stage before 500+ attendees, investors, and press.", date: "Jul 4, Lagos", done: false, active: false },
              ].map((s, i, arr) => (
                <div key={s.num} className="flex gap-4">
                  {/* Left: number + line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                      s.done   ? "bg-green-500 text-white" :
                      s.active ? "bg-navy-900 text-white ring-4 ring-green-100" :
                                 "bg-gray-100 text-gray-400"
                    }`}>
                      {s.done
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        : s.num}
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`w-0.5 flex-1 my-1.5 min-h-[24px] ${s.done ? "bg-green-200" : "bg-gray-100"}`} />
                    )}
                  </div>
                  {/* Right: content */}
                  <div className={`flex-1 pb-5 ${i === arr.length - 1 ? "pb-0" : ""}`}>
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <p className={`text-sm font-black leading-snug ${s.active ? "text-navy-900" : s.done ? "text-gray-700" : "text-gray-400"}`}>{s.title}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 whitespace-nowrap ${
                        s.done   ? "text-green-700 bg-green-50 border-green-100" :
                        s.active ? "text-navy-900 bg-navy-900/5 border-navy-900/10" :
                                   "text-gray-400 bg-gray-50 border-gray-100"
                      }`}>{s.date}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${s.active ? "text-gray-600" : "text-gray-400"}`}>{s.desc}</p>
                    {s.active && (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                        <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />Current phase
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════ ELIGIBILITY ══════════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 sm:p-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Eligibility Requirements</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {[
              "Business majority female-owned or co-founded and managed by a woman",
              "₦15,000 BHC diagnostic fee paid via SME Mall account",
              "Video pitch (2 minutes max) posted publicly and SME Mall tagged",
              "Attend at least 2 of 3 June training weekends (both days each)",
              "Available in Lagos on July 4, 2026 if shortlisted as a finalist",
              "Application submitted before June 24, 2026 deadline",
            ].map((req) => (
              <div key={req} className="flex items-start gap-2.5">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">{req}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ BOTTOM CTA (not yet applied) ═════════ */}
        {!applied && (
          <div className="relative bg-navy-900 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 65%)" }} />
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 p-6 sm:p-8">
              <div>
                <p className="text-[10px] font-black text-green-400/60 uppercase tracking-widest mb-1.5">Deadline: June 24, 2026</p>
                <p className="text-white font-black text-xl sm:text-2xl mb-1">Ready to pitch for ₦1.5M?</p>
                <p className="text-gray-500 text-sm">Takes about 15 minutes to apply.</p>
              </div>
              <Link href="/dashboard/wibg/apply"
                className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black px-7 py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-green-500/20 whitespace-nowrap active:scale-95">
                Start Application →
              </Link>
            </div>
          </div>
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
