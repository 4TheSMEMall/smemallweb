import Link from "next/link";

interface Props {
  percentage: number;
  status: string;
}

export function BhcConsultantPrompt({ percentage, status }: Props) {
  if (percentage >= 70) return null; // Loan ready — no prompt needed

  const isLow = percentage < 50;

  return (
    <div className={`rounded-2xl p-5 border ${
      isLow
        ? "bg-red-50 border-red-200"
        : "bg-amber-50 border-amber-200"
    }`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
          isLow ? "bg-red-100" : "bg-amber-100"
        }`}>
          🎓
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-extrabold text-sm mb-1 ${isLow ? "text-red-800" : "text-amber-800"}`}>
            {isLow
              ? "A consultant could move your score significantly"
              : "One session with an advisor could push you past 70"
            }
          </p>
          <p className={`text-sm leading-relaxed mb-3 ${isLow ? "text-red-700" : "text-amber-700"}`}>
            {isLow
              ? `Your current score of ${percentage}/100 (${status}) means most lenders will decline your application. Our certified consultants typically help clients improve their score by 15–25 points in 60 days — which moves you from declined to approved.`
              : `You're ${70 - percentage} points away from unlocking our lender partners. A focused 1–2 hour advisory session on your weakest sections can bridge that gap faster than working alone.`
            }
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/consultant"
              className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all ${
                isLow
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              Find a certified consultant →
            </Link>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              200+ verified advisors available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
