"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ListIcon, ChartBarIcon, BuildingIcon, ClockIcon, CheckCircleIcon } from "@/components/ui/icons";

const navItems = [
  { label: "Matched Businesses", path: "/partner",          icon: <ListIcon /> },
  { label: "Loan Pipeline",      path: "/partner/pipeline",  icon: <ChartBarIcon /> },
];

export default function PartnerDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-5xl space-y-8">

        <div className="relative bg-navy-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Matched Businesses",   value: "0",  Icon: BuildingIcon,     color: "bg-blue-50",    accent: "text-blue-500" },
            { label: "Pending Applications", value: "0",  Icon: ClockIcon,        color: "bg-amber-50",   accent: "text-amber-500" },
            { label: "Approved Loans",       value: "₦0", Icon: CheckCircleIcon,  color: "bg-emerald-50", accent: "text-emerald-500" },
          ].map((s, i) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300" style={{ animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms both` }}>
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-4`}><s.Icon className={`w-5 h-5 ${s.accent}`} /></div>
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
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><BuildingIcon className="w-7 h-7 text-gray-400" /></div>
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
