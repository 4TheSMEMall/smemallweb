"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { serviceApi, statusBadgeColor, statusLabel, type Provider, type ServiceRequestWithDetails } from "@/lib/serviceApi";

const navItems = [
  { label: "Overview",      path: "/admin",              icon: <DashIcon /> },
  { label: "WIBG Pipeline", path: "/admin/wibg",         icon: <TrophyIcon /> },
  { label: "Services",      path: "/admin/services",     icon: <WrenchIcon /> },
  { label: "Users",         path: "/admin/users",        icon: <UsersIcon /> },
  { label: "Partners",      path: "/admin/partners",     icon: <BuildingIcon /> },
  { label: "Consultants",   path: "/admin/consultants",  icon: <StarIcon /> },
  { label: "Announcements", path: "/admin/content",      icon: <MegaphoneIcon /> },
];

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [tempPasswordResult, setTempPasswordResult] = useState<{ businessName: string; tempPassword: string } | null>(null);
  const [assigning, setAssigning] = useState<ServiceRequestWithDetails | null>(null);

  const { data: providers, isLoading: loadingProviders } = useQuery({
    queryKey: ["admin-providers"],
    queryFn:  () => serviceApi.getProviders().then((r) => r.data.data!),
  });

  const { data: pending, isLoading: loadingPending } = useQuery({
    queryKey: ["admin-pending-requests"],
    queryFn:  () => serviceApi.getPendingServiceRequests().then((r) => r.data.data!),
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-requests"] });
  }

  async function handleCancel(req: ServiceRequestWithDetails) {
    if (!confirm(`Cancel the request for "${req.gap.gapTitle}"? The gap will reopen for the SME.`)) return;
    await serviceApi.cancelServiceRequest(req.id);
    refresh();
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-6xl space-y-8">

        {/* Header */}
        <div className="relative bg-navy-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-radial from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <p className="text-gray-400 text-sm mb-1">Admin Portal</p>
            <h1 className="text-2xl font-extrabold text-white mb-1">Service Marketplace</h1>
            <p className="text-gray-400 text-sm">Manage providers and match pending BHC gap requests.</p>
          </div>
        </div>

        {/* Pending requests */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-navy-900">Pending Requests</h2>
              <p className="text-gray-400 text-sm mt-0.5">SMEs waiting to be matched with a provider</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              {pending?.length ?? 0} pending
            </span>
          </div>

          {loadingPending && <div className="p-6"><div className="bg-gray-100 rounded-xl h-16 animate-pulse" /></div>}

          {!loadingPending && (pending ?? []).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mb-3">✅</div>
              <p className="font-bold text-navy-900 mb-1">No pending requests</p>
              <p className="text-gray-400 text-sm">All caught up.</p>
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {(pending ?? []).map((req) => (
              <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{req.gap.section} · {req.gap.priority}</p>
                  <p className="font-bold text-navy-900">{req.gap.gapTitle}</p>
                  {req.smeBusinessOwner && (
                    <p className="text-xs text-gray-500 mt-1">{req.smeBusinessOwner.firstName} {req.smeBusinessOwner.lastName} · {req.smeBusinessOwner.email}</p>
                  )}
                  {req.gap.serviceTag && (
                    <span className="inline-block mt-2 text-[10px] font-bold text-navy-900 bg-gray-100 px-2 py-0.5 rounded-full">
                      {req.gap.serviceTag.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleCancel(req)}
                    className="text-xs font-semibold text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setAssigning(req)}
                    className="text-xs font-bold text-white bg-navy-900 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors"
                  >
                    Assign Provider →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Providers directory */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-navy-900">Provider Directory</h2>
              <p className="text-gray-400 text-sm mt-0.5">Vetted providers available for assignment</p>
            </div>
            <button
              onClick={() => setShowAddProvider(true)}
              className="text-xs font-bold text-white bg-navy-900 hover:bg-red-500 px-4 py-2.5 rounded-xl transition-colors"
            >
              + Add Provider
            </button>
          </div>

          {loadingProviders && <div className="p-6"><div className="bg-gray-100 rounded-xl h-16 animate-pulse" /></div>}

          {!loadingProviders && (providers ?? []).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mb-3">🧰</div>
              <p className="font-bold text-navy-900 mb-1">No providers yet</p>
              <p className="text-gray-400 text-sm">Add your first vetted service provider to start matching requests.</p>
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {(providers ?? []).map((p) => (
              <div key={p.id} className="p-6 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-navy-900">{p.businessName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.contactEmail} · {p.contactPhone}</p>
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {p.serviceTags.map((t) => (
                      <span key={t} className="text-[10px] font-bold text-navy-900 bg-gray-100 px-2 py-0.5 rounded-full">{t.replace(/_/g, " ")}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-navy-900">★ {p.avgRating.toFixed(1)}</p>
                  <p className="text-[11px] text-gray-400">{p.reviewCount} review{p.reviewCount !== 1 ? "s" : ""}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.active ? "text-emerald-700 bg-emerald-50" : "text-gray-500 bg-gray-100"}`}>
                    {p.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddProvider && (
        <AddProviderModal
          onClose={() => setShowAddProvider(false)}
          onCreated={(businessName, tempPassword) => {
            setShowAddProvider(false);
            setTempPasswordResult({ businessName, tempPassword });
            refresh();
          }}
        />
      )}

      {tempPasswordResult && (
        <TempPasswordModal result={tempPasswordResult} onClose={() => setTempPasswordResult(null)} />
      )}

      {assigning && (
        <AssignProviderModal
          request={assigning}
          providers={providers ?? []}
          onClose={() => setAssigning(null)}
          onAssigned={() => { setAssigning(null); refresh(); }}
        />
      )}
    </DashboardLayout>
  );
}

function AddProviderModal({ onClose, onCreated }: { onClose: () => void; onCreated: (businessName: string, tempPassword: string) => void }) {
  const [form, setForm] = useState({ businessName: "", firstName: "", lastName: "", contactEmail: "", contactPhone: "", serviceTags: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await serviceApi.createProvider({
        businessName: form.businessName,
        firstName: form.firstName,
        lastName: form.lastName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        serviceTags: form.serviceTags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      onCreated(res.data.data!.provider.businessName, res.data.data!.tempPassword);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not create provider.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-navy-900 mb-1">Add Service Provider</h2>
        <p className="text-gray-500 text-sm mb-6">Creates a login account (role: Provider) plus their provider profile.</p>

        <div className="space-y-3 mb-5">
          <input placeholder="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
            <input placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
          </div>
          <input placeholder="Contact email" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
          <input placeholder="Contact phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
          <input placeholder="Service tags, comma separated (e.g. cac_filing, bookkeeping)" value={form.serviceTags} onChange={(e) => setForm({ ...form, serviceTags: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
        </div>

        {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-navy-900 font-semibold px-5 py-3 rounded-xl transition-all text-sm">
            Cancel
          </button>
          <button onClick={submit} disabled={submitting} className="flex-1 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all text-sm">
            {submitting ? "Creating…" : "Create Provider"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TempPasswordModal({ result, onClose }: { result: { businessName: string; tempPassword: string }; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">✓</div>
        <h2 className="text-xl font-extrabold text-navy-900 mb-2">{result.businessName} added</h2>
        <p className="text-gray-500 text-sm mb-5">Share this temporary password with the provider — it won&apos;t be shown again.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-lg font-mono font-bold text-navy-900">{result.tempPassword}</p>
        </div>
        <button onClick={onClose} className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 rounded-xl transition-all text-sm">
          Done
        </button>
      </div>
    </div>
  );
}

function AssignProviderModal({ request, providers, onClose, onAssigned }: {
  request: ServiceRequestWithDetails; providers: Provider[]; onClose: () => void; onAssigned: () => void;
}) {
  const [providerId, setProviderId] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const activeProviders = providers.filter((p) => p.active);

  async function submit() {
    if (!providerId) return;
    setSubmitting(true);
    try {
      await serviceApi.assignServiceRequest(request.id, providerId, price || undefined, notes || undefined);
      onAssigned();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{request.gap.section} · {request.gap.priority}</p>
        <h2 className="text-xl font-extrabold text-navy-900 mb-5">{request.gap.gapTitle}</h2>

        <p className="text-sm font-semibold text-navy-900 mb-2">Assign provider</p>
        <select
          value={providerId}
          onChange={(e) => setProviderId(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors mb-4"
        >
          <option value="">Select a provider…</option>
          {activeProviders.map((p) => (
            <option key={p.id} value={p.id}>{p.businessName} — ★ {p.avgRating.toFixed(1)}</option>
          ))}
        </select>

        {activeProviders.length === 0 && (
          <p className="text-amber-700 text-xs bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
            No active providers yet. Add one from the directory first.
          </p>
        )}

        <input placeholder="Agreed price (optional, e.g. ₦15,000)" value={price} onChange={(e) => setPrice(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors mb-3" />
        <textarea placeholder="Internal notes (optional)" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors mb-5 resize-none" />

        <div className="flex gap-3">
          <button onClick={onClose} className="border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-navy-900 font-semibold px-5 py-3 rounded-xl transition-all text-sm">
            Cancel
          </button>
          <button onClick={submit} disabled={!providerId || submitting} className="flex-1 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all text-sm">
            {submitting ? "Assigning…" : "Assign →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DashIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function TrophyIcon()    { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>; }
function UsersIcon()     { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>; }
function BuildingIcon()  { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>; }
function StarIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>; }
function MegaphoneIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg>; }
function WrenchIcon()    { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>; }
