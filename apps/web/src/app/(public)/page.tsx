import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection }  from "./_components/HeroSection";
import { BhcDeepDive }  from "./_components/BhcDeepDive";
import { PulseCheck }   from "./_components/PulseCheck";
import { StatsSection } from "./_components/StatsSection";

export const metadata: Metadata = {
  title: "The SME Mall — Nigeria's #1 Business Super App",
  description:
    "Know exactly where your business stands. Fix what's holding you back. Get matched to the right lender — BHC, SME Paddy, and WIBG in one platform.",
};

const testimonials = [
  {
    quote: "The BHC tool showed me exactly what banks look at. Within 3 months I had my first business loan — ₦5 million from Access Bank.",
    name: "Adaeze Okafor",
    title: "Owner, Kemi's Kitchen",
    city: "Lagos",
    initials: "AO",
    color: "bg-orange-500",
    score: "82/100",
    improvement: "+24 pts",
  },
  {
    quote: "SME Paddy replaced my spreadsheets entirely. I finally know exactly where every naira goes. My accountant is genuinely impressed.",
    name: "Emeka Nwosu",
    title: "Founder, TechFix NG",
    city: "Abuja",
    initials: "EN",
    color: "bg-blue-500",
    score: "74/100",
    improvement: "+19 pts",
  },
  {
    quote: "WIBG connected me with a mentor who helped me scale from one shop to three locations in just one year. Life-changing platform.",
    name: "Fatima Abdullahi",
    title: "CEO, FashionHub",
    city: "Kano",
    initials: "FA",
    color: "bg-purple-500",
    score: "78/100",
    improvement: "+31 pts",
  },
];

const BEFORE = [
  { icon: "📱", text: "Calling the bank with no idea what they need from you" },
  { icon: "📊", text: "Excel spreadsheet with 6 months of uncategorised expenses" },
  { icon: "❌", text: "Loan rejection: \"Insufficient documentation / business records\"" },
  { icon: "🤷", text: "No clear path to improving — every advisor says something different" },
  { icon: "📉", text: "Applying to every lender and collecting rejection marks on your credit file" },
];

const AFTER = [
  { icon: "📊", text: "BHC score of 78/100 — you know exactly which 2 sections to fix" },
  { icon: "🏦", text: "3 matched lenders, ranked by your score and loan requirements" },
  { icon: "✅", text: "Loan application submitted with a BHC report lenders trust" },
  { icon: "📈", text: "Improvement roadmap: 90-day action plan, section by section" },
  { icon: "🎓", text: "Consultant booked — score improved 18 pts in 6 weeks" },
];

