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
    range:    "85–100",
    label:    "Funding Ready",
    sub:      "Full commercial bank access",
    lenders:  ["GTBank", "Access Bank", "Zenith Bank"],
    loans:    "₦5M – ₦500M+",
    note:     "You qualify for term loans, asset finance, and DFI products. Lenders compete for your business.",
    border:   "border border-l-4 border-emerald-500/20 border-l-emerald-500 bg-emerald-500/10",
    badge:    "bg-emerald-500/20 text-emerald-300",
    dot:      "bg-emerald-500",
    score:    "text-emerald-400",
    locked:   false,
  },
  {
    range:    "65–84",
    label:    "Coachable",
    sub:      "Commercial banks + fintech lenders",
    lenders:  ["Sterling Bank", "LAPO MFB", "FairMoney"],
    loans:    "₦500K – ₦50M",
    note:     "You're close. A targeted 60–90 day improvement plan typically pushes businesses into Funding Ready.",
    border:   "border border-l-4 border-blue-500/20 border-l-blue-500 bg-blue-500/10",
    badge:    "bg-blue-500/20 text-blue-300",
    dot:      "bg-blue-500",
    score:    "text-blue-400",
    locked:   false,
  },
  {
    range:    "51–64",
    label:    "Vulnerable",
    sub:      "Microfinance banks & digital lenders",
    lenders:  ["Carbon", "Renmoney", "Kuda Business"],
    loans:    "₦50K – ₦2M",
    note:     "Limited options, higher interest rates. Use BHC's action plan to address the weakest dimensions first.",
    border:   "border border-l-4 border-amber-500/20 border-l-amber-500 bg-amber-500/10",
    badge:    "bg-amber-500/20 text-amber-300",
    dot:      "bg-amber-500",
    score:    "text-amber-400",
    locked:   false,
  },
  {
    range:    "0–50",
    label:    "Critical Risk",
    sub:      "Not yet lender-ready",
    lenders:  [],
    loans:    "",
    note:     "Applying now risks rejection marks on your credit record. Fix the fundamentals — BHC tells you exactly where.",
    border:   "border-l-4 border-l-red-500/60 border border-red-500/15 bg-red-500/5",
    badge:    "bg-red-500/20 text-red-400",
    dot:      "bg-red-500",
    score:    "text-red-400",
    locked:   true,
  },
];

function barColor(pct: number) {
  if (pct >= 85) return "from-emerald-500 to-teal-400";
  if (pct >= 65) return "from-blue-500 to-blue-400";
  if (pct >= 51) return "from-amber-400 to-orange-400";
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
                    d.pct >= 85 ? "text-emerald-400" : d.pct >= 65 ? "text-blue-400" : d.pct >= 51 ? "text-amber-400" : "text-red-400"
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

            <div className="pt-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-x-5 gap-y-2 text-[10px] sm:text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />85–100% Funding Ready</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />65–84% Coachable</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />51–64% Vulnerable</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />0–50% Critical Risk</span>
            </div>
          </div>

          {/* Right — BHC tier ladder */}
          <div className="space-y-3">
            <p className="text-gray-400 text-sm font-semibold mb-5">
              Your overall score determines which lenders you unlock:
            </p>

            {TIERS.map((tier) => (
              <div
                key={tier.label}
                className={`rounded-2xl p-5 ${tier.border} ${tier.locked ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5 ${tier.dot}`} />
                    <div>
                      <p className="text-white font-bold text-sm">{tier.label}</p>
                      <p className="text-gray-400 text-xs">{tier.sub}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full flex-shrink-0 ${tier.badge}`}>
                    {tier.range}
                  </span>
                </div>

                <p className="text-gray-500 text-xs leading-relaxed mb-3 pl-0 sm:pl-5">{tier.note}</p>

                {!tier.locked && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                      <p className="text-[10px] text-gray-500 mb-0.5">Loan range</p>
                      <p className={`font-bold text-sm ${tier.score}`}>{tier.loans}</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {tier.lenders.map((l) => (
                        <span key={l} className="text-[10px] text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-glow-red text-sm"
            >
              Check your score →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
