"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { serviceApi, type AdminUser } from "@/lib/serviceApi";
import { useAuth } from "@/contexts/AuthContext";
import {
  GridIcon, TrophyIcon, WrenchIcon, UsersIcon, BuildingIcon, StarIcon, MegaphoneIcon,
} from "@/components/ui/icons";

// Add a shield icon for super admin
function ShieldIconLocal() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

const navItems = [
  { label: "Overview",      path: "/admin",              icon: <GridIcon /> },
  { label: "WIBG Pipeline", path: "/admin/wibg",         icon: <TrophyIcon /> },
  { label: "Services",      path: "/admin/services",     icon: <WrenchIcon /> },
  { label: "Users",         path: "/admin/users",        icon: <UsersIcon /> },
  { label: "Partners",      path: "/admin/partners",     icon: <BuildingIcon /> },
  { label: "Consultants",   path: "/admin/consultants",  icon: <StarIcon /> },
  { label: "Announcements", path: "/admin/content",      icon: <MegaphoneIcon /> },
];

export default function AdminTeamPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const { data: admins, isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: () => serviceApi.listAdmins().then((r) => r.data.data!),
  });

  function showMsg(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  async function toggleSuper(admin: AdminUser) {
    if (!confirm(`${admin.isSuperAdmin ? "Remove" : "Grant"} Super Admin rights for ${admin.firstName} ${admin.lastName}?`)) return;
    try {
      await serviceApi.toggleSuperAdmin(admin.id, !admin.isSuperAdmin);
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      showMsg(`${admin.isSuperAdmin ? "Removed" : "Granted"} Super Admin rights.`, true);
    } catch {
      showMsg("Failed to update.", false);
    }
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-5xl space-y-6">

        <div className="flex items-center gap-2 text-sm">
          <a href="/admin" className="text-gray-400 hover:text-navy-900 transition-colors">Admin</a>
          <span className="text-gray-300">/</span>
          <span className="text-navy-900 font-semibold">Team Management</span>
        </div>

        <div className="relative bg-navy-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-radial from-red-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldIconLocal />
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Super Admin Only</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">Team Management</h1>
              <p className="text-gray-400 text-sm mt-1">Manage admin accounts and elevated rights. Changes take effect on next login.</p>
            </div>
            <button onClick={() => setShowCreate(true)}
              className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
              + Add Admin
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Accounts</p>
            <span className="text-xs font-bold text-gray-400">{admins?.length ?? 0} accounts</span>
          </div>
          {isLoading && <div className="p-6"><div className="bg-gray-100 rounded-xl h-16 animate-pulse" /></div>}
          <div className="divide-y divide-gray-50">
            {(admins ?? []).map((admin) => (
              <div key={admin.id} className="flex items-center gap-4 px-6 py-4" style={{ animation: "fadeUp 0.4s both" }}>
                <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {admin.firstName[0]}{admin.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-navy-900">{admin.firstName} {admin.lastName}</p>
                    {admin.isSuperAdmin && (
                      <span className="text-[9px] font-black uppercase tracking-wider bg-red-500 text-white px-2 py-0.5 rounded-full">Super Admin</span>
                    )}
                    {admin.id === user?.id && (
                      <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">You</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{admin.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    admin.status === "ACTIVE" ? "text-emerald-700 bg-emerald-50 border-emerald-100" : "text-red-700 bg-red-50 border-red-100"
                  }`}>{admin.status}</span>
                  {admin.id !== user?.id && (
                    <button onClick={() => toggleSuper(admin)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        admin.isSuperAdmin
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}>
                      {admin.isSuperAdmin ? "Remove Super" : "Make Super"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreate && (
        <CreateAdminModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); queryClient.invalidateQueries({ queryKey: ["admin-team"] }); showMsg("Admin account created.", true); }}
        />
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold z-50 ${toast.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}
    </DashboardLayout>
  );
}

function CreateAdminModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit() {
    if (!form.firstName || !form.lastName || !form.email || !form.password) { setError("All fields except phone are required."); return; }
    setSubmitting(true); setError("");
    try {
      await serviceApi.createAdmin({ ...form });
      onCreated();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not create admin.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-navy-900 mb-5">Create Admin Account</h2>
        <div className="space-y-3 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="First name" value={form.firstName} onChange={set("firstName")} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
            <input placeholder="Last name" value={form.lastName} onChange={set("lastName")} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
          </div>
          <input placeholder="Email address" type="email" value={form.email} onChange={set("email")} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
          <input placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
          <input placeholder="Temporary password" type="password" value={form.password} onChange={set("password")} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
          <p className="text-[11px] text-gray-400">The new admin must change their password after first login.</p>
        </div>
        {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">{error}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="border border-gray-200 hover:border-gray-300 text-gray-500 font-semibold px-5 py-3 rounded-xl text-sm transition-all">Cancel</button>
          <button onClick={submit} disabled={submitting} className="flex-1 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all">
            {submitting ? "Creating…" : "Create Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}
