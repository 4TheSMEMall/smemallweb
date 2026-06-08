import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about The SME Mall and our mission to support Nigerian small businesses.",
};

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="bg-navy-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">About The SME Mall</h1>
          <p className="text-gray-300 text-lg">
            We exist to close the gap between Nigerian SMEs and the tools,
            finance, and expertise they need to grow.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 text-gray-700">
          <p className="text-lg leading-relaxed">
            The SME Mall is a super-app built for Nigerian small and medium
            enterprises. We believe every business owner deserves access to
            world-class tools — not just those with connections or capital.
          </p>
          <p className="leading-relaxed">
            We&apos;ve brought together Business Health Checking, bookkeeping, women
            entrepreneurship support, partner lenders, and certified consultants
            into a single platform. One login, every service.
          </p>
          <p className="leading-relaxed">
            Our mission: make it dramatically easier for Nigerian SMEs to get
            funded, stay organised, and grow.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
