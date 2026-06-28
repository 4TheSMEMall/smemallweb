"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import {
  GridIcon, TrophyIcon, WrenchIcon, UsersIcon, BuildingIcon, StarIcon, MegaphoneIcon,
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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status?: string;
  createdAt: string;
}

interface PageData {
  users: User[];
  total: number;
  page: number;
  pages: number;
}

export default function UsersPage() {
  const [data, setData]       = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole]       = useState("");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [acting, setActing]   = useState<string | null>(null);
  const [toast, setToast]     = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => { load(); }, [role, page]);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "25" });
      if (role)   params.set("role", role);
      if (search) params.set("search", search);
      const r = await api.get<{ success: boolean; data: PageData }>(`/admin/users?${params}`);
      setData(r.data.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load();
  }

  async function toggleStatus(user: User) {
    const next = user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    const action = next === "SUSPENDED" ? "suspend" : "reactivate";
    if (!confirm(`Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`)) return;
    setActing(user.id);
    try {
      await api.patch(`/admin/users/${user.id}/status`, { status: next });
      showToast(`User ${action}d.`, true);
      load();
    } catch {
      showToast("Failed to update user.", false);
    } finally {
      setActing(null);
    }
  }

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  const ROLE_BADGE: Record<string, string> = {
    ADMIN:      "bg-red-50 text-red-700 border-red-100",
    PARTNER:    "bg-blue-50 text-blue-700 border-blue-100",
    CONSULTANT: "bg-purple-50 text-purple-700 border-purple-100",
    USER:       "bg-gray-50 text-gray-600 border-gray-100",
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-7xl space-y-6">

        {/* Header */}
        <div className="relative bg-navy-900 rounded-2xl p-7 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="relative">
            <a href="/admin" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">← Admin</a>
            <h1 className="text-xl font-extrabold text-white mt-1">User Management</h1>
            <p className="text-gray-400 text-sm">{data ? `${data.total} registered user${data.total !== 1 ? "s" : ""}` : "Loading…"}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy-900 placeholder-gray-400 focus:outline-none focus:border-navy-900 focus:ring-2 focus:ring-navy-900/10 transition-colors"
              />
              <button type="submit" className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">Search</button>
            </form>
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value); setPage(1); }}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy-900 focus:outline-none focus:border-navy-900 transition-colors"
            >
              <option value="">All roles</option>
              <option value="USER">User</option>
              <option value="PARTNER">Partner</option>
              <option value="CONSULTANT">Consultant</option>
              <option value="ADMIN">Admin</option>
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
          ) : !data || data.users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><UsersIcon className="w-6 h-6 text-gray-400" /></div>
              <p className="font-medium text-gray-500">No users found</p>
              <p className="text-sm mt-1">{role || search ? "Try adjusting your filters." : "No users registered yet."}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3.5">Name</th>
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3.5">Email</th>
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3.5">Role</th>
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3.5">Status</th>
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3.5">Joined</th>
                      <th className="px-5 py-3.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-navy-900 font-semibold text-sm">{user.firstName} {user.lastName}</p>
                          <p className="text-gray-400 text-xs mt-0.5 font-mono">{user.id.slice(-8)}</p>
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-sm">{user.email}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${ROLE_BADGE[user.role] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                            user.status === "SUSPENDED"
                              ? "bg-red-50 text-red-700 border-red-100"
                              : "bg-green-50 text-green-700 border-green-100"
                          }`}>
                            {user.status ?? "ACTIVE"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {user.role !== "ADMIN" && (
                            <button
                              onClick={() => toggleStatus(user)}
                              disabled={acting === user.id}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                                user.status === "SUSPENDED"
                                  ? "text-green-700 bg-green-50 hover:bg-green-100"
                                  : "text-red-600 bg-red-50 hover:bg-red-100"
                              }`}
                            >
                              {acting === user.id ? "…" : user.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.pages > 1 && (
                <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400">Page {data.page} of {data.pages}</p>
                  <div className="flex gap-2">
                    <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="text-xs font-bold text-navy-900 disabled:text-gray-300 hover:text-red-500 transition-colors">← Prev</button>
                    <button disabled={page === data.pages} onClick={() => setPage((p) => p + 1)} className="text-xs font-bold text-navy-900 disabled:text-gray-300 hover:text-red-500 transition-colors">Next →</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold z-50 ${toast.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}
    </DashboardLayout>
  );
}

