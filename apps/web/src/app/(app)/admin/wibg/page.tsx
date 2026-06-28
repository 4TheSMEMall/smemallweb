"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import {
  GridIcon, TrophyIcon, WrenchIcon, UsersIcon, BuildingIcon, StarIcon, MegaphoneIcon, ClipboardIcon,
} from "@/components/ui/icons";

const navItems = [
  { label: "Overview",      path: "/admin",              icon: <GridIcon /> },
  { label: "WIBG Pipeline", path: "/admin/wibg",         icon: <TrophyIcon /> },
  { label: "Services",      path: "/admin/services",     icon: <WrenchIcon /> },
  { label: "Users",         path: "/admin/users",        icon: <UsersIcon /> },
  { label: "Partners",      path: "/admin/partners",     icon: <BuildingIcon /> },
  { label: "Consultants",   path: "/admin/consultants",  icon: <StarIcon /> },
  { label: "Announcements", path: "/admin/content",      icon: <MegaphoneIcon /> },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  SUBMITTED:    { label: "Submitted",    color: "bg-blue-50 text-blue-700 border-blue-100" },
  UNDER_REVIEW: { label: "Under Review", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  TOP_20:       { label: "Top 20",       color: "bg-green-50 text-green-700 border-green-100" },
  TOP_6:        { label: "Top 6",        color: "bg-amber-50 text-amber-700 border-amber-100" },
  WINNER_1ST:   { label: "1st Place",    color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  WINNER_2ND:   { label: "2nd Place",    color: "bg-gray-50 text-gray-600 border-gray-100" },
  WINNER_3RD:   { label: "3rd Place",    color: "bg-orange-50 text-orange-700 border-orange-100" },
  REJECTED:     { label: "Rejected",     color: "bg-red-50 text-red-700 border-red-100" },
};

interface Application {
  id: string;
  founderName: string;
  founderEmail: string;
  businessName: string;
  cacStatus: string;
  status: string;
  createdAt: string;
  adminNotes?: string;
}

interface PageData {
  applications: Application[];
  total: number;
  page: number;
  pages: number;
}

export default function WibgPipelinePage() {
  const router = useRouter();
  const [data, setData]       = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState("");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);

  useEffect(() => {
    load();
  }, [status, page]);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "25" });
      if (status) params.set("status", status);
      if (search) params.set("search", search);
      const r = await api.get<{ success: boolean; data: PageData }>(`/admin/wibg?${params}`);
      setData(r.data.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load();
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-7xl space-y-6">

        {/* Header */}
        <div className="relative bg-navy-900 rounded-2xl p-7 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="relative flex items-center justify-between">
            <div>
              <a href="/admin" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">← Admin</a>
              <h1 className="text-xl font-extrabold text-white mt-1">WIBG 2026 Pipeline</h1>
              <p className="text-gray-400 text-sm">{data ? `${data.total} application${data.total !== 1 ? "s" : ""}` : "Loading…"}</p>
            </div>
            <span className="text-green-400 text-xs font-bold bg-green-900/30 border border-green-800/40 px-3 py-1.5 rounded-full">WIBG 2026</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or business…"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy-900 placeholder-gray-400 focus:outline-none focus:border-navy-900 focus:ring-2 focus:ring-navy-900/10 transition-colors"
              />
              <button type="submit" className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">Search</button>
            </form>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy-900 focus:outline-none focus:border-navy-900 transition-colors"
            >
              <option value="">All statuses</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <svg className="w-6 h-6 animate-spin text-gray-300" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : !data || data.applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><ClipboardIcon className="w-6 h-6 text-gray-400" /></div>
              <p className="font-medium text-gray-500">No applications found</p>
              <p className="text-sm mt-1">{status || search ? "Try adjusting your filters." : "No one has applied yet."}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3.5">Founder / Business</th>
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3.5">Email</th>
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3.5">Status</th>
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3.5">Applied</th>
                      <th className="px-5 py-3.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.applications.map((app) => {
                      const s = STATUS_LABELS[app.status] ?? { label: app.status, color: "bg-gray-50 text-gray-600 border-gray-100" };
                      return (
                        <tr
                          key={app.id}
                          onClick={() => router.push(`/admin/wibg/${app.id}`)}
                          className="hover:bg-gray-50/60 cursor-pointer transition-colors"
                        >
                          <td className="px-5 py-4">
                            <p className="text-navy-900 font-semibold text-sm">{app.founderName}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{app.businessName}</p>
                          </td>
                          <td className="px-5 py-4 text-gray-500 text-sm">{app.founderEmail}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.color}`}>{s.label}</span>
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                            {new Date(app.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className="text-xs font-bold text-navy-900 hover:text-red-500 transition-colors">Review →</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400">Page {data.page} of {data.pages}</p>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="text-xs font-bold text-navy-900 disabled:text-gray-300 hover:text-red-500 transition-colors"
                    >← Prev</button>
                    <button
                      disabled={page === data.pages}
                      onClick={() => setPage((p) => p + 1)}
                      className="text-xs font-bold text-navy-900 disabled:text-gray-300 hover:text-red-500 transition-colors"
                    >Next →</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

