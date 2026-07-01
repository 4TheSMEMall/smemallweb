"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import {
  GridIcon, TrophyIcon, WrenchIcon, UsersIcon, BuildingIcon, StarIcon, MegaphoneIcon,
  ClipboardIcon, AcademicCapIcon,
} from "@/components/ui/icons";

function ShieldSmall() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>;
}

const navItems = [
  { label: "Overview",      path: "/admin",              icon: <GridIcon /> },
  { label: "WIBG Pipeline", path: "/admin/wibg",         icon: <TrophyIcon /> },
  { label: "Services",      path: "/admin/services",     icon: <WrenchIcon /> },
  { label: "Users",         path: "/admin/users",        icon: <UsersIcon /> },
  { label: "Partners",      path: "/admin/partners",     icon: <BuildingIcon /> },
  { label: "Consultants",   path: "/admin/consultants",  icon: <StarIcon /> },
  { label: "Announcements", path: "/admin/content",      icon: <MegaphoneIcon /> },
  { label: "Team",          path: "/admin/team",         icon: <ShieldSmall /> },
];

const quickManage = [
  { title: "WIBG Pipeline",          desc: "Review applications, shortlist Top 20, advance to Top 6, and assign winners.",     link: "/admin/wibg",        cta: "Manage pipeline",    Icon: TrophyIcon },
  { title: "User Management",        desc: "View, search, and suspend users across all roles.",                                link: "/admin/users",        cta: "Manage users",       Icon: UsersIcon },
  { title: "Partner Management",     desc: "Onboard and manage lender partners on the platform.",                              link: "/admin/partners",     cta: "Manage partners",    Icon: BuildingIcon },
  { title: "Consultant Management",  desc: "Review and approve consultant profiles.",                                          link: "/admin/consultants",  cta: "Manage consultants", Icon: AcademicCapIcon },
];

interface AdminStats {
  totalUsers: number;
  bhcCompletions: number;
  wibgTotal: number;
  byStatus: Record<string, number>;
  attendees: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    api.get<{ success: boolean; data: AdminStats }>("/admin/stats")
      .then((r) => setStats(r.data.data))
      .catch(() => {});
  }, []);

  const statCards = [
    { label: "Total Users",      value: stats ? String(stats.totalUsers)      : "—", change: "Registered accounts",   Icon: UsersIcon,      color: "bg-blue-50",    accent: "text-blue-500" },
    { label: "BHC Completions",  value: stats ? String(stats.bhcCompletions)  : "—", change: "Health checks done",    Icon: ClipboardIcon,  color: "bg-emerald-50", accent: "text-emerald-500" },
    { label: "WIBG Applications",value: stats ? String(stats.wibgTotal)       : "—", change: "Submitted this season", Icon: TrophyIcon,     color: "bg-amber-50",   accent: "text-amber-500" },
    { label: "Webinar Attendees",value: stats ? String(stats.attendees)       : "—", change: "Registered for training",Icon: AcademicCapIcon,color: "bg-purple-50",  accent: "text-purple-500" },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-6xl space-y-8">

        {/* Header */}
        <div className="relative bg-navy-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-radial from-red-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-gray-400 text-sm mb-1">Admin Portal</p>
              <h1 className="text-2xl font-extrabold text-white mb-1">Platform Overview</h1>
              <p className="text-gray-400 text-sm">
                Logged in as <span className="text-white font-semibold">{user?.firstName} {user?.lastName}</span>
                {user?.isSuperAdmin && (
                  <span className="ml-2 text-[9px] font-black uppercase tracking-wider bg-red-500/80 text-white px-2 py-0.5 rounded-full">Super Admin</span>
                )}
              </p>
            </div>
            {user?.isSuperAdmin && (
              <a href="/admin/team" className="flex-shrink-0 text-xs font-bold text-white/70 hover:text-white border border-white/15 hover:border-white/30 px-3 py-2 rounded-xl transition-colors">
                Manage Team →
              </a>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((s, i) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300" style={{ animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms both` }}>
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-4`}><s.Icon className={`w-5 h-5 ${s.accent}`} /></div>
              <p className="text-3xl font-extrabold text-navy-900 mb-1">{s.value}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className={`text-xs mt-1 ${s.accent}`}>{s.change}</p>
            </div>
          ))}
        </div>

        {/* WIBG status breakdown */}
        {stats && stats.wibgTotal > 0 && (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-navy-900">WIBG Pipeline Status</h2>
              <a href="/admin/wibg" className="text-xs font-bold text-navy-900 hover:text-red-500 transition-colors">View all →</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: "SUBMITTED",    label: "Submitted",    color: "bg-blue-50 text-blue-700"    },
                { key: "UNDER_REVIEW", label: "Under Review", color: "bg-indigo-50 text-indigo-700" },
                { key: "TOP_20",       label: "Top 20",       color: "bg-green-50 text-green-700"  },
                { key: "TOP_6",        label: "Top 6",        color: "bg-amber-50 text-amber-700"  },
                { key: "WINNER_1ST",   label: "1st Place",    color: "bg-yellow-50 text-yellow-700" },
                { key: "WINNER_2ND",   label: "2nd Place",    color: "bg-gray-50 text-gray-700"    },
                { key: "WINNER_3RD",   label: "3rd Place",    color: "bg-orange-50 text-orange-700" },
                { key: "REJECTED",     label: "Rejected",     color: "bg-red-50 text-red-700"      },
              ].map((s) => (
                <div key={s.key} className={`${s.color} rounded-xl px-4 py-3`}>
                  <p className="text-2xl font-extrabold">{stats.byStatus[s.key] ?? 0}</p>
                  <p className="text-xs font-semibold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Management cards */}
        <div>
          <h2 className="text-lg font-extrabold text-navy-900 mb-4">Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickManage.map((card) => (
              <a
                key={card.title}
                href={card.link}
                className="group bg-white rounded-2xl p-6 shadow-card border border-gray-100 hover:shadow-card-hover hover:border-red-100 transition-all duration-300 block"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-50 group-hover:bg-red-50 flex items-center justify-center mb-4 transition-colors">
                  <card.Icon className="w-5 h-5 text-navy-900 group-hover:text-red-500 transition-colors" />
                </div>
                <h3 className="font-extrabold text-navy-900 mb-2 group-hover:text-red-500 transition-colors">{card.title}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{card.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 group-hover:text-red-500 transition-colors">
                  {card.cta}
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

