"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/lib/api";

const navItems = [
  { label: "Overview",      path: "/admin",              icon: <DashIcon /> },
  { label: "WIBG Pipeline", path: "/admin/wibg",         icon: <TrophyIcon /> },
  { label: "Services",      path: "/admin/services",     icon: <WrenchIcon /> },
  { label: "Users",         path: "/admin/users",        icon: <UsersIcon /> },
  { label: "Partners",      path: "/admin/partners",     icon: <BuildingIcon /> },
  { label: "Consultants",   path: "/admin/consultants",  icon: <StarIcon /> },
  { label: "Announcements", path: "/admin/content",      icon: <MegaphoneIcon /> },
];

const quickManage = [
  { title: "WIBG Pipeline",          desc: "Review applications, shortlist Top 20, advance to Top 6, and assign winners.",     link: "/admin/wibg",        cta: "Manage pipeline",    icon: "🏆" },
  { title: "User Management",        desc: "View, search, and suspend users across all roles.",                                link: "/admin/users",        cta: "Manage users",       icon: "👥" },
  { title: "Partner Management",     desc: "Onboard and manage lender partners on the platform.",                              link: "/admin/partners",     cta: "Manage partners",    icon: "🏦" },
  { title: "Consultant Management",  desc: "Review and approve consultant profiles.",                                          link: "/admin/consultants",  cta: "Manage consultants", icon: "🎓" },
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
    { label: "Total Users",      value: stats ? String(stats.totalUsers)      : "—", change: "Registered accounts",   icon: "👥", color: "bg-blue-50",    accent: "text-blue-500" },
    { label: "BHC Completions",  value: stats ? String(stats.bhcCompletions)  : "—", change: "Health checks done",    icon: "📋", color: "bg-emerald-50", accent: "text-emerald-500" },
    { label: "WIBG Applications",value: stats ? String(stats.wibgTotal)       : "—", change: "Submitted this season", icon: "🏆", color: "bg-amber-50",   accent: "text-amber-500" },
    { label: "Webinar Attendees",value: stats ? String(stats.attendees)       : "—", change: "Registered for training",icon: "🎓", color: "bg-purple-50",  accent: "text-purple-500" },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-6xl space-y-8">

        {/* Header */}
        <div className="relative bg-navy-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-radial from-red-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <p className="text-gray-400 text-sm mb-1">Admin Portal</p>
            <h1 className="text-2xl font-extrabold text-white mb-1">Platform Overview</h1>
            <p className="text-gray-400 text-sm">
              Logged in as <span className="text-white font-semibold">{user?.firstName} {user?.lastName}</span>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover transition-all">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-4`}>{s.icon}</div>
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
                <div className="text-3xl mb-4">{card.icon}</div>
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

function DashIcon()     { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function TrophyIcon()   { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>; }
function UsersIcon()    { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>; }
function BuildingIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>; }
function StarIcon()     { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>; }
function WrenchIcon()   { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>; }
function MegaphoneIcon(){ return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg>; }
