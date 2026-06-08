"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const navItems = [
  { label: "Matched Businesses", path: "/partner",          icon: <ListIcon /> },
  { label: "Loan Pipeline",      path: "/partner/pipeline",  icon: <ChartIcon /> },
];

export default function PartnerDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-5xl space-y-8">

        <div className="relative bg-navy-900 rounded-3xl p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-radial from-blue-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <p className="text-gray-400 text-sm mb-1">Partner Portal</p>
            <h1 className="text-2xl font-extrabold text-white mb-1">Matched Businesses</h1>
            <p className="text-gray-400 text-sm">
              Welcome, <span className="text-white font-semibold">{user?.firstName}</span> — businesses matched to your lending criteria appear here.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Matched Businesses",   value: "0", icon: "🏢", color: "bg-blue-50",    accent: "text-blue-500" },
            { label: "Pending Applications", value: "0", icon: "⏳", color: "bg-amber-50",   accent: "text-amber-500" },
            { label: "Approved Loans",       value: "₦0", icon: "✅", color: "bg-emerald-50", accent: "text-emerald-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover transition-all">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-4`}>{s.icon}</div>
              <p className="text-3xl font-extrabold text-navy-900 mb-1">{s.value}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-extrabold text-navy-900">Business Matches</h2>
            <p className="text-gray-400 text-sm mt-0.5">Businesses eligible for your loan products</p>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-4">🏦</div>
            <p className="font-bold text-navy-900 mb-1">No matches yet</p>
            <p className="text-gray-400 text-sm max-w-sm">
              Businesses that complete their BHC assessment and meet your lending criteria will automatically appear here.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ListIcon()  { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>; }
function ChartIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>; }
