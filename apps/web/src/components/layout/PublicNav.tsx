"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Home",     path: "/" },
  { label: "Services", path: "/services" },
  { label: "About",    path: "/about" },
  { label: "Contact",  path: "/contact" },
];

const ROLE_HOME: Record<string, string> = {
  BUSINESS_OWNER: "/dashboard",
  ADMIN:          "/admin",
  PARTNER:        "/partner",
  CONSULTANT:     "/consultant",
};

export function PublicNav() {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-950/90 backdrop-blur-xl shadow-lg shadow-navy-950/20 border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.png"
            alt="SME Mall"
            width={140}
            height={40}
            className="h-9 w-auto group-hover:opacity-90 transition-opacity"
            priority
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === link.path
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                {link.label}
                {pathname === link.path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-500 rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <Link
              href={ROLE_HOME[user.role] ?? "/dashboard"}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all hover:shadow-glow-red"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all hover:shadow-glow-red"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy-950/95 backdrop-blur-xl border-t border-white/[0.06] px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.path
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2">
            <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-center py-2.5 text-sm text-gray-300 hover:text-white transition-colors">Log in</Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)} className="block text-center py-2.5 bg-red-500 text-white text-sm font-bold rounded-lg">Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
}
