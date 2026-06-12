import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const metadata: Metadata = {
  title: "The SME Mall — Nigeria's #1 Business Super App",
  description:
    "Access Business Health Checker, SME Paddy, and WIBG — one login, every tool your Nigerian SME needs to grow, get funded, and scale.",
};

const services = [
  {
    id: "bhc",
    tag: "BHC",
    name: "Business Health Checker",
    desc: "Get your business score and unlock access to the right lenders — in minutes.",
    features: ["Instant 0–100 health score", "Loan readiness report", "Lender matching", "Personalised improvement tips"],
    color: "from-blue-600 to-indigo-700",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75a2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75m0-3.75h3.75" />
      </svg>
    ),
  },
  {
    id: "sme-paddy",
    tag: "SME Paddy",
    name: "SME Paddy",
    desc: "Your all-in-one business management tool — invoicing, bookkeeping, and cash flow.",
    features: ["Invoicing & receipts", "Expense tracking", "Cash flow reports", "Stock management"],
    color: "from-emerald-500 to-teal-600",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    id: "wibg",
    tag: "WIBG",
    name: "Women in Business Growth",
    desc: "A dedicated platform empowering Nigerian women entrepreneurs with mentorship and funding.",
    features: ["Mentor matching", "Women-focused funding", "Peer learning circles", "Growth assessment"],
    color: "from-purple-500 to-pink-600",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  },
];

const steps = [
  { n: "01", title: "Create your free account", desc: "Sign up in under 2 minutes. One account gives you access to every service on the platform." },
  { n: "02", title: "Get your Business Health Score", desc: "Complete the BHC assessment. See exactly where your business stands and what lenders look for." },
  { n: "03", title: "Get funded and grow", desc: "Get matched to the right lenders, manage your books with SME Paddy, and access expert advisors." },
];

const stats = [
  { value: "5,000+", label: "SMEs on the platform",   icon: "🏢" },
  { value: "₦2B+",   label: "In loans facilitated",   icon: "💰" },
  { value: "12",     label: "Partner lenders",         icon: "🏦" },
  { value: "200+",   label: "Certified consultants",   icon: "🎓" },
];

const testimonials = [
  {
    quote: "The BHC tool showed me exactly what banks look at. Within 3 months I had my first business loan — ₦5 million from Access Bank.",
    name: "Adaeze Okafor",
    title: "Owner, Kemi's Kitchen",
    city: "Lagos",
    initials: "AO",
    color: "bg-orange-500",
  },
  {
    quote: "SME Paddy replaced my spreadsheets entirely. I finally know exactly where every naira goes. My accountant is impressed.",
    name: "Emeka Nwosu",
    title: "Founder, TechFix NG",
    city: "Abuja",
    initials: "EN",
    color: "bg-blue-500",
  },
  {
    quote: "WIBG connected me with a mentor who helped me scale from one shop to three locations in just one year. Life-changing.",
    name: "Fatima Abdullahi",
    title: "CEO, FashionHub",
    city: "Kano",
    initials: "FA",
    color: "bg-purple-500",
  },
];

