"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

/* ── Nav ─────────────────────────────────────────────────────── */
const navItems = [
  { label: "Dashboard",   path: "/dashboard",           icon: <GridIcon /> },
  { label: "BHC",         path: "/dashboard/bhc",       icon: <ClipboardIcon /> },
  { label: "WIBG 2026",   path: "/dashboard/wibg",      icon: <TrophyIcon /> },
  { label: "My Services", path: "/dashboard/services",  icon: <AppsIcon /> },
  { label: "Profile",     path: "/dashboard/profile",   icon: <UserIcon /> },
];

/* ── Active services ─────────────────────────────────────────── */
const ACTIVE = [
  {
    id: "bhc",
    category: "Diagnostics",
    name: "Business Health Checker",
    desc: "A 20-question diagnostic across 6 business dimensions — Finance, Operations, Marketing, HR, Strategy, and Technology. Get your 0–100 score, understand loan readiness, and receive a personalised action plan.",
    features: ["0–100 health score", "6-pillar breakdown", "Lender matching", "90-day action plan", "Improvement tracking"],
    href: "/dashboard/bhc",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    borderHover: "hover:border-blue-100",
    accentBar: "bg-gradient-to-r from-blue-500 to-indigo-600",
    ctaColor: "bg-navy-900 hover:bg-blue-600",
    cta: "Open BHC",
    icon: <BhcIcon />,
  },
  {
    id: "grants",
    category: "Grants & Funding",
    name: "Grant Matching",
    desc: "Discover and apply for business grants matched to your sector, stage, and BHC profile. The WIBG 2026 grant is now open — ₦3M in equity-free funding for female-led businesses across Nigeria.",
    features: ["BHC-matched grants", "WIBG 2026 open now", "₦3M prize pool", "End-to-end application", "Status tracking"],
    href: "/dashboard/wibg",
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    borderHover: "hover:border-green-100",
    accentBar: "bg-gradient-to-r from-green-500 to-emerald-600",
    ctaColor: "bg-navy-900 hover:bg-green-600",
    cta: "Open Grant Matching",
    icon: <GiftIcon />,
    badge: { label: "WIBG 2026 Open", cls: "text-green-700 bg-green-50 border-green-200" },
  },
];

/* ── Coming soon services ────────────────────────────────────── */
const COMING_SOON = [
  {
    id: "paddy",
    category: "Finance",
    name: "SME Paddy",
    desc: "Bookkeeping, invoicing, expense tracking, and cash flow reports built for Nigerian SMEs.",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
    accentCls: "border-teal-100",
    icon: <ReceiptIcon />,
  },
  {
    id: "training",
    category: "Learning",
    name: "Training Hub",
    desc: "BHC-matched video courses and assessments across Finance, Marketing, Strategy, and more.",
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    accentCls: "border-purple-100",
    icon: <PlayIcon />,
  },
  {
    id: "mentorship",
    category: "Growth",
    name: "Mentorship",
    desc: "Match with verified Nigerian business mentors. Book sessions, message, and track goals.",
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
    accentCls: "border-orange-100",
    icon: <PeopleIcon />,
  },
  {
    id: "loan",
    category: "Finance",
    name: "Loan Matching",
    desc: "Get matched to banks, DFIs, and MFBs based on your BHC score. Apply end-to-end in-app.",
    iconColor: "text-sky-600",
    iconBg: "bg-sky-50",
    accentCls: "border-sky-100",
    icon: <WalletIcon />,
  },
  {
    id: "equity",
    category: "Investment",
    name: "Equity Matching",
    desc: "Connect with angel investors, VCs, and PE funds aligned to your sector and growth stage.",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    accentCls: "border-amber-100",
    icon: <TrendIcon />,
  },
  {
    id: "community",
    category: "Network",
    name: "Community",
    desc: "WhatsApp and Telegram channels with 12K+ Nigerian SMEs. Funding alerts, peer support, events.",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    accentCls: "border-violet-100",
    icon: <ChatIcon />,
  },
  {
    id: "cooperative",
    category: "Membership",
    name: "Cooperative",
    desc: "Join the SME Mall cooperative. Access low-interest loans, group insurance, and savings.",
    iconColor: "text-stone-600",
    iconBg: "bg-stone-50",
    accentCls: "border-stone-100",
    icon: <HomeIcon />,
  },
];

