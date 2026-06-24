"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const navItems = [
  { label: "Dashboard",   path: "/dashboard",          icon: <GridIcon /> },
  { label: "BHC",         path: "/dashboard/bhc",      icon: <ClipboardIcon /> },
  { label: "WIBG 2026",   path: "/dashboard/wibg",     icon: <TrophyIcon /> },
  { label: "My Services", path: "/dashboard/services", icon: <AppsIcon /> },
  { label: "Profile",     path: "/dashboard/profile",  icon: <UserIcon /> },
];

const ROLE_LABELS: Record<string, string> = {
  BUSINESS_OWNER: "Business Owner",
  ADMIN:          "Administrator",
  PARTNER:        "Partner",
  CONSULTANT:     "Consultant",
};

const ROLE_COLORS: Record<string, string> = {
  BUSINESS_OWNER: "text-blue-700 bg-blue-50 border-blue-100",
  ADMIN:          "text-red-700 bg-red-50 border-red-100",
  PARTNER:        "text-purple-700 bg-purple-50 border-purple-100",
  CONSULTANT:     "text-amber-700 bg-amber-50 border-amber-100",
};

export default function ProfilePage() {
  const { user } = useAuth();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-NG", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "—";

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();
  const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : "—";
  const roleColor = user?.role ? (ROLE_COLORS[user.role] ?? "text-gray-600 bg-gray-50 border-gray-100") : "";

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-2xl w-full space-y-5">

        {/* ── Page header ─────────────────────────────────── */}
        <div>
          <h1 className="text-xl font-extrabold text-navy-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Your account information and membership details.</p>
        </div>

        {/* ── Identity card ────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          {/* Cover strip */}
          <div className="h-16 bg-navy-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-red-500/10" />
          </div>

          {/* Avatar + name */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-7 mb-5">
              <div className="w-14 h-14 bg-red-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white font-extrabold text-lg leading-none">{initials}</span>
              </div>
              {user?.role && (
                <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border ${roleColor}`}>
                  {roleLabel}
                </span>
              )}
            </div>

            <h2 className="text-lg font-extrabold text-navy-900 leading-tight">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>

            <div className="flex items-center gap-2 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-gray-500">Active account · Member since {memberSince}</span>
            </div>
          </div>
        </div>

        {/* ── Account details ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">Account Details</p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
            {[
              { label: "First Name",    value: user?.firstName ?? "—", icon: <UserIcon className="w-4 h-4" /> },
              { label: "Last Name",     value: user?.lastName  ?? "—", icon: <UserIcon className="w-4 h-4" /> },
              { label: "Email Address", value: user?.email     ?? "—", icon: <MailIcon /> },
              { label: "Phone Number",  value: user?.phone     ?? "Not set", icon: <PhoneIcon /> },
              { label: "Account Role",  value: roleLabel,               icon: <ShieldIcon /> },
              { label: "Member Since",  value: memberSince,             icon: <CalendarIcon /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-gray-400">
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-navy-900 break-words">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Account status ───────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Account Status</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${user?.status === "ACTIVE" ? "bg-emerald-500" : user?.status === "SUSPENDED" ? "bg-red-500" : "bg-amber-500"}`} />
              <div>
                <p className="text-sm font-bold text-navy-900">
                  {user?.status === "ACTIVE" ? "Active" : user?.status === "SUSPENDED" ? "Suspended" : "Pending verification"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {user?.status === "ACTIVE"
                    ? "Your account is in good standing."
                    : user?.status === "SUSPENDED"
                    ? "Contact support if you believe this is an error."
                    : "Please verify your email address."}
                </p>
              </div>
            </div>
            <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border ${
              user?.status === "ACTIVE"    ? "text-emerald-700 bg-emerald-50 border-emerald-100" :
              user?.status === "SUSPENDED" ? "text-red-700 bg-red-50 border-red-100" :
              "text-amber-700 bg-amber-50 border-amber-100"
            }`}>
              {user?.status ?? "Unknown"}
            </span>
          </div>
        </div>

        {/* ── Help strip ───────────────────────────────────── */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0">
              <InfoIcon />
            </div>
            <div>
              <p className="text-sm font-bold text-navy-900">Need to update your details?</p>
              <p className="text-xs text-gray-500 mt-0.5">Contact our support team and we&apos;ll help you make the change.</p>
            </div>
          </div>
          <a
            href="mailto:support@thesmemall.com"
            className="flex-shrink-0 text-xs font-bold text-navy-900 hover:text-red-500 transition-colors whitespace-nowrap"
          >
            Contact support →
          </a>
        </div>

      </div>
    </DashboardLayout>
  );
}

/* ── Icons ───────────────────────────────────────────────────── */
function GridIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function ClipboardIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>; }
function TrophyIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>; }
function AppsIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" /></svg>; }
function UserIcon({ className = "w-5 h-5" }: { className?: string }) { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>; }
function MailIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>; }
function PhoneIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>; }
function ShieldIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>; }
function CalendarIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>; }
function InfoIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>; }
