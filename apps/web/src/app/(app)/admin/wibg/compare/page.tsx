"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
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

const CRITERIA = [
  { key: "innovation",       label: "Innovation",        max: 25 },
  { key: "marketViability",  label: "Market Viability",  max: 20 },
  { key: "teamExecution",    label: "Team & Execution",  max: 20 },
  { key: "financialClarity", label: "Financial Clarity", max: 20 },
  { key: "pitchDelivery",    label: "Pitch Delivery",    max: 15 },
] as const;

interface Application {
  id: string; founderName: string; founderEmail: string; founderPhone: string; businessName: string;
  cacStatus: string; bizStage: string; revenue3m: number; proj12m: number;
  problem: string; solution: string; market: string; traction: string; status: string;
}
interface ScoreSummary {
  judgeCount: number;
  average: { innovation: number; marketViability: number; teamExecution: number; financialClarity: number; pitchDelivery: number; total: number };
}
interface Combined { app: Application; scores: ScoreSummary; }

export default function ComparePage() {
  return (
    <Suspense>
      <CompareContent />
    </Suspense>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean);
  const [items, setItems] = useState<Combined[] | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;
    Promise.all(
      ids.map(async (id) => {
        const [appRes, scoreRes] = await Promise.all([
          api.get<{ success: boolean; data: Application }>(`/admin/wibg/${id}`),
          api.get<{ success: boolean; data: ScoreSummary }>(`/admin/wibg/${id}/scores`),
        ]);
        return { app: appRes.data.data, scores: scoreRes.data.data };
      })
    ).then(setItems);
  }, [ids.join(",")]);

  function leaderFor(key: keyof ScoreSummary["average"]) {
    if (!items) return null;
    const max = Math.max(...items.map((it) => it.scores.average[key]));
    return max;
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-7xl space-y-6">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/admin/wibg/scoreboard" className="text-gray-400 hover:text-navy-900 transition-colors">Scoreboard</Link>
          <span className="text-gray-300">/</span>
          <span className="text-navy-900 font-semibold">Compare</span>
        </div>

        <div className="relative bg-navy-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="relative">
            <p className="text-gray-400 text-sm mb-1">WIBG Judging</p>
            <h1 className="text-2xl font-extrabold text-white">Side-by-Side Comparison</h1>
          </div>
        </div>

        {ids.length === 0 && (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-10 text-center">
            <p className="text-gray-500 text-sm">No applications selected. Go back to the Scoreboard and select 2–4 to compare.</p>
          </div>
        )}

        {ids.length > 0 && !items && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ids.map((id) => <div key={id} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />)}
          </div>
        )}

        {items && (
          <div className="overflow-x-auto pb-4">
            <div className="grid gap-4 min-w-max" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(280px, 1fr))` }}>
              {items.map(({ app, scores }) => (
                <div key={app.id} className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="bg-navy-900 p-5">
                    <p className="font-extrabold text-white text-base truncate">{app.businessName}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{app.founderName}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                      <span>{app.cacStatus}</span>
                      <span>·</span>
                      <span>{app.bizStage}</span>
                    </div>
                  </div>

                  {/* Bio facts */}
                  <div className="grid grid-cols-2 gap-2 p-4 border-b border-gray-100">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Revenue (3mo)</p>
                      <p className="text-xs font-bold text-navy-900">₦{Number(app.revenue3m).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Projection (12mo)</p>
                      <p className="text-xs font-bold text-navy-900">₦{Number(app.proj12m).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Pitch content */}
                  <div className="p-4 space-y-3 flex-1 max-h-72 overflow-y-auto">
                    {[
                      { title: "Problem", text: app.problem },
                      { title: "Solution", text: app.solution },
                      { title: "Market", text: app.market },
                      { title: "Traction", text: app.traction },
                    ].map((s) => (
                      <div key={s.title}>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1">{s.title}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{s.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Score breakdown */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Panel Score</p>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">{scores.judgeCount} judge{scores.judgeCount !== 1 ? "s" : ""}</span>
                    </div>
                    {CRITERIA.map((c) => {
                      const val = scores.average[c.key];
                      const isLeader = items.length > 1 && val === leaderFor(c.key) && val > 0;
                      return (
                        <div key={c.key} className={`flex items-center justify-between text-xs rounded-lg px-2.5 py-1.5 ${isLeader ? "bg-emerald-100 text-emerald-800 font-bold" : "text-gray-600"}`}>
                          <span>{c.label}</span>
                          <span className="tabular-nums">{val} / {c.max}</span>
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200">
                      <span className="text-sm font-bold text-navy-900">Total</span>
                      <span className={`text-lg font-extrabold tabular-nums ${items.length > 1 && scores.average.total === leaderFor("total") && scores.average.total > 0 ? "text-emerald-600" : "text-navy-900"}`}>
                        {scores.average.total} / 100
                      </span>
                    </div>
                  </div>

                  <Link href={`/admin/wibg/${app.id}`} className="block text-center text-xs font-bold text-navy-900 hover:text-red-500 py-3 border-t border-gray-100 transition-colors">
                    View Full Application →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