/* ── Page ────────────────────────────────────────────────────── */
export default function ServicesPage() {
  const total  = ACTIVE.length + COMING_SOON.length;
  const live   = ACTIVE.length;

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-4xl w-full space-y-8">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900">My Services</h1>
            <p className="text-gray-500 text-sm mt-1">
              The full SME Mall platform — your operating system for business growth.
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-2xl font-extrabold text-navy-900">{live}<span className="text-gray-300 font-light">/{total}</span></p>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Live now</p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Platform progress</p>
            <p className="text-[11px] font-semibold text-gray-400">{Math.round((live / total) * 100)}% launched</p>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-navy-900 to-red-500 rounded-full transition-all"
              style={{ width: `${Math.round((live / total) * 100)}%` }}
            />
          </div>
        </div>

        {/* ── Active services ─────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Available Now</p>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {live} live
            </span>
          </div>

          {ACTIVE.map((s) => (
            <div
              key={s.id}
              className={`bg-white rounded-2xl border border-gray-100 shadow-card ${s.borderHover} hover:shadow-card-hover transition-all overflow-hidden`}
            >
              {/* Accent bar */}
              <div className={`h-1 w-full ${s.accentBar}`} />

              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">

                  {/* Icon */}
                  <div className={`w-12 h-12 ${s.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 ${s.iconColor}`}>
                    {s.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.category}</span>
                      {s.badge && (
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${s.badge.cls}`}>
                          {s.badge.label}
                        </span>
                      )}
                    </div>
                    <h2 className="text-base font-extrabold text-navy-900 mb-2">{s.name}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>

                    {/* Feature chips */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {s.features.map((f) => (
                        <span key={f} className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                          <CheckMini />
                          {f}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={s.href}
                      className={`inline-flex items-center gap-2 ${s.ctaColor} text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all`}
                    >
                      {s.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Coming soon ─────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Coming Soon</p>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
              {COMING_SOON.length} in development
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {COMING_SOON.map((s) => (
              <div
                key={s.id}
                className={`relative bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden select-none`}
              >
                {/* Subtle lock watermark */}
                <div className="absolute top-4 right-4 opacity-30">
                  <LockIcon />
                </div>

                <div className="flex items-start gap-4">
                  {/* Icon — desaturated */}
                  <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconColor} opacity-70`}>
                    {s.icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.category}</span>
                    </div>
                    <p className="text-sm font-extrabold text-navy-900 mb-1.5">{s.name}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>

                {/* Bottom strip */}
                <div className="mt-4 pt-3.5 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                    Coming soon
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">Included in your plan</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Platform footer ──────────────────────────────────── */}
        <div className="bg-navy-900 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <RocketIcon />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-white mb-1">All {total} services are included in your SME Mall account</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              No extra subscriptions. As each service launches, it automatically becomes available to you. We&apos;re building the complete African business operating system — one tool at a time.
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

/* ── Micro icons ─────────────────────────────────────────────── */
function CheckMini() {
  return (
    <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}
function ArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
}

/* ── Service icons ───────────────────────────────────────────── */
function BhcIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm9.75-10.5c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v17.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V2.625zm-9.75 10.5c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 19.875v-6.75z" /></svg>; }
function GiftIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1016.875 7.5c0-.073 0-.14-.004-.21M12 4.875A2.625 2.625 0 107.125 7.5c0-.073 0-.14.004-.21M12 4.875c-.073 0-.14 0-.21.004a2.625 2.625 0 10-4.54 2.621m4.75-2.625c.073 0 .14 0 .21.004a2.625 2.625 0 114.54 2.621M3 11.25h18M12 11.25v10.5" /></svg>; }
function ReceiptIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>; }
function PlayIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>; }
function PeopleIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>; }
function WalletIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>; }
function TrendIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>; }
function ChatIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>; }
function HomeIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>; }
function LockIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>; }
function RocketIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-white/60"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>; }

/* ── Nav icons ───────────────────────────────────────────────── */
function TrophyIcon()    { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>; }
function GridIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function ClipboardIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>; }
function AppsIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" /></svg>; }
function UserIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>; }
