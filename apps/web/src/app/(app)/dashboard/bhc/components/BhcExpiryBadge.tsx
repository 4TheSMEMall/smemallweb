"use client";

interface Props {
  completedAt: Date | string;
  onRetake: () => void;
}

export function BhcExpiryBadge({ completedAt, onRetake }: Props) {
  const completed = new Date(completedAt);
  const expiry    = new Date(completed);
  expiry.setMonth(expiry.getMonth() + 6);

  const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const expired  = daysLeft <= 0;

  if (expired) {
    return (
      <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⏰</span>
          <div>
            <p className="font-bold text-red-800 text-sm">Your BHC score has expired</p>
            <p className="text-red-600 text-xs mt-0.5">
              Scores are valid for 6 months. Retake to stay lender-ready and track your progress.
            </p>
          </div>
        </div>
        <button
          onClick={onRetake}
          className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors ml-4"
        >
          Retake now
        </button>
      </div>
    );
  }

  const color =
    daysLeft > 90  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
    : daysLeft > 30 ? "bg-amber-50 border-amber-200 text-amber-800"
    : "bg-red-50 border-red-200 text-red-800";

  const barColor =
    daysLeft > 90  ? "bg-emerald-500"
    : daysLeft > 30 ? "bg-amber-400"
    : "bg-red-500";

  const barWidth = Math.min(100, Math.max(0, (daysLeft / 180) * 100));

  return (
    <div className={`border rounded-2xl p-4 ${color.split(" ").slice(0, 2).join(" ")}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <p className={`font-bold text-sm ${color.split(" ")[2]}`}>
            {daysLeft > 30
              ? `Score valid for ${daysLeft} more days`
              : `Score expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} — retake soon`
            }
          </p>
        </div>
        <p className="text-xs text-gray-400 flex-shrink-0 ml-4">
          Expires {expiry.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
      <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  );
}
