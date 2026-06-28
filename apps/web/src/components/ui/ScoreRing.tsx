"use client";

import { useEffect, useState } from "react";

interface Props {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackClassName?: string;
  children?: React.ReactNode;
}

const TIER_COLOR = (pct: number) => {
  if (pct >= 80) return { stroke: "#34d399", glow: "rgba(52,211,153,0.45)" };   // emerald
  if (pct >= 60) return { stroke: "#38bdf8", glow: "rgba(56,189,248,0.45)" };   // sky/teal
  if (pct >= 40) return { stroke: "#fbbf24", glow: "rgba(251,191,36,0.45)" };   // amber
  return { stroke: "#f87171", glow: "rgba(248,113,113,0.45)" };                 // red
};

/**
 * Animated circular score ring — sweeps in on mount, colour-coded by tier.
 * Children are centred inside the ring (typically the numeric score + label).
 */
export function ScoreRing({ percentage, size = 160, strokeWidth = 10, className = "", trackClassName = "stroke-white/10", children }: Props) {
  const [animated, setAnimated] = useState(0);
  const { stroke, glow } = TIER_COLOR(percentage);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimated(percentage));
    return () => cancelAnimationFrame(t);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ filter: `drop-shadow(0 0 16px ${glow})` }}>
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" className={trackClassName} stroke="currentColor" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none"
          stroke={stroke} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
