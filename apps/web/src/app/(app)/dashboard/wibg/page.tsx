"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const navItems = [
  { label: "Dashboard",   path: "/dashboard",         icon: <GridIcon /> },
  { label: "BHC",         path: "/dashboard/bhc",     icon: <ClipboardIcon /> },
  { label: "WIBG 2026",   path: "/dashboard/wibg",    icon: <TrophyIcon /> },
  { label: "My Services", path: "/dashboard/services", icon: <AppsIcon /> },
  { label: "Profile",     path: "/dashboard/profile",  icon: <UserIcon /> },
];

const JOURNEY = [
  { num: "01", title: "BHC Diagnostic",    desc: "Complete the 20-question Business Health Check via your SME Mall account. The ₦15,000 fee is your entry point.", date: "Opens Apr 1" },
  { num: "02", title: "Full Application",  desc: "Submit your business profile, financials, CAC status, and a 2-minute video pitch link.", date: "Closes June 24" },
  { num: "03", title: "Capacity Webinars", desc: "Attend Saturday and Sunday training sessions across at least 2 of 3 June weekends. Mandatory for shortlisting.", date: "June 7 – 22" },
  { num: "04", title: "Virtual Semi-Final",desc: "Top 20 applicants pitch virtually. Six finalists advance to the Grand Finale.", date: "June 28" },
  { num: "05", title: "Grand Finale",      desc: "Six finalists pitch live at the SME Mall stage before 500+ attendees, investors, and press.", date: "July 4, Lagos" },
];

export default function WibgOverviewPage() {
  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-4xl w-full space-y-6">

        {/* ── Hero banner ─────────────────────────────────── */}
        <div className="relative bg-navy-900 rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_80%_-10%,rgba(34,197,94,0.12),transparent)]" />
          <div className="relative p-7 sm:p-10">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400">WIBG × SME Mall</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">2026 Edition</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3">
              Women in Business Grant<br />
              <span className="text-green-400">Pitch Competition 2026</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl mb-7">
              A structured capacity-building program and live pitch competition for female-led businesses.
              Win equity-free capital, expert mentorship, and direct investor access.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/wibg/apply"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-7 py-3 rounded-xl transition-all text-sm"
              >
                Apply to Pitch
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/wibg"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 border border-white/[0.12] hover:border-white/25 text-gray-400 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
              >
                Full Info Page
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Prize stats ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { val: "₦3M",    label: "Total Prize Pool"   },
            { val: "6",      label: "Finalists Selected" },
            { val: "500+",   label: "Live Audience"      },
            { val: "July 4", label: "Grand Finale"       },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <p className="text-2xl font-extrabold text-navy-900">{s.val}</p>
              <p className="text-gray-400 text-xs mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Prize breakdown ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Grant Prizes</p>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { place: "1st Place", amount: "₦1,500,000", icon: "🏆", perks: "Equity-free seed capital · 1-on-1 VC coaching · Exhibition space" },
              { place: "2nd Place", amount: "₦1,000,000", icon: "🥈", perks: "Grant capital · 6 months mentorship · Co-working ticket" },
              { place: "3rd Place", amount: "₦500,000",   icon: "🥉", perks: "Grant capital · 3 months capacity building training" },
            ].map((p) => (
              <div key={p.place} className="px-6 py-4 flex items-center gap-4">
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-navy-900 font-bold text-sm">{p.place}</p>
                  <p className="text-gray-400 text-xs truncate">{p.perks}</p>
                </div>
                <p className="font-extrabold text-navy-900 text-base flex-shrink-0">{p.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Webinar dates ────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Capacity Training Webinars</p>
            <span className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">Mandatory — Attend 2 of 3</span>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { weekend: "Weekend 1", dates: "Sat 7 & Sun 8 June 2026",  pillar: "Pillar 1 — Business Foundations & Legal", tag: "Past" },
              { weekend: "Weekend 2", dates: "Sat 14 & Sun 15 June 2026", pillar: "Pillar 2 — Finance, Growth & Sales",        tag: "Past" },
              { weekend: "Weekend 3", dates: "Sat 21 & Sun 22 June 2026", pillar: "Pillar 3 — Pitching & Investor Readiness",  tag: "Past" },
            ].map((w) => (
              <div key={w.weekend} className="px-6 py-4 flex items-start gap-4">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-navy-900 font-bold text-sm">{w.weekend} — {w.dates}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{w.pillar}</p>
                </div>
                <span className="text-[11px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap mt-0.5">{w.tag}</span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
            <p className="text-amber-700 text-xs leading-relaxed">
              <strong>Note:</strong> All webinar sessions have now passed. If you attended at least 2 of 3 weekends (both Saturday and Sunday each), you remain eligible for shortlisting.
            </p>
          </div>
        </div>

        {/* ── Competition journey ──────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Journey to the Stage</p>
          </div>
          <div className="divide-y divide-gray-50">
            {JOURNEY.map((s) => (
              <div key={s.num} className="px-6 py-4 flex items-start gap-4">
                <p className="text-2xl font-extrabold text-gray-100 leading-none flex-shrink-0 w-8 select-none">{s.num}</p>
                <div className="flex-1">
                  <p className="text-navy-900 font-bold text-sm">{s.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{s.desc}</p>
                </div>
                <span className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 mt-0.5">
                  {s.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Key requirements ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Eligibility Requirements</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Business majority female-owned or co-founded and managed by a woman",
              "₦15,000 BHC diagnostic fee paid via SME Mall account",
              "Video pitch (2 minutes max) submitted as a shareable link",
              "Attend at least 2 of 3 June training weekends (both days each)",
              "Available in Lagos on July 4, 2026 if shortlisted",
              "Application submitted before June 24, 2026 deadline",
            ].map((req) => (
              <div key={req} className="flex items-start gap-2.5">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{req}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <div className="bg-green-500 rounded-2xl p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-green-900/60 text-xs font-bold uppercase tracking-widest mb-1">Deadline: June 24, 2026</p>
            <p className="text-white font-extrabold text-xl">Ready to pitch for ₦1.5M?</p>
            <p className="text-green-100/70 text-sm mt-1">Start your application — takes about 15 minutes.</p>
          </div>
          <Link
            href="/dashboard/wibg/apply"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-green-700 font-bold px-7 py-3.5 rounded-xl hover:bg-green-50 transition-all text-sm whitespace-nowrap"
          >
            Start Application →
          </Link>
        </div>

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
