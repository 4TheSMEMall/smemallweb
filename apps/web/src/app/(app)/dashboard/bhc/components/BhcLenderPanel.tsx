import Link from "next/link";

interface Props {
  percentage: number;
}

const LENDER_TIERS = [
  {
    minScore: 85,
    label: "Premium Partners",
    desc: "Top-tier commercial banks and DFIs",
    loanRange: "₦5M – ₦500M",
    examples: ["GTBank", "Access Bank", "Zenith Bank"],
    tag: "All partner lenders",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    minScore: 70,
    label: "Commercial Lenders",
    desc: "Commercial banks and fintech lenders",
    loanRange: "₦1M – ₦50M",
    examples: ["Sterling Bank", "LAPO MFB", "FairMoney"],
    tag: "Most partner lenders",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    minScore: 50,
    label: "Microfinance & Fintech",
    desc: "Microfinance banks and digital lenders",
    loanRange: "₦100K – ₦5M",
    examples: ["Carbon", "Renmoney", "Kuda Business"],
    tag: "Entry-level lenders",
    tagColor: "bg-amber-100 text-amber-700",
  },
];

export function BhcLenderPanel({ percentage }: Props) {
  const qualified = LENDER_TIERS.filter((t) => percentage >= t.minScore);
  const locked    = LENDER_TIERS.filter((t) => percentage <  t.minScore);
  const pointsToNext = locked.length > 0
    ? locked[locked.length - 1].minScore - percentage
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🏦</span>
              <h2 className="font-extrabold text-navy-900">Lender Matching</h2>
              <span className="text-xs bg-navy-100 text-navy-700 font-bold px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              Based on your BHC score, here's which lender tiers you qualify for.
              Partner lenders are being onboarded — matching will go live soon.
            </p>
          </div>
          {pointsToNext > 0 && (
            <div className="flex-shrink-0 text-right">
              <p className="text-2xl font-extrabold text-navy-900">+{pointsToNext}</p>
              <p className="text-xs text-gray-400">pts to next tier</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Qualified tiers */}
        {qualified.map((tier) => (
          <div key={tier.label} className="relative border-2 border-emerald-200 bg-emerald-50 rounded-xl p-4">
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                You qualify
              </span>
            </div>
            <p className="font-extrabold text-navy-900 text-sm pr-24">{tier.label}</p>
            <p className="text-xs text-gray-500 mt-0.5 mb-3">{tier.desc}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Loan range</p>
                <p className="font-bold text-navy-900 text-sm">{tier.loanRange}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Example lenders</p>
                <div className="flex gap-1.5 flex-wrap">
                  {tier.examples.map((e) => (
                    <span key={e} className="text-xs bg-white border border-emerald-200 text-navy-900 px-2 py-0.5 rounded-full font-medium">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Locked tiers */}
        {locked.map((tier) => {
          const needed = tier.minScore - percentage;
          return (
            <div key={tier.label} className="relative border border-gray-200 bg-gray-50 rounded-xl p-4 opacity-60">
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                  🔒 Need +{needed} pts
                </span>
              </div>
              <p className="font-extrabold text-gray-600 text-sm pr-28">{tier.label}</p>
              <p className="text-xs text-gray-400 mt-0.5 mb-3">{tier.desc}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Loan range</p>
                  <p className="font-bold text-gray-500 text-sm">{tier.loanRange}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Example lenders</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {tier.examples.map((e) => (
                      <span key={e} className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium blur-[2px]">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* CTA */}
        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Live lender matching launches when partner onboarding is complete.
          </p>
          <Link
            href="/partner"
            className="text-xs font-bold text-navy-900 hover:text-red-500 transition-colors whitespace-nowrap"
          >
            Partner portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
