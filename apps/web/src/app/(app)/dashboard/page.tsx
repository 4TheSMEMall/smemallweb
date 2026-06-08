"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SERVICES } from "@sme-mall/shared";
import { bhcApi, statusColor, statusBarColor } from "@/lib/bhcApi";

const navItems = [
  { label: "Dashboard",   path: "/dashboard",         icon: <GridIcon /> },
  { label: "My Services", path: "/dashboard/services", icon: <AppsIcon /> },
  { label: "Profile",     path: "/dashboard/profile",  icon: <UserIcon /> },
];

const quickActions = [
  { label: "Check BHC Score",    color: "bg-blue-500",    icon: "📊" },
  { label: "Create Invoice",     color: "bg-emerald-500", icon: "📄" },
  { label: "Book a Consultant",  color: "bg-purple-500",  icon: "🎓" },
];

export default function BusinessOwnerDashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const { data: bhcData } = useQuery({
    queryKey: ["bhc-history"],
    queryFn: () => bhcApi.getHistory().then((r) => r.data.data!),
  });

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-5xl space-y-8">

        {/* ── Welcome banner ── */}
        <div className="relative bg-navy-900 rounded-3xl p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-radial from-red-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <p className="text-gray-400 text-sm font-medium mb-1">{greeting}</p>
            <h1 className="text-2xl font-extrabold text-white mb-2">
              {user?.firstName} {user?.lastName} 👋
            </h1>
            <p className="text-gray-400 text-sm max-w-sm">
              Complete your Business Health Check to get matched with lenders and unlock your full dashboard.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link href="/dashboard/bhc" className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 inline-block">
                {bhcData?.latest ? "View BHC Score →" : "Start BHC Assessment →"}
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Takes ~5 minutes
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4">
          {/* BHC Score — live from API, links to full history */}
          <Link
            href="/dashboard/bhc"
            className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover hover:border-blue-200 transition-all block"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg mb-4">📊</div>
            <p className="text-3xl font-extrabold text-navy-900 mb-1">
              {bhcData?.latest ? `${bhcData.latest.percentage}` : "—"}
            </p>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">BHC Score</p>
            {bhcData?.latest ? (
              <span className={`inline-block text-xs font-bold mt-1 px-2 py-0.5 rounded-full border ${statusColor(bhcData.latest.status)}`}>
                {bhcData.latest.status}
              </span>
            ) : (
              <p className="text-blue-500 text-xs mt-1">Take assessment →</p>
            )}
          </Link>

          {[
            { label: "Active Services", value: "3", sub: "All unlocked",  icon: "⚡", accent: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Notifications",  value: "0", sub: "All caught up", icon: "🔔", accent: "text-purple-500",  bg: "bg-purple-50"  },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover transition-all">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center text-lg mb-4`}>{s.icon}</div>
              <p className="text-3xl font-extrabold text-navy-900 mb-1">{s.value}</p>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{s.label}</p>
              <p className={`text-xs mt-1 ${s.accent}`}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Services ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-navy-900">Your Services</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium">3 available</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { ...SERVICES[0], gradient: "from-blue-600 to-indigo-700",  emoji: "📋", href: "/dashboard/bhc" },
              { ...SERVICES[1], gradient: "from-emerald-500 to-teal-600", emoji: "📈", href: "/dashboard/sme-paddy" },
              { ...SERVICES[2], gradient: "from-purple-500 to-pink-600",  emoji: "🌱", href: "/dashboard/wibg" },
            ].map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300 hover:-translate-y-1 block"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${s.gradient}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {s.shortName}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy-900 text-sm mb-1 leading-tight">{s.name}</h3>
                  <p className="text-gray-400 text-xs mb-4 leading-relaxed">{s.description}</p>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-navy-900 group-hover:text-red-500 transition-colors">
                    Open service
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div>
          <h2 className="text-lg font-extrabold text-navy-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                className="flex items-center gap-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-card text-navy-900 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
              >
                <span className="text-base">{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Getting started checklist ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold text-navy-900">Getting Started</h2>
            <span className="text-xs text-gray-400 font-medium">1 of 4 complete</span>
          </div>
          <div className="space-y-3">
            {[
              { label: "Create your account",        done: true  },
              { label: "Complete your BHC assessment", done: false },
              { label: "Set up SME Paddy",             done: false },
              { label: "Connect with a consultant",    done: false },
            ].map((item) => (
              <div key={item.label} className={`flex items-center gap-3 p-3.5 rounded-xl transition-colors ${item.done ? "bg-emerald-50" : "bg-gray-50 hover:bg-gray-100 cursor-pointer"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-emerald-500" : "border-2 border-gray-300"}`}>
                  {item.done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm font-medium ${item.done ? "line-through text-gray-400" : "text-navy-900"}`}>
                  {item.label}
                </span>
                {!item.done && (
                  <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Profile completion</span>
              <span>25%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

function GridIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
}
function AppsIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" /></svg>;
}
function UserIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
}
