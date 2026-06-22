"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const ROLE_HOME: Record<string, string> = {
  BUSINESS_OWNER: "/dashboard",
  ADMIN: "/admin",
  PARTNER: "/partner",
  CONSULTANT: "/consultant",
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(form);
      router.refresh();
      router.push(returnTo?.startsWith("/") ? returnTo : "/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Invalid email or password.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-navy-950 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="absolute inset-0 bg-gradient-radial from-red-500/10 via-transparent to-transparent" />

        <Link href="/" className="relative flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-extrabold text-xs">SM</span>
          </div>
          <span className="text-white font-extrabold text-lg">
            SME<span className="text-red-400"> Mall</span>
          </span>
        </Link>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            Nigeria&apos;s #1 SME Platform
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Welcome back.<br />Your dashboard awaits.
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Your BHC score, services, and tools are ready — log in to continue building your business.
          </p>

          {/* Mini testimonial */}
          <div className="bg-navy-800/80 border border-white/10 rounded-2xl p-5">
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              &ldquo;The SME Mall helped me understand my financials and get matched with the right lender within a week.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">AO</div>
              <div>
                <p className="text-white text-sm font-semibold">Adaeze Okafor</p>
                <p className="text-gray-500 text-xs">Kemi&apos;s Kitchen, Lagos</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-gray-600 text-sm">© {new Date().getFullYear()} The SME Mall</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-extrabold text-xs">SM</span>
              </div>
              <span className="text-navy-900 font-extrabold text-lg">
                SME<span className="text-red-500"> Mall</span>
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-navy-900 mb-2">Log in to your account</h1>
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link href={returnTo ? `/signup?returnTo=${encodeURIComponent(returnTo)}` : "/signup"} className="text-red-500 font-semibold hover:underline">
                Sign up free →
              </Link>
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3.5 rounded-xl mb-6">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1.5">Email address</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 hover:border-gray-300 focus:border-navy-900 rounded-xl px-4 py-3 text-sm text-navy-900 placeholder-gray-400 outline-none transition-colors ring-0 focus:ring-2 focus:ring-navy-900/10"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-navy-900">Password</label>
                <button type="button" className="text-xs text-red-500 hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 hover:border-gray-300 focus:border-navy-900 rounded-xl px-4 py-3 pr-12 text-sm text-navy-900 placeholder-gray-400 outline-none transition-colors ring-0 focus:ring-2 focus:ring-navy-900/10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in…
                </>
              ) : "Log in to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
