"use client";

import { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  {
    text: "Does your business have a dedicated business bank account?",
    hint: "Separate from your personal account",
    section: "Financial Management",
    fix: "Open a business bank account — lenders verify this before anything else",
  },
  {
    text: "Are your business income and expenses documented for the past 3 months?",
    hint: "Records, receipts, or a basic bookkeeping system",
    section: "Financial Management",
    fix: "Start tracking income and expenses — even a simple spreadsheet improves your score",
  },
  {
    text: "Is your business formally registered with the CAC?",
    hint: "Corporate Affairs Commission registration",
    section: "Legal & Compliance",
    fix: "Register with the CAC — most lenders will not review unregistered businesses",
  },
  {
    text: "Can you show consistent monthly revenue for the past 6 months?",
    hint: "Bank statements, sales records, or invoices",
    section: "Business Operations",
    fix: "Collect 6 months of bank statements or sales records before applying for any loan",
  },
  {
    text: "Has your business been actively operating for at least 2 years?",
    hint: "With customers, products, or services delivered",
    section: "Market Position",
    fix: "If under 2 years, focus on microfinance options and building your track record first",
  },
];

type Tier = {
  range: string;
  label: string;
  sublabel: string;
  colorCls: string;
  badgeCls: string;
  borderCls: string;
  ringCls: string;
  desc: string;
  lenderNote: string;
};

const TIERS: Tier[] = [
  {
    range: "80–92",
    label: "Likely Loan Ready",
    sublabel: "Strong position",
    colorCls:  "text-emerald-400",
    badgeCls:  "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    borderCls: "border-emerald-500/30",
    ringCls:   "bg-emerald-500",
    desc: "Your fundamentals are solid. You likely qualify for commercial bank loans and may match with premium lenders.",
    lenderNote: "You could qualify for: GTBank, Access Bank, Sterling, LAPO MFB — and possibly premium DFI financing.",
  },
  {
    range: "68–80",
    label: "Almost There",
    sublabel: "One gap to close",
    colorCls:  "text-blue-400",
    badgeCls:  "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    borderCls: "border-blue-500/30",
    ringCls:   "bg-blue-500",
    desc: "You're close to the loan-ready threshold. Fixing one or two gaps could push you above 70 and unlock commercial lenders.",
    lenderNote: "You may qualify for: LAPO MFB, FairMoney, and some commercial bank products. Fix the gaps below to unlock more.",
  },
  {
    range: "52–68",
    label: "Fair",
    sublabel: "A few gaps to address",
    colorCls:  "text-amber-400",
    badgeCls:  "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    borderCls: "border-amber-500/30",
    ringCls:   "bg-amber-500",
    desc: "You have a foundation but some visible gaps. A focused 60-day improvement plan could push you into the loan-ready zone.",
    lenderNote: "You may qualify for: Carbon, Renmoney, Kuda Business — entry-level options. Commercial banks will need to see improvement first.",
  },
  {
    range: "38–52",
    label: "Developing",
    sublabel: "Real work needed",
    colorCls:  "text-orange-400",
    badgeCls:  "bg-orange-500/20 text-orange-300 border border-orange-500/30",
    borderCls: "border-orange-500/30",
    ringCls:   "bg-orange-500",
    desc: "There are real gaps that most lenders will notice immediately. These are fixable in 3–6 months with a clear action plan.",
    lenderNote: "Most lenders will decline at this stage. Work on the fundamentals first to avoid rejection marks on your credit record.",
  },
  {
    range: "20–38",
    label: "Critical — Start Here",
    sublabel: "Significant work needed",
    colorCls:  "text-red-400",
    badgeCls:  "bg-red-500/20 text-red-300 border border-red-500/30",
    borderCls: "border-red-500/30",
    ringCls:   "bg-red-500",
    desc: "Your business needs foundational work before approaching lenders. This is very common — and very fixable with the right support.",
    lenderNote: "Applying to lenders right now risks rejection marks. Build the basics first, then retake your BHC in 60–90 days.",
  },
];

function getTier(yesCount: number): Tier {
  if (yesCount === 5) return TIERS[0];
  if (yesCount === 4) return TIERS[1];
  if (yesCount === 3) return TIERS[2];
  if (yesCount === 2) return TIERS[3];
  return TIERS[4];
}

type Phase = "intro" | "questions" | "result";

