import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SERVICES } from "@sme-mall/shared";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore Business Health Checker, SME Paddy, and WIBG — tools built for Nigerian SMEs.",
};

const details = [
  {
    ...SERVICES[0],
    features: [
      "Instant business health score (0–100)",
      "Loan readiness assessment",
      "Matched to suitable lenders",
      "Improvement recommendations",
    ],
    audience: "Business owners seeking finance",
  },
  {
    ...SERVICES[1],
    features: [
      "Invoicing and expense tracking",
      "Cash flow reports",
      "Tax-ready financial summaries",
      "Stock and inventory management",
    ],
    audience: "SMEs managing day-to-day operations",
  },
  {
    ...SERVICES[2],
    features: [
      "Mentorship matching",
      "Women-focused funding database",
      "Peer learning circles",
      "Growth assessment tools",
    ],
    audience: "Women entrepreneurs in Nigeria",
  },
];

export default function ServicesPage() {
  return (
    <PublicLayout>
      <section className="bg-navy-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Our Services</h1>
          <p className="text-gray-300 text-lg">Three tools. One login. Built for Nigerian SMEs.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {details.map((service, i) => (
            <div key={service.id} className="grid md:grid-cols-2 gap-12 items-center">
              <div className={i % 2 !== 0 ? "md:order-2" : ""}>
                <span className="inline-block bg-red-50 text-red-500 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {service.shortName}
                </span>
                <h2 className="text-3xl font-extrabold text-navy-900 mb-3">{service.name}</h2>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-700 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded-lg inline-block transition-colors"
                >
                  Access {service.shortName}
                </Link>
              </div>
              <div className={`bg-navy-900 rounded-2xl p-10 text-white ${i % 2 !== 0 ? "md:order-1" : ""}`}>
                <p className="text-red-400 text-sm font-semibold mb-2">Best for</p>
                <p className="text-xl font-bold">{service.audience}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