export default function HomePage() {
  return (
    <PublicLayout>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-navy-950 flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-dots opacity-40" />
        <div className="absolute inset-0 bg-gradient-radial from-red-500/10 via-transparent to-transparent" style={{ backgroundPosition: "30% 50%" }} />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 bg-gradient-radial from-blue-500/8 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left — copy */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              Nigeria&apos;s #1 SME Super App
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
              Everything your<br />
              business needs,{" "}
              <span className="text-gradient">in one place</span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
              One login unlocks your business health score, bookkeeping,
              funding matches, and certified advisors. Built for Nigerian SMEs.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:shadow-glow-red hover:-translate-y-0.5"
              >
                Start for free
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

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-500">
              {["Free to join", "No credit card", "Cancel anytime"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating UI mockup cards */}
          <div className="hidden lg:block relative h-[520px]">
            {/* BHC Score card */}
            <div className="animate-float absolute top-0 right-8 w-64 bg-navy-800/90 border border-white/10 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/50 text-xs font-medium">Business Health Score</p>
                  <p className="text-white font-extrabold text-3xl mt-0.5">78<span className="text-white/40 text-lg font-normal">/100</span></p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[78%] bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" />
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>Loan Ready</span>
                  <span className="text-emerald-400 font-medium">✓ Eligible</span>
                </div>
              </div>
            </div>

            {/* Lender match notification */}
            <div className="animate-float-delayed absolute top-40 left-0 w-60 bg-navy-800/90 border border-white/10 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">GT</span>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">New match!</p>
                  <p className="text-white/50 text-xs mt-0.5">GTBank is interested in your business profile</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-red-400 font-medium">
                    View offer
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly revenue card */}
            <div className="animate-float absolute bottom-12 right-0 w-56 bg-navy-800/90 border border-white/10 rounded-2xl p-4 shadow-2xl" style={{ animationDelay: "2s" }}>
              <p className="text-white/50 text-xs font-medium">Monthly Revenue</p>
              <p className="text-white font-extrabold text-2xl mt-1">₦2.4M</p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                  +18% vs last month
                </div>
              </div>
            </div>

            {/* Services pill */}
            <div className="absolute bottom-44 left-8 flex flex-col gap-2">
              {[
                { label: "BHC", color: "bg-blue-500" },
                { label: "SME Paddy", color: "bg-emerald-500" },
                { label: "WIBG", color: "bg-purple-500" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 bg-navy-800/90 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white font-medium">
                  <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-red-500 text-sm font-bold uppercase tracking-widest">How it works</span>
            <h2 className="text-4xl font-extrabold text-navy-900 mt-3 mb-4">
              From signup to funded in 3 steps
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              No complexity. No jargon. Just a clear path from where your business is today to where you want it to be.
            </p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {steps.map((step, i) => (
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

      {/* ── SERVICES ──────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-red-500 text-sm font-bold uppercase tracking-widest">Our services</span>
            <h2 className="text-4xl font-extrabold text-navy-900 mt-3 mb-4">
              Three tools. One platform.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every tool works independently — but together, they give you a complete view and control of your business.
            </p>
          </div>

          <div className="space-y-6">
            {services.map((service, i) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 group"
              >
                <div className={`flex flex-col ${i % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"} gap-10 items-center`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        {service.icon}
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{service.tag}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-navy-900 mb-3">{service.name}</h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">{service.desc}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all group-hover:bg-red-500"
                    >
                      Get access
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>

                  {/* Service visual */}
                  <div className="flex-1 flex justify-center">
                    <div className={`w-full max-w-xs aspect-square bg-gradient-to-br ${service.color} rounded-3xl flex items-center justify-center opacity-10 group-hover:opacity-15 transition-opacity`}>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-radial from-red-500/8 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-red-400 text-sm font-bold uppercase tracking-widest">By the numbers</span>
            <h2 className="text-4xl font-extrabold text-white mt-3">
              Trusted across Nigeria
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-navy-800/80 border border-white/10 rounded-2xl p-7 text-center hover:bg-navy-800 transition-colors">
                <div className="text-3xl mb-3">{s.icon}</div>
                <p className="text-4xl font-extrabold text-white mb-2">{s.value}</p>
                <p className="text-gray-400 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-red-500 text-sm font-bold uppercase tracking-widest">Success stories</span>
            <h2 className="text-4xl font-extrabold text-navy-900 mt-3 mb-4">
              Businesses that grew with us
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-red-100 hover:shadow-card transition-all duration-300 flex flex-col">
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

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="absolute inset-0 bg-gradient-radial from-red-500/15 via-transparent to-transparent" style={{ backgroundPosition: "50% 50%" }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to grow your<br />
            <span className="text-gradient">Nigerian business?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of business owners already using The SME Mall to get funded, stay organised, and scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-glow-red hover:-translate-y-0.5"
            >
              Create free account
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
          <p className="text-gray-600 text-sm mt-6">No credit card required · Free forever on basic plan</p>
        </div>
      </section>
    </PublicLayout>
  );
}
