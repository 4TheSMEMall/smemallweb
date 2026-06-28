"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { serviceApi, statusBadgeColor, statusLabel, type ServiceRequestWithDetails } from "@/lib/serviceApi";
import { GridIcon, ClipboardIcon, TrophyIcon, AppsIcon, UserIcon, WrenchIcon } from "@/components/ui/icons";

const navItems = [
  { label: "Dashboard",   path: "/dashboard",          icon: <GridIcon /> },
  { label: "BHC",         path: "/dashboard/bhc",      icon: <ClipboardIcon /> },
  { label: "WIBG 2026",   path: "/dashboard/wibg",     icon: <TrophyIcon /> },
  { label: "My Services", path: "/dashboard/services", icon: <AppsIcon /> },
  { label: "Profile",     path: "/dashboard/profile",  icon: <UserIcon /> },
];

export default function FixItTrackerPage() {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<ServiceRequestWithDetails | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["service-requests"],
    queryFn:  () => serviceApi.getMyServiceRequests().then((r) => r.data.data!),
  });

  const list = requests ?? [];
  const activeCount = list.filter((r) => r.status !== "COMPLETED" && r.status !== "CANCELLED").length;
  const completedCount = list.filter((r) => r.status === "COMPLETED").length;

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-4xl w-full space-y-5">

        {/* ── Breadcrumb ──────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard/bhc/gaps" className="text-gray-400 hover:text-navy-900 text-sm transition-colors">
            My Fix-It Plan
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-navy-900 text-sm font-semibold">Fix-It Tracker</span>
        </div>

        {/* ── Header ────────────────────────────────────────── */}
        <div className="relative bg-navy-900 rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
          <div className="relative p-6 sm:p-8">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-3">Fix-It Tracker</p>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-5">
              {list.length === 0 ? "No service requests yet" : `${activeCount} active · ${completedCount} completed`}
            </h1>
          </div>
        </div>

        {/* ── Loading ─────────────────────────────────────── */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((i) => <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />)}
          </div>
        )}

        {/* ── Empty ───────────────────────────────────────── */}
        {!isLoading && list.length === 0 && (
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-navy-50 rounded-3xl flex items-center justify-center mx-auto mb-5"><WrenchIcon className="w-9 h-9 text-navy-300" /></div>
            <h3 className="text-xl font-extrabold text-navy-900 mb-2">Nothing requested yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              When you click &quot;Fix This&quot; on a gap, your request will show up here so you can track it through to completion.
            </p>
            <Link href="/dashboard/bhc/gaps" className="inline-flex items-center gap-2 bg-navy-900 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all">
              View My Fix-It Plan →
            </Link>
          </div>
        )}

        {/* ── Requests list ─────────────────────────────────── */}
        <div className="space-y-3">
          {list.map((req, i) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
              style={{ animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both` }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{req.gap.section}</p>
                  <p className="font-extrabold text-navy-900 text-base">{req.gap.gapTitle}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${statusBadgeColor(req.status)}`}>
                  {statusLabel(req.status)}
                </span>
              </div>

              {req.provider ? (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-navy-900">{req.provider.businessName}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{req.provider.contactEmail} · {req.provider.contactPhone}</p>
                  {req.priceAgreed && <p className="text-[11px] text-gray-500 mt-1">Agreed price: <span className="font-semibold text-navy-900">{req.priceAgreed}</span></p>}
                  {req.providerNotes && <p className="text-[11px] text-gray-500 mt-1">Note: {req.providerNotes}</p>}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-4">Awaiting provider assignment — our team is matching you with a vetted provider.</p>
              )}

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-[11px] text-gray-400">
                  Requested {new Date(req.requestedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </p>

                {req.status === "COMPLETED" && !req.ratedAt && (
                  <button
                    onClick={() => setRating(req)}
                    className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    Confirm & Rate ★
                  </button>
                )}
                {req.ratedAt && req.starRating && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={s <= req.starRating! ? "text-amber-400" : "text-gray-200"}>★</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Rating modal ──────────────────────────────────── */}
      {rating && (
        <RatingModal
          request={rating}
          onClose={() => setRating(null)}
          onSubmitted={() => {
            setRating(null);
            queryClient.invalidateQueries({ queryKey: ["service-requests"] });
            queryClient.invalidateQueries({ queryKey: ["bhc-gaps"] });
          }}
        />
      )}
    </DashboardLayout>
  );
}

function RatingModal({ request, onClose, onSubmitted }: { request: ServiceRequestWithDetails; onClose: () => void; onSubmitted: () => void }) {
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      await serviceApi.rateService(request.id, stars, review || undefined);
      onSubmitted();
    } catch {
      setError("Could not submit your rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8">
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Job Completed</p>
        <h2 className="text-xl font-extrabold text-navy-900 mb-1">{request.gap.gapTitle}</h2>
        <p className="text-gray-500 text-sm mb-6">
          {request.provider?.businessName ?? "Your provider"} marked this as done. Confirm and rate your experience to close out this gap.
        </p>

        <p className="text-sm font-semibold text-navy-900 mb-2">Your rating</p>
        <div className="flex items-center gap-1.5 mb-5">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setStars(s)} className="text-3xl leading-none transition-colors">
              <span className={s <= stars ? "text-amber-400" : "text-gray-200"}>★</span>
            </button>
          ))}
        </div>

        <textarea
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write a review (optional)..."
          className="w-full bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-navy-900 rounded-xl px-4 py-3 text-navy-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900/10 transition-colors resize-none mb-4"
        />

        {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-navy-900 font-semibold px-5 py-3 rounded-xl transition-all text-sm">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="flex-1 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all text-sm"
          >
            {submitting ? "Submitting…" : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}

