"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { UserRole } from "@sme-mall/shared";
import { USER_ROLE_LABELS } from "@sme-mall/shared";
import { useAuth } from "@/contexts/AuthContext";

const SELECTABLE_ROLES: { role: UserRole; desc: string; icon: React.ReactNode }[] = [
  {
    role: "BUSINESS_OWNER",
    desc: "I own or run a business",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
  },
  {
    role: "PARTNER",
    desc: "I represent a bank or lender",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>,
  },
  {
    role: "CONSULTANT",
    desc: "I provide business advisory",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>,
  },
];

const ROLE_HOME: Record<string, string> = {
  BUSINESS_OWNER: "/dashboard",
  ADMIN: "/admin",
  PARTNER: "/partner",
  CONSULTANT: "/consultant",
};

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole | "";
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>({ firstName: "", lastName: "", email: "", phone: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role) { setError("Please select your account type."); return; }
    setError("");
    setFieldErrors({});
    setIsLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone || undefined, password: form.password, role: form.role as UserRole });
      router.push(returnTo?.startsWith("/") ? returnTo : (ROLE_HOME[form.role] ?? "/dashboard"));
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      setError(apiErr?.response?.data?.message ?? "Sign up failed. Please try again.");
      if (apiErr?.response?.data?.errors) {
        const flat: Record<string, string> = {};
        Object.entries(apiErr.response.data.errors).forEach(([k, v]) => { flat[k] = v[0]; });
        setFieldErrors(flat);
        setStep(2);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
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
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            One account.<br />Every service.
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Sign up once and access BHC, SME Paddy, and WIBG — no separate logins, no complexity.
          </p>
          <ul className="space-y-4">
            {[
              { icon: "✓", text: "Free to create — no credit card" },
              { icon: "✓", text: "Access all 3 services instantly" },
              { icon: "✓", text: "Get your BHC score in minutes" },
              { icon: "✓", text: "Connect with verified lenders" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {item.icon}
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-gray-600 text-sm">© {new Date().getFullYear()} The SME Mall</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
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

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-red-500" : "bg-gray-200"}`} />
            ))}
            <span className="text-xs text-gray-400 ml-2 font-medium">{step}/2</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-navy-900 mb-2">
              {step === 1 ? "What best describes you?" : "Create your account"}
            </h1>
            <p className="text-gray-500 text-sm">
              {step === 1 ? "Select the option that fits you — it determines your dashboard." : (
                <>
                  Already have an account?{" "}
                  <Link href={returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login"} className="text-red-500 font-semibold hover:underline">Log in →</Link>
                </>
              )}
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
            {/* Step 1 — role selection */}
            {step === 1 && (
              <>
                <div className="space-y-3">
                  {SELECTABLE_ROLES.map(({ role, desc, icon }) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setForm({ ...form, role })}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all ${
                        form.role === role
                          ? "border-navy-900 bg-navy-900 shadow-lg"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        form.role === role ? "bg-white/15 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {icon}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${form.role === role ? "text-white" : "text-navy-900"}`}>
                          {USER_ROLE_LABELS[role]}
                        </p>
                        <p className={`text-xs mt-0.5 ${form.role === role ? "text-white/60" : "text-gray-400"}`}>
                          {desc}
                        </p>
                      </div>
                      {form.role === role && (
                        <div className="ml-auto">
                          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={!form.role}
                  onClick={() => setStep(2)}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </>
            )}

            {/* Step 2 — personal details */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {(["firstName", "lastName"] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-navy-900 mb-1.5">
                        {field === "firstName" ? "First name" : "Last name"}
                      </label>
                      <input
                        type="text"
                        required
                        value={form[field]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        className="w-full border border-gray-200 focus:border-navy-900 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-navy-900/10 transition-colors"
                      />
                      {fieldErrors[field] && <p className="text-red-500 text-xs mt-1">{fieldErrors[field]}</p>}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Email address</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 focus:border-navy-900 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-navy-900/10 transition-colors"
                    placeholder="you@example.com"
                  />
                  {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">
                    Phone <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 focus:border-navy-900 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-navy-900/10 transition-colors"
                    placeholder="080xxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-gray-200 focus:border-navy-900 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-navy-900/10 transition-colors"
                    placeholder="Min 8 chars · 1 uppercase · 1 number"
                  />
                  {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-navy-900 font-semibold py-3.5 rounded-xl transition-colors text-sm"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating…
                      </>
                    ) : "Create my account"}
                  </button>
                </div>
                <p className="text-center text-xs text-gray-400">
                  By signing up, you agree to our{" "}
                  <span className="text-gray-600 underline cursor-pointer">Terms</span> and{" "}
                  <span className="text-gray-600 underline cursor-pointer">Privacy Policy</span>.
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
