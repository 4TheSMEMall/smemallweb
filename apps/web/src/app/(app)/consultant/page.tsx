"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const navItems = [
  { label: "Advisory Requests", path: "/consultant",          icon: <InboxIcon /> },
  { label: "Sessions",          path: "/consultant/sessions",  icon: <CalIcon /> },
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
            { label: "Pending Requests",   value: "0", icon: "📥", color: "bg-amber-50",   accent: "text-amber-500" },
            { label: "Upcoming Sessions",  value: "0", icon: "📅", color: "bg-blue-50",    accent: "text-blue-500" },
            { label: "Active Clients",     value: "0", icon: "👤", color: "bg-purple-50",  accent: "text-purple-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover transition-all">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-4`}>{s.icon}</div>
              <p className="text-3xl font-extrabold text-navy-900 mb-1">{s.value}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: "Advisory Requests", desc: "New requests from business owners will appear here.", icon: "📥", link: "/consultant" },
            { title: "Upcoming Sessions", desc: "Your scheduled sessions will show up here.", icon: "📅", link: "/consultant/sessions" },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mb-4">{card.icon}</div>
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

function InboxIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" /></svg>; }
function CalIcon()   { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>; }
function NoteIcon()  { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>; }
