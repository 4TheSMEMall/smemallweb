"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ── Countdown to Grand Finale ──────────────────────────────────
function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0 });
  useEffect(() => {
    const target = new Date("2026-09-12T09:00:00").getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
      });
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-green-400/70 mb-3">Until Grand Finale</p>
      <div className="flex items-end gap-4">
        {[{ v: t.d, l: "days" }, { v: t.h, l: "hrs" }, { v: t.m, l: "min" }].map(({ v, l }) => (
          <div key={l}>
            <p className="text-4xl font-extrabold text-white tabular-nums leading-none">
              {String(v).padStart(2, "0")}
            </p>
            <p className="text-[9px] text-white/25 font-bold uppercase tracking-widest mt-1">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FAQ Item ───────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.07]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-6 text-left gap-6"
      >
        <span className="text-white font-semibold text-sm sm:text-[15px] leading-snug">{q}</span>
        <span className={`text-green-400 text-xl font-light flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <p className="text-gray-400 text-sm leading-relaxed pb-6 max-w-2xl">{a}</p>}
    </div>
  );
}

const JOURNEY_STEPS = [
  { num: "01", title: "BHC Diagnostic",     desc: "Pay the ₦15,000 gateway fee and complete the 20-question Business Health Check. Your score unlocks the application form.", date: "Opens Apr 1" },
  { num: "02", title: "Full Application",   desc: "Submit your business profile, financials, CAC status, and a 2-minute video pitch link. Tell us why you should win.", date: "Closes July 31" },
  { num: "03", title: "Capacity Webinars",  desc: "Attend intensive Saturday and Sunday training sessions across at least 2 of the 3 August weekends. Mandatory for shortlisting.", date: "Aug 8 – 23" },
  { num: "04", title: "Virtual Semi-Final", desc: "Top 20 applicants pitch virtually to an independent panel. Six finalists are selected for the Grand Finale.", date: "TBD" },
  { num: "05", title: "Grand Finale",       desc: "Six finalists pitch live on the SME Mall main stage before 500+ attendees, investors, and press. The best three win.", date: "Sep 12" },
];

const SAT_WEBINARS = [
  { week: "Weekend 1", topic: "Legal",      date: "Sat, Aug 8",  bullets: ["Business registration and licensing", "Contracts and regulatory compliance", "Legal risk management for SMEs"] },
  { week: "Weekend 2", topic: "HR",         date: "Sat, Aug 15", bullets: ["Employment contracts and payroll", "Staff policies and compliance", "Building people systems for growth"] },
  { week: "Weekend 3", topic: "Technology", date: "Sat, Aug 22", bullets: ["Digital tools and payment systems", "Business automation and efficiency", "Tech as a competitive advantage"] },
];

const SUN_WEBINARS = [
  { week: "Weekend 1", topic: "Accounting", date: "Sun, Aug 9",  bullets: ["Bookkeeping and P&L fundamentals", "Tax readiness and compliance", "Financial records that attract lenders"] },
  { week: "Weekend 2", topic: "Marketing",  date: "Sun, Aug 16", bullets: ["Value proposition and customer targeting", "Digital presence and CRM", "Brand-to-revenue strategy"] },
  { week: "Weekend 3", topic: "Advisory",   date: "Sun, Aug 23", bullets: ["Business planning and governance", "Growth strategy and scaling", "Accessing funding and expert guidance"] },
];

const FAQS = [
  { q: "What is the WIBG 2026 Pitch Competition?", a: "The Women in Business Grant (WIBG) is a premium capacity-building program and pitch competition for female-led businesses, run in partnership with SME Mall. Six finalists are selected to pitch for ₦3 Million in grants — ₦1.5M first place, ₦1M second, ₦500K third — at the physical Grand Finale on September 12, 2026 in Lagos." },
  { q: "Why is there a ₦15,000 fee and what is the BHC?", a: "The Business Health Check (BHC) is a structured 20-question diagnostic measuring business readiness across Legal, Accounting, HR, Marketing, Technology, and Advisory. The ₦15,000 fee funds program delivery and provides a personalised score, coach allocation, and unlocks the official pitch application form." },
  { q: "What are the webinar attendance requirements?", a: "Webinars run across 3 weekends in August (8–9, 15–16, 22–23). Saturdays cover Business Foundations; Sundays cover Market & Brand Leadership. To remain eligible for shortlisting, you must attend both Saturday and Sunday sessions for at least 2 of the 3 weekends. Attendance is verified via sign-in." },
  { q: "What should be in my video pitch?", a: "A 2-minute video (hosted on Google Drive, YouTube, or Dropbox — paste the shareable link in your application). Introduce yourself and your business, explain why your business is the best fit, and make a compelling case for why you should win. Quality over length." },
  { q: "What are the key deadlines?", a: "The application deadline is July 31, 2026. Webinars: August 8–23. Virtual semi-finals date TBD. Grand Finale: September 12, 2026 in Lagos." },
];

// ── Main Component ─────────────────────────────────────────────
export function WibgPageClient() {
  const [webinarTab, setWebinarTab]   = useState<"sat" | "sun">("sat");
  const [attendState, setAttendState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [attendError, setAttendError] = useState("");
  const [attendForm, setAttendForm]   = useState({ name: "", email: "", phone: "", role: "", notes: "" });

  async function handleAttend(e: React.FormEvent) {
    e.preventDefault();
    setAttendState("loading");
    setAttendError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wibg/attend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Registration failed");
      setAttendState("success");
    } catch (err: unknown) {
      setAttendError(err instanceof Error ? err.message : "Something went wrong");
      setAttendState("error");
    }
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] bg-navy-950 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-10%,rgba(34,197,94,0.07),transparent)]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(34,197,94,0.04),transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 items-center">

            {/* Left — copy */}
            <div>
              <div className="flex items-center gap-2.5 mb-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400">WIBG × SME Mall</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">2026 Edition</span>
              </div>

              <h1 className="font-extrabold text-white leading-[1.0] tracking-tight mb-6">
                <span className="block text-[2.6rem] sm:text-[3.5rem] lg:text-[4.25rem]">Nigeria&apos;s biggest</span>
                <span className="block text-[2.6rem] sm:text-[3.5rem] lg:text-[4.25rem] text-green-400">grant</span>
                <span className="block text-[2.6rem] sm:text-[3.5rem] lg:text-[4.25rem]">for women</span>
                <span className="block text-[2.6rem] sm:text-[3.5rem] lg:text-[4.25rem]">founders.</span>
              </h1>

              <p className="text-gray-400 text-base sm:text-[17px] leading-relaxed mb-9 max-w-md">
                A structured capacity-building program and live pitch competition for female-led businesses. Win equity-free capital, expert mentorship, and direct investor access.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/dashboard/wibg/apply"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 text-sm"
                >
                  Apply to Pitch
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <a
                  href="#register"
                  className="inline-flex items-center justify-center gap-2 border border-white/12 hover:border-white/25 text-gray-400 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all text-sm"
                >
                  Attend the Finale
                </a>
              </div>

              {/* Quick facts row */}
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {[
                  { icon: "📅", text: "September 12, Lagos" },
                  { icon: "🎤", text: "6 finalists selected" },
                  { icon: "🏆", text: "Equity-free grants" },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                    <span>{f.icon}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — prize card + countdown */}
            <div className="hidden lg:block">
              <div className="bg-white/[0.025] border border-white/[0.08] rounded-3xl overflow-hidden">
                {/* Prize display */}
                <div className="p-8 pb-7 border-b border-white/[0.07]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-4">Grand Prize</p>
                  <p className="text-[4.5rem] font-extrabold text-white leading-none tracking-tight">₦1.5M</p>
                  <p className="text-gray-500 text-sm mt-2">Equity-free · No conditions · Yours to keep</p>
                </div>

                {/* Countdown */}
                <div className="p-8">
                  <div className="w-full h-px bg-white/[0.07] mb-8" />
                  <Countdown />
                </div>

                {/* Prize breakdown */}
                <div className="p-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25 mb-4">Prize breakdown</p>
                  <div className="space-y-3">
                    {[
                      { place: "1st Place", amount: "₦1,500,000", cls: "text-amber-400" },
                      { place: "2nd Place", amount: "₦1,000,000", cls: "text-gray-300" },
                      { place: "3rd Place", amount: "₦500,000",   cls: "text-amber-700" },
                    ].map((p) => (
                      <div key={p.place} className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">{p.place}</span>
                        <span className={`font-bold text-sm ${p.cls}`}>{p.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════════════
          BY THE NUMBERS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-green-600 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/20">
            {[
              { val: "₦3,000,000", label: "Total prize pool" },
              { val: "6",          label: "Finalists selected" },
              { val: "500+",       label: "Live audience" },
              { val: "20",         label: "BHC diagnostic questions" },
            ].map((s) => (
              <div key={s.label} className="lg:px-10 first:lg:pl-0 last:lg:pr-0 text-center lg:text-left">
                <p className="text-[2.25rem] sm:text-5xl font-extrabold text-white leading-none">{s.val}</p>
                <p className="text-green-200/70 text-sm mt-2 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          THE CHALLENGE — why WIBG exists
      ══════════════════════════════════════════════════════ */}
      <section className="relative bg-navy-950 py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(34,197,94,0.05), transparent)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-5">Why WIBG Exists</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight max-w-2xl mb-16">
            Access, not ability,<br />is what holds most<br />
            <span className="text-green-400">women founders back.</span>
          </h2>

          <div className="grid sm:grid-cols-3 gap-px bg-white/[0.05] rounded-3xl overflow-hidden">
            {[
              {
                stat: "Less than 8%",
                context: "of startup funding in Nigeria reaches women-led businesses — not because they lack ideas, but because the system wasn't built for them.",
                accent: "text-green-400",
              },
              {
                stat: "7 in 10",
                context: "female-led SMEs cite lack of capital as their number one barrier to growth, yet fewer than 1 in 4 have ever applied for a business loan.",
                accent: "text-white",
              },
              {
                stat: "₦3,000,000",
                context: "in equity-free capital is being put directly into the hands of three women founders on September 12. No interest. No equity. No conditions.",
                accent: "text-amber-400",
              },
            ].map((s) => (
              <div key={s.stat} className="bg-[#060f1c] px-8 sm:px-10 py-10 sm:py-12">
                <p className={`text-4xl sm:text-5xl font-extrabold leading-none mb-5 ${s.accent}`}>{s.stat}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{s.context}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CINEMATIC PHOTO BANNER
          → Replace the inner <div> with:
            <img src="/images/wibg-banner.jpg" className="w-full h-full object-cover" alt="..." />
      ══════════════════════════════════════════════════════ */}
      <div className="relative w-full h-[45vh] sm:h-[55vh] lg:h-[65vh] overflow-hidden">
        {/* ↓ swap this div for an <img> or next/image when you have the photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-[#071a0f] to-navy-950"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1.5px, transparent 1.5px)", backgroundSize: "22px 22px" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 70% at 30% 40%, rgba(34,197,94,0.12), transparent)" }} />
        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-14 lg:p-20 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">WIBG 2026 · Grand Finale · Lagos</p>
          <p className="text-white font-extrabold text-2xl sm:text-4xl lg:text-5xl leading-tight max-w-xl">
            Six women.<br />One stage.<br /><span className="text-green-400">One life-changing night.</span>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          WHO THIS IS FOR
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#07111f] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-5">Built for you if…</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-14 sm:mb-20">
            You&apos;re a woman.<br />You have a business.<br />You&apos;re ready.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🌱", title: "You're just starting out",        desc: "You have a business idea or a very early-stage venture and you need capital and structure to launch properly." },
              { icon: "📈", title: "You're already running",          desc: "Your business is live, you have customers or sales, and you're ready to take it to the next level with real funding." },
              { icon: "🏦", title: "Banks keep saying no",           desc: "You've tried getting loans but couldn't meet the collateral requirements. Equity-free capital was made for this moment." },
              { icon: "🤝", title: "You want the right investors",   desc: "Beyond the grant, you want to stand in front of VCs, angels, and press who are actually looking to back women founders." },
              { icon: "🎓", title: "You want to build your skills",  desc: "You're hungry for training — legal, finance, marketing, tech — from experts who understand the Nigerian SME space." },
              { icon: "🔥", title: "You're done waiting",            desc: "You're tired of being underfunded and overlooked. You have the drive. WIBG is the platform. September 12 is the date." },
            ].map((card) => (
              <div key={card.title}
                className="group relative bg-white/[0.025] hover:bg-white/[0.045] border border-white/[0.07] hover:border-green-500/20 rounded-2xl p-7 sm:p-8 transition-all duration-200 cursor-default">
                <span className="text-3xl mb-5 block">{card.icon}</span>
                <p className="text-white font-bold text-base sm:text-[17px] mb-2.5 leading-snug">{card.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500/0 via-green-500/40 to-green-500/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-2xl px-7 py-6">
            <div>
              <p className="text-white font-bold text-base mb-1">Deadline: July 31, 2026</p>
              <p className="text-gray-500 text-sm">Applications close soon. Takes 15 minutes to apply.</p>
            </div>
            <Link href="/dashboard/wibg/apply"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all text-sm whitespace-nowrap hover:-translate-y-px">
              Apply Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          YOUR PATH TO THE STAGE
      ══════════════════════════════════════════════════════ */}
      <section id="journey" className="py-20 sm:py-28 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 sm:mb-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-4">Competition Journey</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight max-w-lg">
              Your path to<br />the stage.
            </h2>
          </div>

          <div className="space-y-0">
            {JOURNEY_STEPS.map((s, i) => (
              <div
                key={s.num}
                className={`grid sm:grid-cols-[80px_1fr_auto] gap-4 sm:gap-8 items-start py-8 sm:py-10 ${
                  i < JOURNEY_STEPS.length - 1 ? "border-b border-white/[0.07]" : ""
                }`}
              >
                <p className="text-5xl sm:text-6xl font-extrabold text-white/[0.07] leading-none select-none">
                  {s.num}
                </p>
                <div>
                  <p className="text-white font-bold text-lg sm:text-xl mb-2">{s.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xl">{s.desc}</p>
                </div>
                <div className="sm:text-right mt-1">
                  <span className="inline-block text-[11px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full whitespace-nowrap">
                    {s.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          AUGUST WEBINARS
      ══════════════════════════════════════════════════════ */}
      <section id="webinars" className="py-20 sm:py-28 bg-[#07111f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-4">August Capacity Building</p>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                3 weekends.<br />6 disciplines.
              </h2>
            </div>
            <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] p-1 rounded-xl self-start sm:self-auto">
              {[{ id: "sat", label: "Saturdays" }, { id: "sun", label: "Sundays" }].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setWebinarTab(t.id as "sat" | "sun")}
                  className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    webinarTab === t.id
                      ? "bg-green-500/20 text-green-300 border border-green-500/25"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
            {(webinarTab === "sat" ? SAT_WEBINARS : SUN_WEBINARS).map((w, i) => (
              <div key={w.topic} className="bg-[#07111f] p-7 sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25 mb-5">{w.week}</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{w.topic}</p>
                <p className="text-green-400/70 text-xs font-medium mb-6">{w.date} · Evening</p>
                <ul className="space-y-3">
                  {w.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-gray-500 text-sm">
                      <span className="w-1 h-1 rounded-full bg-green-500/60 flex-shrink-0 mt-2" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-xs text-center mt-6">
            Attendance at both Saturday and Sunday sessions across at least 2 weekends is mandatory to remain eligible for shortlisting.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRIZES
      ══════════════════════════════════════════════════════ */}
      <section id="prizes" className="py-20 sm:py-28 bg-navy-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 sm:mb-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-4">Grant Prizes</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Three winners.<br />Life-changing capital.
            </h2>
          </div>

          {/* Grand prize — centrepiece */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(234,179,8,0.06),transparent)]" />
            <div className="relative border border-amber-500/20 rounded-3xl p-10 sm:p-14 text-center bg-amber-500/[0.03]">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-400/70 mb-5">Grand Prize Winner</p>
              <p className="text-[5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold text-white leading-none tracking-tight mb-3">
                ₦1.5M
              </p>
              <p className="text-gray-500 text-sm sm:text-base mb-6">Equity-free seed capital · 1-on-1 VC coaching · Corporate exhibition space</p>
              <span className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold">
                <span className="text-xl">🏆</span> Most impactful pitch takes all
              </span>
            </div>
          </div>

          {/* 2nd and 3rd */}
          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {[
              { place: "2nd Place",  amount: "₦1,000,000", icon: "🥈", perks: "Grant capital · 6 months mentorship · Co-working space ticket" },
              { place: "3rd Place",  amount: "₦500,000",   icon: "🥉", perks: "Grant capital · 3 months capacity building training" },
            ].map((p) => (
              <div key={p.place} className="border border-white/[0.08] rounded-2xl p-8 bg-white/[0.02]">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{p.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">{p.place}</span>
                </div>
                <p className="text-4xl font-extrabold text-white mb-2">{p.amount}</p>
                <p className="text-gray-600 text-sm">{p.perks}</p>
              </div>
            ))}
          </div>

          {/* Judging rubric */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25 mb-6">10-Point Weighted Judging Rubric</p>
            <div className="grid sm:grid-cols-2 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
              {[
                { label: "Financial Feasibility",   weight: "12%", desc: "Unit economics, margin projections, and budget breakdown." },
                { label: "Business Viability",       weight: "10%", desc: "Long-term survival, operational efficiency, revenue traction." },
                { label: "Market Opportunity",       weight: "10%", desc: "TAM size and definition of the first 100 customers." },
                { label: "Innovation & IP",          weight: "10%", desc: "Originality vs. existing products or services." },
                { label: "Pitch Quality",            weight: "10%", desc: "Delivery, deck clarity, time management, Q&A." },
                { label: "Social Impact",            weight: "10%", desc: "SDG alignment, job creation, gender equity." },
                { label: "Scalability",              weight: "10%", desc: "Ability to replicate across multiple markets." },
                { label: "Marketing Strategy",       weight: "10%", desc: "Customer acquisition channels and digital positioning." },
                { label: "Preparedness",             weight: "10%", desc: "Application completeness and consistency." },
                { label: "Team Strength",            weight: "8%",  desc: "Skills balance, expertise, and founder dedication." },
              ].map((r) => (
                <div key={r.label} className="bg-[#07111f] px-6 py-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white text-sm font-semibold mb-0.5">{r.label}</p>
                    <p className="text-gray-600 text-xs leading-relaxed">{r.desc}</p>
                  </div>
                  <span className="text-green-400 font-extrabold text-sm flex-shrink-0 mt-0.5">{r.weight}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-700 text-xs mt-4 text-center">Financial Feasibility serves as the tiebreaker. Judging is blind and independent.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQs
      ══════════════════════════════════════════════════════ */}
      <section id="faqs" className="py-20 sm:py-28 bg-[#07111f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-4">FAQs</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-14">
            Common questions.
          </h2>
          <div>
            {FAQS.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          APPLY + ATTEND — SPLIT
      ══════════════════════════════════════════════════════ */}
      <section id="register" className="bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Apply CTA */}
            <div className="bg-green-500 rounded-3xl p-10 sm:p-12 flex flex-col justify-between min-h-[360px]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-900/60 mb-6">For Founders</p>
                <h3 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
                  Ready to<br />pitch for it?
                </h3>
                <p className="text-green-100/70 text-sm leading-relaxed max-w-sm">
                  Complete your BHC diagnostic, submit your application before TBD, and step onto the biggest stage for women-led businesses in Nigeria.
                </p>
              </div>
              <Link
                href="/dashboard/wibg/apply"
                className="mt-8 self-start inline-flex items-center gap-2 bg-white text-green-700 font-bold px-7 py-3.5 rounded-xl hover:bg-green-50 transition-all text-sm"
              >
                Apply to Pitch
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Attend form */}
            <div className="bg-white/[0.025] border border-white/[0.08] rounded-3xl p-10 sm:p-12">
              {attendState === "success" ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-white font-extrabold text-xl mb-2">Seat secured.</h4>
                  <p className="text-gray-500 text-sm">We&apos;ll send event details and your ticket closer to September 12th.</p>
                </div>
              ) : (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25 mb-6">For Attendees</p>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-2">
                    Attend the<br />Grand Finale.
                  </h3>
                  <p className="text-gray-500 text-sm mb-8">September 12 · SME Mall Stage · Lagos · 500 seats</p>

                  <form onSubmit={handleAttend} className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input required type="text" placeholder="Full name" value={attendForm.name}
                        onChange={(e) => setAttendForm(f => ({ ...f, name: e.target.value }))}
                        className="bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-colors" />
                      <input required type="email" placeholder="Email address" value={attendForm.email}
                        onChange={(e) => setAttendForm(f => ({ ...f, email: e.target.value }))}
                        className="bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-colors" />
                    </div>
                    <input required type="tel" placeholder="Phone number" value={attendForm.phone}
                      onChange={(e) => setAttendForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-colors" />
                    <select required value={attendForm.role}
                      onChange={(e) => setAttendForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full bg-navy-900 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/40 transition-colors text-gray-400">
                      <option value="" disabled>I am attending as a/an…</option>
                      <option value="entrepreneur">SME Entrepreneur / Founder</option>
                      <option value="investor">Investor / VC</option>
                      <option value="student">Student / Academic</option>
                      <option value="enthusiast">Business Enthusiast</option>
                      <option value="press">Press / Media</option>
                    </select>

                    {attendError && (
                      <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{attendError}</p>
                    )}

                    <button type="submit" disabled={attendState === "loading"}
                      className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all text-sm mt-1">
                      {attendState === "loading" ? "Securing your seat…" : "Secure My Free Ticket →"}
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
