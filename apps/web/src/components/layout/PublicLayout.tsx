import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PublicNav } from "./PublicNav";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1">{children}</main>

      <footer className="bg-navy-950 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="mb-4">
                <Image
                  src="/logo.png"
                  alt="SME Mall"
                  width={140}
                  height={40}
                  className="h-9 w-auto"
                />
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Nigeria&apos;s business super app. One login, every service your SME needs to get funded and grow.
              </p>
            </div>

            {/* Services */}
            <div>
              <p className="text-white font-semibold text-sm mb-4">Services</p>
              <ul className="space-y-3">
                {[
                  "Business Health Checker",
                  "SME Paddy",
                  "WIBG",
                ].map((s) => (
                  <li key={s}>
                    <Link href="/services" className="text-gray-500 text-sm hover:text-white transition-colors">
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-white font-semibold text-sm mb-4">Company</p>
              <ul className="space-y-3">
                {[
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-gray-500 text-sm hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <p className="text-white font-semibold text-sm mb-4">Account</p>
              <ul className="space-y-3">
                {[
                  { label: "Sign up", href: "/signup" },
                  { label: "Log in", href: "/login" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-gray-500 text-sm hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} The SME Mall. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
