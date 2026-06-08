import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/**
 * next/font loads Google Fonts at BUILD TIME — no runtime network request,
 * no flash of unstyled text, and the font is self-hosted by Next.js automatically.
 * This is one of the biggest advantages over a <link> tag in index.html.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The SME Mall — Your Business Hub",
    template: "%s | The SME Mall",
  },
  description:
    "Nigeria's #1 SME super app. Access Business Health Checker, SME Paddy, and WIBG — one login, every service.",
  keywords: ["SME", "Nigeria", "business", "loans", "bookkeeping", "BHC"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "The SME Mall",
  },
};

/**
 * Root Layout — wraps EVERY page in the app.
 * This is a Server Component, so we can't put React context here directly.
 * We delegate client-side providers to the <Providers> component below.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
