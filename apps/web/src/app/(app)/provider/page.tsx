"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceApi, statusBadgeColor, statusLabel, type ServiceRequestWithDetails, type ServiceRequestStatus } from "@/lib/serviceApi";
import { InboxIcon, WrenchIcon, CheckCircleIcon, StarIcon } from "@/components/ui/icons";

const navItems = [
  { label: "My Jobs", path: "/provider", icon: <InboxIcon /> },
];

const NEXT_STATUS: Partial<Record<ServiceRequestStatus, ServiceRequestStatus>> = {
  ASSIGNED:    "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
};

const NEXT_LABEL: Partial<Record<ServiceRequestStatus, string>> = {
  ASSIGNED:    "Start Job →",
  IN_PROGRESS: "Mark Completed →",
};

export default function ProviderDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const { data: provider } = useQuery({
    queryKey: ["provider-me"],
    queryFn:  () => serviceApi.getProviderMe().then((r) => r.data.data!),
  });

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["provider-jobs"],
    queryFn:  () => serviceApi.getProviderJobs().then((r) => r.data.data!),
  });

  const list = jobs ?? [];
  const active = list.filter((j) => j.status === "ASSIGNED" || j.status === "IN_PROGRESS");
  const completed = list.filter((j) => j.status === "COMPLETED");

  async function advance(job: ServiceRequestWithDetails) {
    const next = NEXT_STATUS[job.status];
    if (!next) return;
    setUpdating(job.id);
    try {
      await serviceApi.updateJobStatus(job.id, next, notesDraft[job.id]);
      queryClient.invalidateQueries({ queryKey: ["provider-jobs"] });
    } finally {
      setUpdating(null);
    }
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-5xl space-y-8">

        <div className="relative bg-navy-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-radial from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <p className="text-gray-400 text-sm mb-1">Provider Portal</p>
            <h1 className="text-2xl font-extrabold text-white mb-1">{provider?.businessName ?? `Welcome, ${user?.firstName}`}</h1>
            <p className="text-gray-400 text-sm">
              {provider ? (
                <>★ {provider.avgRating.toFixed(1)} · {provider.reviewCount} review{provider.reviewCount !== 1 ? "s" : ""}</>
              ) : "Manage the jobs assigned to you here."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Active Jobs",    value: String(active.length),    Icon: WrenchIcon,      color: "bg-amber-50",   accent: "text-amber-500" },
            { label: "Completed",      value: String(completed.length), Icon: CheckCircleIcon, color: "bg-emerald-50", accent: "text-emerald-500" },
            { label: "Rating",         value: provider ? provider.avgRating.toFixed(1) : "—", Icon: StarIcon, color: "bg-blue-50", accent: "text-blue-500" },
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
            <h2 className="font-extrabold text-navy-900">My Jobs</h2>
            <p className="text-gray-400 text-sm mt-0.5">Requests assigned to you by SME Mall admin</p>
          </div>

          {isLoading && (
            <div className="p-6 space-y-3">
              {[1, 2].map((i) => <div key={i} className="bg-gray-100 rounded-xl h-20 animate-pulse" />)}
            </div>
          )}

          {!isLoading && list.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><InboxIcon className="w-7 h-7 text-gray-400" /></div>
              <p className="font-bold text-navy-900 mb-1">No jobs yet</p>
              <p className="text-gray-400 text-sm max-w-sm">
                When admin assigns you a service request, it will show up here.
              </p>
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {list.map((job) => (
              <div key={job.id} className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{job.gap.section}</p>
                    <p className="font-extrabold text-navy-900">{job.gap.gapTitle}</p>
                    <p className="text-gray-500 text-sm mt-1">{job.gap.description}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${statusBadgeColor(job.status)}`}>
                    {statusLabel(job.status)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 flex-wrap">
                  {job.smeBusinessOwner && <span>{job.smeBusinessOwner.firstName} {job.smeBusinessOwner.lastName}</span>}
                  {job.priceAgreed && <span>· Agreed price: <strong className="text-navy-900">{job.priceAgreed}</strong></span>}
                </div>

                {(job.status === "ASSIGNED" || job.status === "IN_PROGRESS") && (
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      placeholder="Add a note for the SME (optional)"
                      value={notesDraft[job.id] ?? ""}
                      onChange={(e) => setNotesDraft((d) => ({ ...d, [job.id]: e.target.value }))}
                      className="flex-1 border border-gray-200 hover:border-gray-300 focus:border-navy-900 rounded-xl px-3 py-2 text-sm outline-none transition-colors"
                    />
                    <button
                      onClick={() => advance(job)}
                      disabled={updating === job.id}
                      className="flex-shrink-0 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      {updating === job.id ? "Updating…" : NEXT_LABEL[job.status]}
                    </button>
                  </div>
                )}

                {job.status === "COMPLETED" && !job.ratedAt && (
                  <p className="text-amber-600 text-xs font-semibold">Waiting for the SME to confirm and rate this job.</p>
                )}
                {job.ratedAt && job.starRating && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={s <= job.starRating! ? "text-amber-400" : "text-gray-200"}>★</span>
                    ))}
                    {job.reviewText && <span className="text-xs text-gray-500 ml-2">&quot;{job.reviewText}&quot;</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

