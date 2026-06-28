"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { SparklesIcon } from "@/components/ui/icons";

const STORAGE_KEY = "smemall_wibg2026_popup_seen";
const FINALE_DATE = new Date("2026-09-12T00:00:00");

export function WibgEventPopup() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  const applyHref = user ? "/dashboard/wibg" : "/login?returnTo=/dashboard/wibg";

  useEffect(() => {
    const diff = Math.ceil((FINALE_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    setDaysLeft(Math.max(0, diff));

    // Don't show after the event
    if (diff < 0) return;

    const already = sessionStorage.getItem(STORAGE_KEY);
    if (already) return;

    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(2,8,18,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div className="relative w-full max-w-md bg-[#040e1a] rounded-3xl overflow-hidden shadow-2xl border border-white/[0.07] animate-slide-up">

        {/* Green glow strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-green-400 to-emerald-500" />

        {/* Dot pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        {/* Glow orb */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.15), transparent 65%)" }} />

        {/* Dismiss */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.07] hover:bg-white/[0.12] flex items-center justify-center transition-colors z-10"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative p-7 sm:p-8">
          {/* Event badge */}
          <div className="flex items-center gap-2 mb-5">
            <span className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/25 text-green-400 text-[10px] font-black uppercase tracking-[0.18em] px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live Event · WIBG 2026
            </span>
          </div>

          <h2 className="text-white font-black text-xl sm:text-2xl leading-snug mb-2">
            ₦3,000,000 up for grabs.<br />
            <span className="text-green-400">September 12 · Lagos.</span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            The Women in Business Grant Competition is live. Six women will pitch live in front of investors and press for equity-free capital.
            Are you one of them?
          </p>

          {/* Countdown pill */}
          {daysLeft > 0 && (
            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-2xl px-4 py-3 mb-6">
              <div className="text-center">
                <p className="text-2xl font-black text-white leading-none">{daysLeft}</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">days left</p>
              </div>
              <div className="w-px h-8 bg-white/[0.08]" />
              <div>
                <p className="text-xs font-bold text-gray-300">Grand Finale · September 12, 2026</p>
                <p className="text-[11px] text-gray-600 mt-0.5">Landmark Event Centre · Lagos</p>
              </div>
            </div>
          )}
          {daysLeft === 0 && (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-3 mb-6">
              <SparklesIcon className="w-6 h-6 text-green-400" />
              <p className="text-sm font-bold text-green-400">It&apos;s Grand Finale Day! Watch live today in Lagos.</p>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { val: "₦1.5M", label: "1st Prize" },
              { val: "6",     label: "Finalists" },
              { val: "500+",  label: "Audience" },
            ].map((s) => (
              <div key={s.label} className="text-center bg-white/[0.03] rounded-xl py-3">
                <p className="text-base font-black text-white">{s.val}</p>
                <p className="text-[10px] text-gray-600 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <Link
              href={applyHref}
              onClick={dismiss}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-black px-5 py-3 rounded-xl text-sm transition-all hover:-translate-y-px shadow-lg shadow-green-500/20"
            >
              Apply Now →
            </Link>
            <Link
              href="/wibg"
              onClick={dismiss}
              className="flex-1 flex items-center justify-center border border-white/[0.1] hover:border-white/[0.2] text-gray-400 hover:text-white font-semibold px-5 py-3 rounded-xl text-sm transition-all"
            >
              Learn More
            </Link>
          </div>

          <p className="text-center text-[10px] text-gray-700 mt-4 font-medium">
            Tap outside or × to dismiss
          </p>
        </div>
      </div>
    </div>
  );
}
