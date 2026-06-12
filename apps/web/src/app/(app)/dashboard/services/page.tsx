"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const navItems = [
  { label: "Dashboard",   path: "/dashboard",           icon: <GridIcon /> },
  { label: "BHC",         path: "/dashboard/bhc",       icon: <ClipboardIcon /> },
  { label: "My Services", path: "/dashboard/services",  icon: <AppsIcon /> },
  { label: "Profile",     path: "/dashboard/profile",   icon: <UserIcon /> },
];

const services = [
  {
    id: "bhc",
    tag: "BHC",
    name: "Business Health Checker",
    desc: "Get your business health score, understand your loan readiness, and match with lenders.",
    features: ["0–100 health score", "Loan readiness report", "Lender matching", "Improvement tips"],
    href: "/dashboard/bhc",
    gradient: "from-blue-600 to-indigo-700",
    emoji: "📋",
    cta: "Open BHC",
  },
  {
    id: "sme-paddy",
    tag: "SME Paddy",
    name: "SME Paddy",
    desc: "Your all-in-one bookkeeping and business management tool. Invoices, expenses, cash flow.",
    features: ["Invoicing & receipts", "Expense tracking", "Cash flow reports", "Stock management"],
    href: "/dashboard/sme-paddy",
    gradient: "from-emerald-500 to-teal-600",
    emoji: "📈",
    cta: "Open SME Paddy",
  },
  {
    id: "wibg",
    tag: "WIBG",
    name: "Women in Business Growth",
    desc: "A dedicated space for women entrepreneurs — mentorship, funding, and peer learning.",
    features: ["Mentor matching", "Women-focused funding", "Peer learning circles", "Growth assessment"],
    href: "/dashboard/wibg",
    gradient: "from-purple-500 to-pink-600",
    emoji: "🌱",
    cta: "Open WIBG",
  },
];

export default function ServicesPage() {
  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-4xl w-full space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900">My Services</h1>
          <p className="text-gray-500 text-sm mt-1">
            All three services are included in your SME Mall account — no extra sign-ups needed.
          </p>
        </div>

        <div className="space-y-5">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden hover:shadow-card-hover transition-all"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${s.gradient}`} />
              <div className="p-6 flex flex-col sm:flex-row sm:items-start gap-5">
                <div className={`w-14 h-14 bg-gradient-to-br ${s.gradient} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                  {s.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.tag}</span>
                      <h2 className="text-lg font-extrabold text-navy-900 mt-0.5">{s.name}</h2>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                    <Link
                      href={s.href}
                      className="flex-shrink-0 w-full sm:w-auto text-center bg-navy-900 hover:bg-red-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all whitespace-nowrap"
                    >
                      {s.cta} →
                    </Link>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                        <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function GridIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function ClipboardIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>; }
function AppsIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" /></svg>; }
function UserIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>; }
