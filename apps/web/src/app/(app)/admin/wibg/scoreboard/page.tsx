"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

type CriterionKey = typeof CRITERIA[number]["key"];

interface ScoreSet { innovation: number; marketViability: number; teamExecution: number; financialClarity: number; pitchDelivery: number; total: number; }
interface ScoreboardRow {
  id: string; businessName: string; founderName: string; status: string;
  judgeCount: number; average: ScoreSet; myScore: ScoreSet | null;
}

const STATUS_OPTIONS = ["TOP_20", "TOP_6", "UNDER_REVIEW", "SUBMITTED"];

export default function WibgScoreboardPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("TOP_20");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [scoring, setScoring] = useState<ScoreboardRow | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: rows, isLoading } = useQuery({
    queryKey: ["wibg-scoreboard", status],
    queryFn: () => api.get<{ success: boolean; data: ScoreboardRow[] }>(`/admin/wibg/scoreboard?status=${status}`).then((r) => r.data.data),
  });

  const list = rows ?? [];

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      return next;
    });
  }

  function exportCsv() {
    const header = ["Business", "Founder", "Judges", ...CRITERIA.map((c) => c.label), "Total Avg"];
    const lines = list.map((r) => [
      r.businessName, r.founderName, String(r.judgeCount),
      ...CRITERIA.map((c) => String(r.average[c.key])),
      String(r.average.total),
    ]);
    const csv = [header, ...lines].map((row) => row.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wibg-scoreboard-${status.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-6xl space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/admin/wibg" className="text-gray-400 hover:text-navy-900 transition-colors">Pipeline</Link>
          <span className="text-gray-300">/</span>
          <span className="text-navy-900 font-semibold">Scoreboard</span>
        </div>

        {/* Header */}
        <div className="relative bg-navy-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-radial from-amber-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">WIBG Judging</p>
              <h1 className="text-2xl font-extrabold text-white mb-1">Scoreboard</h1>
              <p className="text-gray-400 text-sm">Score against the rubric. Panel average updates as each judge submits.</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setSelected(new Set()); }}
                className="bg-white/10 border border-white/15 text-white text-sm font-semibold rounded-xl px-3 py-2.5 outline-none focus:border-white/30"
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="text-navy-900">{s.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-gray-400">
            {selected.size > 0 ? `${selected.size} selected (max 4)` : `${list.length} application${list.length !== 1 ? "s" : ""}`}
          </p>
          <div className="flex gap-2">
            <button onClick={exportCsv} disabled={list.length === 0} className="text-xs font-bold text-navy-900 border border-gray-200 hover:border-gray-300 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-40">
              Export CSV
            </button>
            <Link
              href={selected.size >= 2 ? `/admin/wibg/compare?ids=${[...selected].join(",")}` : "#"}
              aria-disabled={selected.size < 2}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-colors ${
                selected.size >= 2 ? "bg-navy-900 hover:bg-red-500 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
              }`}
            >
              Compare Selected →
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          {isLoading && <div className="p-6"><div className="bg-gray-100 rounded-xl h-16 animate-pulse" /></div>}

          {!isLoading && list.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <p className="font-bold text-navy-900 mb-1">No applications at this stage</p>
              <p className="text-gray-400 text-sm">Try a different status filter.</p>
            </div>
          )}

          <div className="divide-y divide-gray-50">
            {list.map((row, i) => {
              const locked = row.status.startsWith("WINNER_");
              return (
                <div key={row.id} style={{ animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 40}ms both` }}>
                  <div className="flex items-center gap-4 p-4 sm:p-5 hover:bg-gray-50/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleSelect(row.id)}
                      disabled={!selected.has(row.id) && selected.size >= 4}
                      className="rounded flex-shrink-0"
                    />
                    <button onClick={() => setExpanded(expanded === row.id ? null : row.id)} className="flex-1 min-w-0 text-left">
                      <p className="font-bold text-navy-900 text-sm truncate">{row.businessName}</p>
                      <p className="text-gray-400 text-xs truncate">{row.founderName}</p>
                    </button>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      {row.judgeCount} judge{row.judgeCount !== 1 ? "s" : ""}
                    </span>
                    <div className="text-right flex-shrink-0 w-16">
                      <p className="text-lg font-extrabold text-navy-900 tabular-nums">{row.average.total || "—"}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">avg /100</p>
                    </div>
                    <button
                      onClick={() => setScoring(row)}
                      disabled={locked}
                      className={`flex-shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        row.myScore ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" : "bg-navy-900 hover:bg-red-500 text-white"
                      }`}
                    >
                      {locked ? "Locked" : row.myScore ? `Your score: ${row.myScore.total}` : "Score Now"}
                    </button>
                  </div>

                  {expanded === row.id && (
                    <div className="bg-gray-50 px-5 pb-4 -mt-1">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {CRITERIA.map((c) => (
                          <div key={c.key} className="bg-white rounded-lg p-3 border border-gray-100">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1">{c.label}</p>
                            <p className="text-sm font-extrabold text-navy-900">{row.average[c.key]}<span className="text-gray-400 text-xs">/{c.max}</span></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {scoring && (
        <ScoreModal
          row={scoring}
          onClose={() => setScoring(null)}
          onSaved={() => { setScoring(null); queryClient.invalidateQueries({ queryKey: ["wibg-scoreboard"] }); }}
        />
      )}
    </DashboardLayout>
  );
}

function ScoreModal({ row, onClose, onSaved }: { row: ScoreboardRow; onClose: () => void; onSaved: () => void }) {
  const [values, setValues] = useState<Record<CriterionKey, number>>({
    innovation: row.myScore?.innovation ?? 0,
    marketViability: row.myScore?.marketViability ?? 0,
    teamExecution: row.myScore?.teamExecution ?? 0,
    financialClarity: row.myScore?.financialClarity ?? 0,
    pitchDelivery: row.myScore?.pitchDelivery ?? 0,
  });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = CRITERIA.reduce((sum, c) => sum + values[c.key], 0);

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      await api.post(`/admin/wibg/${row.id}/score`, { ...values, notes: notes || undefined });
      onSaved();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not save score.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Score against rubric</p>
        <h2 className="text-xl font-extrabold text-navy-900 mb-6">{row.businessName}</h2>

        <div className="space-y-5 mb-5">
          {CRITERIA.map((c) => (
            <div key={c.key}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-semibold text-navy-900">{c.label}</p>
                <span className="text-sm font-bold text-navy-900 tabular-nums">{values[c.key]} / {c.max}</span>
              </div>
              <input
                type="range" min={0} max={c.max} step={1}
                value={values[c.key]}
                onChange={(e) => setValues((v) => ({ ...v, [c.key]: Number(e.target.value) }))}
                className="w-full accent-navy-900"
              />
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between mb-5">
          <span className="text-sm font-semibold text-gray-500">Your total</span>
          <span className="text-xl font-extrabold text-navy-900">{total} / 100</span>
        </div>

        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes for this score (optional)..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors resize-none mb-5"
        />

        {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-navy-900 font-semibold px-5 py-3 rounded-xl transition-all text-sm">
            Cancel
          </button>
          <button onClick={submit} disabled={submitting} className="flex-1 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all text-sm">
            {submitting ? "Saving…" : "Submit Score"}
          </button>
        </div>
      </div>
    </div>
  );
}
