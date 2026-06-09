"use client";

import type { BhcResult } from "@/lib/bhcApi";

interface Props {
  history: BhcResult[];
}

const STATUS_COLORS: Record<string, string> = {
  critical:  "#EF4444",
  fair:      "#F59E0B",
  good:      "#10B981",
  excellent: "#3B82F6",
};

function statusKey(s: string) {
  return s.toLowerCase() as keyof typeof STATUS_COLORS;
}

export function BhcTrendChart({ history }: Props) {
  if (history.length < 2) return null;

  // Oldest → newest for the chart
  const sorted = [...history].reverse();

  const W = 600;
  const H = 140;
  const PAD = { top: 20, right: 24, bottom: 32, left: 36 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const scores = sorted.map((r) => r.percentage);
  const minScore = Math.max(0,  Math.min(...scores) - 10);
  const maxScore = Math.min(100, Math.max(...scores) + 10);

  const xOf = (i: number) => PAD.left + (i / (sorted.length - 1)) * innerW;
  const yOf = (v: number) => PAD.top + innerH - ((v - minScore) / (maxScore - minScore)) * innerH;

  // Build SVG polyline points
  const points = sorted.map((r, i) => `${xOf(i)},${yOf(r.percentage)}`).join(" ");

  // Smooth path using cubic bezier
  const pathD = sorted.reduce((d, r, i) => {
    const x = xOf(i);
    const y = yOf(r.percentage);
    if (i === 0) return `M ${x} ${y}`;
    const px = xOf(i - 1);
    const py = yOf(sorted[i - 1].percentage);
    const cpx = (px + x) / 2;
    return `${d} C ${cpx} ${py}, ${cpx} ${y}, ${x} ${y}`;
  }, "");

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-extrabold text-navy-900">Score Trend</h2>
          <p className="text-xs text-gray-400 mt-0.5">{sorted.length} assessments over time</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          {Object.entries(STATUS_COLORS).map(([k, c]) => (
            <span key={k} className="flex items-center gap-1.5 capitalize">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              {k}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minWidth: 280 }}
          aria-label="BHC score trend chart"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((v) => {
            if (v < minScore - 5 || v > maxScore + 5) return null;
            const y = yOf(v);
            return (
              <g key={v}>
                <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                  stroke="#F3F4F6" strokeWidth={1} />
                <text x={PAD.left - 6} y={y + 4} textAnchor="end"
                  className="fill-gray-400" style={{ fontSize: 10 }}>{v}</text>
              </g>
            );
          })}

          {/* Area fill under the line */}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B1F3A" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0B1F3A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${pathD} L ${xOf(sorted.length - 1)} ${PAD.top + innerH} L ${xOf(0)} ${PAD.top + innerH} Z`}
            fill="url(#areaGrad)"
          />

          {/* Trend line */}
          <path d={pathD} fill="none" stroke="#0B1F3A" strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {sorted.map((r, i) => {
            const cx = xOf(i);
            const cy = yOf(r.percentage);
            const color = STATUS_COLORS[statusKey(r.status)] ?? "#6B7280";
            const isLast = i === sorted.length - 1;
            const date = new Date(r.completedAt).toLocaleDateString("en-NG", {
              day: "numeric", month: "short",
            });
            return (
              <g key={r.id}>
                {/* Point */}
                <circle cx={cx} cy={cy} r={isLast ? 7 : 5}
                  fill={color} stroke="white" strokeWidth={2} />
                {/* Score label */}
                <text x={cx} y={cy - 11} textAnchor="middle"
                  style={{ fontSize: 10, fontWeight: 700, fill: color }}>
                  {r.percentage}
                </text>
                {/* Date label */}
                <text x={cx} y={PAD.top + innerH + 18} textAnchor="middle"
                  className="fill-gray-400" style={{ fontSize: 9 }}>
                  {date}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