export function PulseCheck() {
  const [phase, setPhase]       = useState<Phase>("intro");
  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState<boolean[]>([]);
  const [animKey, setAnimKey]   = useState(0);

  const yesCount  = answers.filter(Boolean).length;
  const noIndexes = answers.map((a, i) => (!a ? i : -1)).filter((i) => i >= 0);
  const tier      = getTier(yesCount);

  const handleAnswer = (yes: boolean) => {
    const next = [...answers, yes];
    setAnswers(next);
    setAnimKey((k) => k + 1);
    if (current + 1 >= QUESTIONS.length) setPhase("result");
    else setCurrent((c) => c + 1);
  };

  const reset = () => {
    setPhase("intro");
    setCurrent(0);
    setAnswers([]);
    setAnimKey(0);
  };

  return (
    <section className="py-24 bg-navy-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute inset-0 bg-gradient-radial from-red-500/8 via-transparent to-transparent" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">

        {/* ── INTRO ─────────────────────────────────────────── */}
        {phase === "intro" && (
          <div className="text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              Quick Business Pulse Check
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              5 questions.{" "}
              <span className="text-gradient">60 seconds.</span>
              <br />Your rough BHC tier.
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
              No sign-up required — just an honest gut check on where your
              business stands with lenders right now.
            </p>

            <button
              onClick={() => setPhase("questions")}
              className="inline-flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-xl text-base sm:text-lg transition-all hover:shadow-glow-red hover:-translate-y-0.5"
            >
              Start the check
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>

            <p className="mt-5 text-gray-600 text-sm">Takes about 60 seconds</p>

            {/* Mini preview of tiers */}
            <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
              {TIERS.map((t) => (
                <div key={t.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className={`w-2 h-2 rounded-full ${t.ringCls}`} />
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── QUESTIONS ─────────────────────────────────────── */}
        {phase === "questions" && (
          <div key={animKey} className="animate-fade-up">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-xs font-medium">
                  Question {current + 1} of {QUESTIONS.length}
                </span>
                <span className="text-white/40 text-xs">
                  {Math.round((current / QUESTIONS.length) * 100)}% done
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${(current / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-navy-800/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <span className="inline-block text-xs font-bold text-red-400 bg-red-500/15 border border-red-500/20 px-3 py-1 rounded-full mb-5">
                {QUESTIONS[current].section}
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
                {QUESTIONS[current].text}
              </h3>
              <p className="text-gray-500 text-sm mb-8">{QUESTIONS[current].hint}</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(true)}
                  className="group flex flex-col items-center gap-3 bg-emerald-500/10 hover:bg-emerald-500/20 border-2 border-emerald-500/30 hover:border-emerald-500 rounded-2xl p-5 sm:p-6 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="w-11 h-11 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-emerald-300 font-bold text-lg">Yes</span>
                </button>

                <button
                  onClick={() => handleAnswer(false)}
                  className="group flex flex-col items-center gap-3 bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 hover:border-red-500 rounded-2xl p-5 sm:p-6 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="w-11 h-11 bg-red-500/20 rounded-full flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <span className="text-red-300 font-bold text-lg">No</span>
                </button>
              </div>
            </div>

            <button
              onClick={reset}
              className="mt-5 mx-auto block text-gray-600 text-xs hover:text-gray-400 transition-colors"
            >
              ← Start over
            </button>
          </div>
        )}

        {/* ── RESULT ────────────────────────────────────────── */}
        {phase === "result" && (
          <div className="animate-fade-up">
            <div className={`bg-navy-800/90 border ${tier.borderCls} rounded-3xl p-6 sm:p-8 shadow-2xl mb-5`}>

              {/* Score range */}
              <div className="text-center mb-8 pb-8 border-b border-white/10">
                <p className="text-gray-400 text-sm mb-3">
                  Based on your answers, you&apos;d likely score in the
                </p>
                <p className={`text-6xl sm:text-7xl font-extrabold mb-2 tabular-nums ${tier.colorCls}`}>
                  {tier.range}
                </p>
                <p className="text-white/30 text-sm mb-4">out of 100</p>
                <span className={`inline-block text-sm font-bold px-4 py-1.5 rounded-full ${tier.badgeCls}`}>
                  {tier.label} — {tier.sublabel}
                </span>
              </div>

              {/* What this means */}
              <div className="bg-white/5 rounded-2xl p-5 mb-6">
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{tier.desc}</p>
                <p className="text-gray-500 text-xs leading-relaxed border-t border-white/10 pt-3">
                  <span className="text-gray-400 font-semibold">Lender outlook: </span>
                  {tier.lenderNote}
                </p>
              </div>

              {/* What to fix */}
              {noIndexes.length > 0 && (
                <div className="mb-6">
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                    Your gaps to fix ({noIndexes.length} found):
                  </p>
                  <ul className="space-y-3">
                    {noIndexes.map((idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${tier.ringCls}`} />
                        <div>
                          <p className="text-white/60 text-[10px] font-bold uppercase tracking-wide mb-0.5">
                            {QUESTIONS[idx].section}
                          </p>
                          <p className="text-gray-300 text-sm">{QUESTIONS[idx].fix}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-all hover:shadow-glow-red text-sm"
              >
                Get your exact score
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <p className="text-center text-gray-600 text-xs">
              This is a rough estimate — your actual BHC score may differ.{" "}
              <button onClick={reset} className="text-gray-400 hover:text-white underline transition-colors">
                Retake the check
              </button>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
