"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InboxIcon, CalendarIcon, NoteIcon, UserIcon } from "@/components/ui/icons";

const navItems = [
  { label: "Advisory Requests", path: "/consultant",          icon: <InboxIcon /> },
  { label: "Sessions",          path: "/consultant/sessions",  icon: <CalendarIcon /> },
  { label: "Client Notes",      path: "/consultant/notes",     icon: <NoteIcon /> },
];

export default function ConsultantDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-5xl space-y-8">

        <div className="relative bg-navy-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-radial from-purple-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <p className="text-gray-400 text-sm mb-1">Consultant Portal</p>
            <h1 className="text-2xl font-extrabold text-white mb-1">Advisory Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Welcome, <span className="text-white font-semibold">{user?.firstName}</span> — manage your sessions and clients here.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Pending Requests",   value: "0", Icon: InboxIcon,    color: "bg-amber-50",   accent: "text-amber-500" },
            { label: "Upcoming Sessions",  value: "0", Icon: CalendarIcon, color: "bg-blue-50",    accent: "text-blue-500" },
            { label: "Active Clients",     value: "0", Icon: UserIcon,     color: "bg-purple-50",  accent: "text-purple-500" },
          ].map((s, i) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300" style={{ animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms both` }}>
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-4`}><s.Icon className={`w-5 h-5 ${s.accent}`} /></div>
              <p className="text-3xl font-extrabold text-navy-900 mb-1">{s.value}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: "Advisory Requests", desc: "New requests from business owners will appear here.", Icon: InboxIcon,    link: "/consultant" },
            { title: "Upcoming Sessions", desc: "Your scheduled sessions will show up here.", Icon: CalendarIcon, link: "/consultant/sessions" },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><card.Icon className="w-6 h-6 text-gray-400" /></div>
                <p className="font-bold text-navy-900 mb-1">{card.title}</p>
                <p className="text-gray-400 text-sm">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
