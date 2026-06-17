"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const TABS = [
  { id: "bhc",      label: "BHC",       emoji: "📊", full: "Business Health Checker" },
  { id: "paddy",    label: "SME Paddy", emoji: "📈", full: "SME Paddy" },
  { id: "wibg",     label: "WIBG",      emoji: "🌱", full: "Women in Business Growth" },
] as const;

const TAB_MS = 4500;

const BHC_DIMS = [
  { name: "Financial Mgmt",   pct: 72 },
  { name: "Market Position",  pct: 75 },
  { name: "Legal Compliance", pct: 45 },
  { name: "Business Ops",     pct: 58 },
];

function BhcCard({ score, barsActive }: { score: number; barsActive: boolean }) {
  const isGood     = score >= 70;
  const isFair     = score >= 45 && score < 70;
  const statusLabel = isGood ? "Loan Ready" : isFair ? "Fair" : "Critical";
  const statusCls   = isGood ? "text-emerald-400" : isFair ? "text-amber-400" : "text-red-400";
  const barGrad     = isGood ? "from-emerald-400 to-teal-400" : isFair ? "from-amber-400 to-orange-400" : "from-red-400 to-red-500";

  return (
    <div className="bg-navy-800/95 border border-white/10 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">
            Business Health Score
          </p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-white tabular-nums leading-none">{score}</span>
            <span className="text-white/30 text-lg mb-0.5">/100</span>
            <span className={`mb-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 ${statusCls}`}>
              {statusLabel}
            </span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${barGrad} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
          </svg>
        </div>
      </div>

      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGrad} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="space-y-2">
        {BHC_DIMS.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="text-white/40 text-[10px] w-28 shrink-0 truncate">{d.name}</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-700"
                style={{ width: barsActive ? `${d.pct}%` : "0%" }}
              />
            </div>
            <span className="text-white/30 text-[10px] w-7 text-right shrink-0">{d.pct}%</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          3 lenders matched
        </span>
        <span className="text-white/25 text-xs">Taken today</span>
      </div>
    </div>
  );
}

function SmePaddyCard() {
  return (
    <div className="bg-navy-800/95 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-0.5">Invoice #1041</p>
          <p className="text-white font-bold text-sm">Kemi&apos;s Catering Ltd</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
          Paid ✓
        </span>
      </div>

      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-white/40 text-[10px] mb-0.5">Amount</p>
          <p className="text-2xl font-extrabold text-white">₦450,000</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-[10px] mb-0.5">Due date</p>
          <p className="text-white text-sm font-semibold">15 Jun 2026</p>
        </div>
      </div>

      <div>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">June Summary</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Revenue",  value: "₦2.4M", up: true },
            { label: "Expenses", value: "₦890K", up: false },
            { label: "Profit",   value: "₦1.5M", up: true },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-xl p-2.5">
              <p className="text-white/40 text-[9px] mb-0.5">{s.label}</p>
              <p className="text-white text-sm font-bold">{s.value}</p>
              <span className={`text-[9px] font-bold ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                {s.up ? "↑" : "↓"} vs last mo
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
        <p className="text-emerald-400 text-xs font-semibold">Tax report ready</p>
        <button className="text-[10px] text-emerald-300 font-bold hover:text-white transition-colors">
          Download PDF →
        </button>
      </div>
    </div>
  );
}

function WibgCard() {
  return (
    <div className="bg-navy-800/95 border border-white/10 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
        <p className="text-purple-400 text-[10px] font-bold uppercase tracking-widest">New Mentor Match</p>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
          CO
        </div>
        <div>
          <p className="text-white font-bold text-sm">Dr. Chisom Obi</p>
          <p className="text-white/50 text-xs">Senior Partner, FBN Capital</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-amber-400 text-xs">★★★★★</span>
            <span className="text-white/30 text-xs">4.9 · 40+ mentees</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {["Fintech", "FMCG", "Growth Strategy", "Fundraising"].map((tag) => (
          <span key={tag} className="text-[10px] text-purple-300 bg-purple-500/15 border border-purple-500/20 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="border-t border-white/10 pt-3 flex items-center justify-between">
        <div>
          <p className="text-white/40 text-[10px]">Next available</p>
          <p className="text-white text-sm font-semibold">Tomorrow, 10am</p>
        </div>
        <button className="text-xs font-bold bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg transition-colors">
          Book session →
        </button>
      </div>
    </div>
  );
}

export function HeroSection() {
  const [activeTab, setActiveTab]   = useState(0);
  const [progress, setProgress]     = useState(0);
  const [bhcScore, setBhcScore]     = useState(0);
  const [barsActive, setBarsActive] = useState(false);
  const rafRef   = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    let n = 0;
    const tick = setInterval(() => {
      n += 2;
      if (n >= 78) { setBhcScore(78); setBarsActive(true); clearInterval(tick); }
      else           setBhcScore(n);
    }, 20);
    return () => clearInterval(tick);
  }, []);

  const advance = useCallback(() => {
    setActiveTab((prev) => (prev + 1) % TABS.length);
  }, []);

  useEffect(() => {
    setProgress(0);
    startRef.current = performance.now();
    const frame = (now: number) => {
      const pct = Math.min(100, ((now - startRef.current) / TAB_MS) * 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(frame);
      else            advance();
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [activeTab, advance]);

  return (
    <section className="relative min-h-[100dvh] bg-navy-950 flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-40" />
      <div className="absolute inset-0 bg-gradient-radial from-red-500/10 via-transparent to-transparent" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-gradient-radial from-blue-500/6 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 sm:pt-24 sm:pb-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">

        {/* Left — copy */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            Nigeria&apos;s #1 SME Super App
          </div>

          <h1 className="text-[2rem] sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            The score that gets<br />
            Nigerian businesses{" "}
            <span className="text-gradient">funded.</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-7 max-w-lg">
            Know exactly where you stand. Fix what&apos;s holding you back.
            Get matched to the right lender — in one platform built for Nigerian SMEs.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:shadow-glow-red hover:-translate-y-0.5"
            >
              Get your BHC score
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 text-gray-300 hover:text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/[0.04]"
            >
              See how it works
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-gray-500">
            {["Score in 15 mins", "6-dimension report", "Instant lender match"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right — product showcase */}
        <div className="w-full">
          {/* Tabs */}
          <div className="flex gap-1 mb-3 bg-white/5 border border-white/10 p-1 rounded-xl w-full sm:w-fit">
            {TABS.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === idx
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Auto-rotate progress bar */}
          <div className="h-px bg-white/10 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-red-500/60 rounded-full"
              style={{ width: `${progress}%`, transition: "none" }}
            />
          </div>

          {/* Product preview cards */}
          {activeTab === 0 && <BhcCard score={bhcScore} barsActive={barsActive} />}
          {activeTab === 1 && <SmePaddyCard />}
          {activeTab === 2 && <WibgCard />}

          <p className="mt-3 text-center text-white/25 text-[10px] sm:text-xs tracking-wide">
            {TABS[activeTab].full}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
