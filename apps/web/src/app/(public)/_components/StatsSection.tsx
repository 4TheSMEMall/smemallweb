"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 5000,  suffix: "+", label: "SMEs on the platform", icon: "🏢" },
  { value: 2,     suffix: "B+", label: "Naira in loans matched", prefix: "₦", icon: "💰" },
  { value: 12,    suffix: "",   label: "Partner lenders onboarded", icon: "🏦" },
  { value: 200,   suffix: "+",  label: "Certified consultants", icon: "🎓" },
];

const TICKER_ITEMS = [
  "Emeka (Lagos) improved his BHC score by 15 pts",
  "Fatima unlocked commercial lender tier — score 73",
  "47 assessments completed this week",
  "Ngozi booked a consultant session via WIBG",
  "₦12M in loans matched to SME Mall users today",
  "Adaeze's BHC score: 82 — Access Bank match found",
  "New lender onboarded: Sterling Bank",
  "Chidi used SME Paddy to prepare his tax filing",
  "3 businesses got funded after using BHC",
  "Blessing improved from Critical → Fair in 60 days",
];

function useCountUp(end: number, active: boolean, duration = 1400) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    const startTime = performance.now();
    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [active, end, duration]);

  return count;
}

function StatCard({ stat, active }: { stat: typeof STATS[0]; active: boolean }) {
  const count = useCountUp(stat.value, active);
  return (
    <div className="bg-navy-800/80 border border-white/10 rounded-2xl p-7 text-center hover:bg-navy-800 transition-colors">
      <div className="text-3xl mb-3">{stat.icon}</div>
      <p className="text-4xl font-extrabold text-white mb-2 tabular-nums">
        {stat.prefix ?? ""}{count.toLocaleString()}{stat.suffix}
      </p>
      <p className="text-gray-400 text-sm">{stat.label}</p>
    </div>
  );
}

export function StatsSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tickerText = TICKER_ITEMS.map((t) => `· ${t} `).join("  ");

  return (
    <section className="py-24 bg-navy-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-radial from-red-500/8 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-400 text-sm font-bold uppercase tracking-widest">By the numbers</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Trusted across Nigeria
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((s) => <StatCard key={s.label} stat={s} active={visible} />)}
        </div>
      </div>

      {/* Activity ticker */}
      <div className="mt-16 border-t border-b border-white/[0.06] py-4 overflow-hidden select-none">
        <div className="animate-ticker flex whitespace-nowrap">
          <span className="text-gray-500 text-sm pr-8">{tickerText}</span>
          <span className="text-gray-500 text-sm pr-8">{tickerText}</span>
        </div>
      </div>
    </section>
  );
}
