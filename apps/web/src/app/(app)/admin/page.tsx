"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const navItems = [
  { label: "Overview",      path: "/admin",              icon: <DashIcon /> },
  { label: "Users",         path: "/admin/users",        icon: <UsersIcon /> },
  { label: "Partners",      path: "/admin/partners",     icon: <BuildingIcon /> },
  { label: "Consultants",   path: "/admin/consultants",  icon: <StarIcon /> },
  { label: "Announcements", path: "/admin/content",      icon: <MegaphoneIcon /> },
];

const stats = [
  { label: "Total Users",      value: "0", change: "+0 this week",   icon: "👥", color: "bg-blue-50",    accent: "text-blue-500" },
  { label: "Business Owners",  value: "0", change: "Active accounts", icon: "🏢", color: "bg-emerald-50", accent: "text-emerald-500" },
  { label: "Partners",         value: "0", change: "Lenders onboarded", icon: "🏦", color: "bg-amber-50",   accent: "text-amber-500" },
  { label: "Consultants",      value: "0", change: "Available advisors", icon: "🎓", color: "bg-purple-50",  accent: "text-purple-500" },
];

const quickManage = [
  { title: "User Management",       desc: "View, search, and suspend users across all roles.", link: "/admin/users",        cta: "Manage users",       icon: "👥" },
  { title: "Partner Management",    desc: "Onboard and manage lender partners on the platform.", link: "/admin/partners",     cta: "Manage partners",    icon: "🏦" },
  { title: "Consultant Management", desc: "Review and approve consultant profiles.",              link: "/admin/consultants",  cta: "Manage consultants", icon: "🎓" },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-6xl space-y-8">

        {/* Header */}
        <div className="relative bg-navy-900 rounded-3xl p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-radial from-red-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <p className="text-gray-400 text-sm mb-1">Admin Portal</p>
            <h1 className="text-2xl font-extrabold text-white mb-1">
              Platform Overview
            </h1>
            <p className="text-gray-400 text-sm">
              Logged in as <span className="text-white font-semibold">{user?.firstName} {user?.lastName}</span>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover transition-all">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-4`}>{s.icon}</div>
              <p className="text-3xl font-extrabold text-navy-900 mb-1">{s.value}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className={`text-xs mt-1 ${s.accent}`}>{s.change}</p>
            </div>
          ))}
        </div>

        {/* Management cards */}
        <div>
          <h2 className="text-lg font-extrabold text-navy-900 mb-4">Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Recent activity placeholder */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
          <h2 className="font-extrabold text-navy-900 mb-4">Recent Activity</h2>
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-4">📋</div>
            <p className="font-medium text-gray-500">No activity yet</p>
            <p className="text-sm mt-1">User registrations and platform events will appear here.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DashIcon()     { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function UsersIcon()    { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>; }
function BuildingIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>; }
function StarIcon()     { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>; }
function MegaphoneIcon(){ return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg>; }
