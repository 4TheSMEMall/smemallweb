"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const DIMENSIONS = [
  { name: "Financial Management",    pct: 72, desc: "Cash flow, records, bank accounts" },
  { name: "Business Operations",     pct: 58, desc: "Processes, targets, supply chain" },
  { name: "Market Position",         pct: 75, desc: "Competitive edge, customer base" },
  { name: "Legal & Compliance",      pct: 45, desc: "Registration, licences, tax filings" },
  { name: "Human Resources",         pct: 63, desc: "Team structure, policies, training" },
  { name: "Technology & Innovation", pct: 51, desc: "Digital tools, online presence" },
];

const TIERS = [
  {
    threshold: 85,
    label:     "Premium Partners",
    desc:      "Top-tier banks and DFIs",
    examples:  ["GTBank", "Access Bank", "Zenith"],
    range:     "₦5M – ₦500M",
    color:     "border-blue-500/40 bg-blue-500/10",
    badge:     "bg-blue-500/20 text-blue-300",
    dot:       "bg-blue-500",
  },
  {
    threshold: 70,
    label:     "Commercial Banks",
    desc:      "Commercial banks and fintechs",
    examples:  ["Sterling Bank", "LAPO MFB", "FairMoney"],
    range:     "₦1M – ₦50M",
    color:     "border-emerald-500/40 bg-emerald-500/10",
    badge:     "bg-emerald-500/20 text-emerald-300",
    dot:       "bg-emerald-500",
  },
  {
    threshold: 50,
    label:     "Microfinance & Fintech",
    desc:      "Digital lenders and MFBs",
    examples:  ["Carbon", "Renmoney", "Kuda Business"],
    range:     "₦100K – ₦5M",
    color:     "border-amber-500/40 bg-amber-500/10",
    badge:     "bg-amber-500/20 text-amber-300",
    dot:       "bg-amber-500",
  },
];

function barColor(pct: number) {
  if (pct >= 70) return "from-emerald-500 to-teal-400";
  if (pct >= 50) return "from-amber-400 to-orange-400";
  return "from-red-500 to-red-400";
}

export function BhcDeepDive() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 bg-navy-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-400 text-sm font-bold uppercase tracking-widest">Business Health Checker</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            What lenders actually check
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Banks score you across 6 dimensions before approving any loan. Most businesses don&apos;t know this.
            BHC shows you exactly where you are — so you can fix it before you apply.
          </p>
        </div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — 6 dimension bars */}
          <div className="space-y-5">
            {DIMENSIONS.map((d, i) => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <p className="text-white text-sm font-bold">{d.name}</p>
                    <p className="text-gray-500 text-xs">{d.desc}</p>
                  </div>
                  <span className={`text-sm font-extrabold ml-4 flex-shrink-0 ${
                    d.pct >= 70 ? "text-emerald-400" : d.pct >= 50 ? "text-amber-400" : "text-red-400"
                  }`}>
                    {d.pct}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColor(d.pct)} transition-all duration-700`}
                    style={{
                      width: visible ? `${d.pct}%` : "0%",
                      transitionDelay: `${i * 80}ms`,
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />70–100% Strong</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />50–69% Developing</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" />Below 50% Needs work</span>
            </div>
          </div>

          {/* Right — lender tier ladder */}
          <div className="space-y-3">
            <p className="text-gray-400 text-sm font-semibold mb-5">
              Your overall score determines which lenders you unlock:
            </p>

            {TIERS.map((tier) => (
              <div
                key={tier.label}
                className={`border rounded-2xl p-5 ${tier.color}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${tier.dot} mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className="text-white font-bold text-sm">{tier.label}</p>
                      <p className="text-gray-400 text-xs">{tier.desc}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full flex-shrink-0 ${tier.badge}`}>
                    {tier.threshold}+ pts
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-0.5">Loan range</p>
                    <p className="text-white font-bold text-sm">{tier.range}</p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {tier.examples.map((e) => (
                      <span key={e} className="text-[10px] text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Locked */}
            <div className="border border-white/10 rounded-2xl p-5 opacity-40">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-600 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 font-bold text-sm">Below 50 — most lenders will decline</p>
                  <p className="text-gray-600 text-xs">Work on your score before applying to avoid rejection marks on your record</p>
                </div>
              </div>
            </div>

            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-glow-red text-sm"
            >
              Check your score for free →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