export default function HomePage() {
  return (
    <PublicLayout>
      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-red-500 text-sm font-bold uppercase tracking-widest">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-3 mb-4">
              From signup to funded in 3 steps
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              No complexity. No jargon. A clear path from where your business is today to where it needs to be.
            </p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            {[
              { n: "01", title: "Create your account", desc: "Sign up in under 2 minutes. One account unlocks every service — no separate logins ever." },
              { n: "02", title: "Get your Business Health Score", desc: "Complete the BHC in 15 minutes. See your score across 6 dimensions and understand exactly what lenders see." },
              { n: "03", title: "Get funded and grow", desc: "Match with lenders based on your score, manage your finances with SME Paddy, and book expert advisors — all from one dashboard." },
            ].map((step) => (
              <div key={step.n} className="relative text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-navy-900 text-white font-extrabold text-2xl mb-6 group-hover:bg-red-500 transition-colors duration-300 shadow-card">
                  {step.n}
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. BENTO PLATFORM OVERVIEW ──────────────────────────── */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-red-500 text-sm font-bold uppercase tracking-widest">Our services</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-3 mb-4">
              One platform. Three engines.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Each tool solves a real problem Nigerian SMEs face. Together, they give you complete visibility and control.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid lg:grid-cols-3 gap-4">

            {/* BHC — large card */}
            <div className="lg:col-span-2 bg-navy-900 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute inset-0 bg-dots opacity-20" />
              <div className="absolute top-0 right-0 w-64 h-full bg-gradient-radial from-blue-500/20 via-transparent to-transparent pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">BHC</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3">Business Health Checker</h3>
                <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                  A 0–100 score across 6 business dimensions. Know your loan readiness before you walk into any bank.
                  Download a report lenders actually recognise.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
                  {["Health score (0–100)", "6-dimension breakdown", "Lender matching", "PDF report", "90-day action plan", "Score trend tracking"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-gray-300">
                      <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
                >
                  Take the assessment
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right column — SME Paddy + WIBG */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* SME Paddy */}
              <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl p-6 relative overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-dots opacity-15" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                      </svg>
                    </div>
                    <span className="text-emerald-300 text-xs font-bold uppercase tracking-widest">SME Paddy</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mb-2">Bookkeeping & Cash Flow</h3>
                  <p className="text-emerald-200/70 text-sm leading-relaxed mb-4">
                    Invoicing, expenses, stock, and tax-ready reports. Stop guessing where your money is.
                  </p>
                  <Link href="/signup" className="text-emerald-300 text-xs font-bold hover:text-white transition-colors">
                    Open SME Paddy →
                  </Link>
                </div>
              </div>

              {/* WIBG */}
              <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-6 relative overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-dots opacity-15" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      </svg>
                    </div>
                    <span className="text-purple-300 text-xs font-bold uppercase tracking-widest">WIBG</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mb-2">Women in Business Growth</h3>
                  <p className="text-purple-200/70 text-sm leading-relaxed mb-4">
                    Mentorship, women-focused funding, and peer learning circles for Nigerian women entrepreneurs.
                  </p>
                  <Link href="/signup" className="text-purple-300 text-xs font-bold hover:text-white transition-colors">
                    Open WIBG →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. BHC DEEP DIVE ────────────────────────────────────── */}
      <BhcDeepDive />

      {/* ── 5. PULSE CHECK ──────────────────────────────────────── */}
      <PulseCheck />

      {/* ── 7. BEFORE / AFTER ───────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-red-500 text-sm font-bold uppercase tracking-widest">The reality</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 mt-3 mb-4 leading-snug">
              Most Nigerian SMEs get rejected.{" "}
              <span className="text-red-500">Here&apos;s why — and how to fix it.</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Banks don&apos;t reject businesses randomly. They score you. The problem is that almost no SME knows what they&apos;re being scored on.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">✕</div>
                <h3 className="font-extrabold text-red-800 text-lg">Without The SME Mall</h3>
              </div>
              <ul className="space-y-4">
                {BEFORE.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                    <p className="text-red-700 text-sm leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">✓</div>
                <h3 className="font-extrabold text-emerald-800 text-lg">With The SME Mall</h3>
              </div>
              <ul className="space-y-4">
                {AFTER.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                    <p className="text-emerald-700 text-sm leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-xl transition-all hover:shadow-card-hover"
            >
              Start fixing this today
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. STATS + TICKER ───────────────────────────────────── */}
      <StatsSection />

      {/* ── 9. TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-red-500 text-sm font-bold uppercase tracking-widest">Success stories</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-3 mb-4">
              Businesses that grew with us
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Real scores. Real loans. Real growth — from business owners who started exactly where you are.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100 hover:border-red-100 hover:shadow-card transition-all duration-300 flex flex-col"
              >
                {/* Score badge */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs font-bold px-2.5 py-1 bg-navy-900 text-white rounded-full">
                    BHC {t.score}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                    {t.improvement}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-gray-700 leading-relaxed flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 pt-5 border-t border-gray-200">
                  <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-navy-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.title} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FINAL CTA ───────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="absolute inset-0 bg-gradient-radial from-red-500/15 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Join thousands of Nigerian businesses
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to grow your<br />
            <span className="text-gradient">Nigerian business?</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto">
            Join thousands of business owners already using The SME Mall to get funded, stay organised, and scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-glow-red hover:-translate-y-0.5"
            >
              Create your account
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/15 hover:border-white/30 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
            >
              Talk to us
            </Link>
          </div>
          <p className="text-gray-600 text-sm mt-6">Get started today — no commitment required</p>
        </div>
      </section>
    </PublicLayout>
  );
}
