import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { WibgPageClient } from "./_components/WibgPageClient";

export const metadata: Metadata = {
  title: "WIBG 2026 | Women in Business Grant — SME Mall",
  description:
    "Apply for the WIBG × SME Mall Pitch Competition 2026. Complete the Business Health Check, attend capacity webinars, and pitch to win up to ₦1,500,000 in grant funding.",
};

export default function WibgPage() {
  return (
    <PublicLayout>
      <WibgPageClient />
    </PublicLayout>
  );
}
