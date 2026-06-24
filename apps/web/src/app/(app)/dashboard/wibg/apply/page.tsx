"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { bhcApi } from "@/lib/bhcApi";
import api from "@/lib/api";

/* ── Nav ─────────────────────────────────────────────────────── */
const navItems = [
  { label: "Dashboard",   path: "/dashboard",         icon: <GridIcon /> },
  { label: "BHC",         path: "/dashboard/bhc",     icon: <ClipboardIcon /> },
  { label: "WIBG 2026",   path: "/dashboard/wibg",    icon: <TrophyIcon /> },
  { label: "My Services", path: "/dashboard/services", icon: <AppsIcon /> },
  { label: "Profile",     path: "/dashboard/profile",  icon: <UserIcon /> },
];

/* ── Types ───────────────────────────────────────────────────── */
type Step = "form-1" | "bhc-step" | "tc" | "form-2" | "form-3" | "success";

interface FormData {
  founderName:  string;
  founderEmail: string;
  founderPhone: string;
  businessName: string;
  cacStatus:    string;
  cacNumber:    string;
  problem:      string;
  solution:     string;
  market:       string;
  traction:     string;
  revenue3m:    string;
  proj12m:      string;
  bizStage:     string;
}

const EMPTY: FormData = {
  founderName: "", founderEmail: "", founderPhone: "",
  businessName: "", cacStatus: "", cacNumber: "",
  problem: "", solution: "", market: "",
  traction: "", revenue3m: "", proj12m: "", bizStage: "",
};

const TC_ITEMS = [
  { id: "gender",  label: "I confirm that my business is owned or run by a woman." },
  { id: "bhc",     label: "I understand that the ₦15,000 BHC fee is not refundable and does not guarantee that I will be shortlisted." },
  { id: "webinar", label: "I will attend the August training sessions — at least 2 out of 3 weekends, for both Saturday and Sunday each." },
  { id: "agree",   label: "I agree to all the rules and decisions of the WIBG 2026 team." },
];

const STEPS: { key: Step; label: string }[] = [
  { key: "form-1",   label: "Your Details"  },
  { key: "bhc-step", label: "BHC Check"     },
  { key: "tc",       label: "Agreement"     },
  { key: "form-2",   label: "Your Business" },
  { key: "form-3",   label: "Your Numbers"  },
];

/* ── Styles ──────────────────────────────────────────────────── */
const inputCls    = "w-full bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-navy-900 rounded-xl px-4 py-3 text-navy-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900/10 transition-colors";
const selectCls   = "w-full bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-navy-900 rounded-xl px-4 py-3 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/10 transition-colors";
const textareaCls = "w-full bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-navy-900 rounded-xl px-4 py-3 text-navy-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900/10 transition-colors resize-none";

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <p className="text-navy-900 text-sm font-semibold">{children}</p>
      {hint && <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{hint}</p>}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function WibgApplyPage() {
  const [step, setStep]           = useState<Step>("form-1");
  const [form, setForm]           = useState<FormData>(EMPTY);
  const [tcChecked, setTcChecked] = useState<Record<string, boolean>>({});
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [receiptId, setReceiptId] = useState("");

  const [alreadyApplied, setAlreadyApplied] = useState<boolean | null>(null);

  const [bhcLaunched, setBhcLaunched]   = useState(false);
  const [bhcLaunching, setBhcLaunching] = useState(false);
  const [bhcChecking, setBhcChecking]   = useState(false);
  const [bhcResult, setBhcResult]       = useState<{ percentage: number; status: string; assessmentId: string } | null>(null);

  const tcAllChecked = TC_ITEMS.every((t) => tcChecked[t.id]);
  const currentIdx   = STEPS.findIndex((s) => s.key === step);

  useEffect(() => {
    api.get<{ success: boolean; data: { id: string } | null }>("/wibg/my-status")
      .then((r) => setAlreadyApplied(r.data.data !== null))
      .catch(() => setAlreadyApplied(false));
  }, []);

  useEffect(() => {
    if (step !== "bhc-step") return;
    checkBhc();
  }, [step]);

  useEffect(() => {
    if (step !== "bhc-step" || !bhcLaunched) return;
    const handler = () => { if (!document.hidden) checkBhc(); };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [step, bhcLaunched]);

  async function checkBhc() {
    setBhcChecking(true);
    try {
      const res = await bhcApi.getHistory();
      const latest = res.data.data?.latest;
      if (latest) setBhcResult({ percentage: latest.percentage, status: latest.status, assessmentId: latest.assessmentId });
    } catch { /* ignore */ }
    finally { setBhcChecking(false); }
  }

  async function handleLaunchBhc() {
    setBhcLaunching(true);
    try {
      await bhcApi.launchTest();
      setBhcLaunched(true);
    } catch {
      alert("Could not launch BHC. Please try again.");
    } finally {
      setBhcLaunching(false);
    }
  }

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const next = (to: Step, validate?: () => boolean) => {
    if (validate && !validate()) return;
    setError("");
    setStep(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await api.post<{ success: boolean; data: { id: string } }>("/wibg/apply", {
        ...form,
        revenue3m: Number(form.revenue3m) || 0,
        proj12m:   Number(form.proj12m)   || 0,
        bhcRef:    bhcResult?.assessmentId ?? "",
      });
      setReceiptId(res.data.data.id);
      setStep("success");
      window.scrollTo({ top: 0 });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; fields?: Record<string, string[]> } } };
      const fieldErrors = axiosErr.response?.data?.fields
        ? Object.entries(axiosErr.response.data.fields)
            .map(([f, msgs]) => `${f}: ${msgs.join(", ")}`)
            .join(" · ")
        : null;
      setError(fieldErrors ?? axiosErr.response?.data?.message ?? "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-2xl w-full">

        {/* ── Already applied wall ────────────────────────── */}
        {alreadyApplied === true && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 sm:p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-navy-900 mb-2">You&apos;ve already applied</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Your application has been received. Only one application per account is allowed. Track your status on the WIBG overview page.
            </p>
            <Link href="/dashboard/wibg"
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
              View My Application →
            </Link>
          </div>
        )}

        {/* ── Loading check ───────────────────────────────── */}
        {alreadyApplied === null && (
          <div className="flex items-center justify-center py-20">
            <svg className="w-6 h-6 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {alreadyApplied === false && <>

        {/* ── Breadcrumb ─────────────────────────────────── */}
        {step !== "success" && (
          <div className="flex items-center gap-2 mb-6">
            <Link href="/dashboard/wibg" className="text-gray-400 hover:text-navy-900 text-sm transition-colors">
              WIBG 2026
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-navy-900 text-sm font-semibold">Apply to Pitch</span>
          </div>
        )}

        {/* ── Step progress ──────────────────────────────── */}
        {step !== "success" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 mb-6 overflow-x-auto">
            <div className="flex items-center gap-0 min-w-max">
              {STEPS.map((s, i) => {
                const done   = i < currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={s.key} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        done ? "bg-green-500 text-white" : active ? "bg-navy-900 text-white" : "bg-gray-100 text-gray-400"
                      }`}>
                        {done
                          ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          : i + 1}
                      </div>
                      <p className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                        active ? "text-navy-900" : done ? "text-green-600" : "text-gray-400"
                      }`}>{s.label}</p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`w-8 sm:w-12 h-px mx-1 mb-4 ${done ? "bg-green-400" : "bg-gray-200"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            FORM 1 — Your Details
        ════════════════════════════════════════════════ */}
        {step === "form-1" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-navy-900 mb-1">Tell us about you</h2>
            <p className="text-gray-500 text-sm mb-6">
              Fill in your details and your business name. After this, you will take a short business health check.
            </p>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Your Full Name</Label>
                  <input required type="text" placeholder="e.g. Chisom Okafor" value={form.founderName} onChange={set("founderName")} className={inputCls} />
                </div>
                <div>
                  <Label>Your Email Address</Label>
                  <input required type="email" placeholder="e.g. chisom@gmail.com" value={form.founderEmail} onChange={set("founderEmail")} className={inputCls} />
                </div>
                <div>
                  <Label>Your Phone Number</Label>
                  <input required type="tel" placeholder="e.g. 08031234567" value={form.founderPhone} onChange={set("founderPhone")} className={inputCls} />
                </div>
                <div>
                  <Label>Business Name</Label>
                  <input required type="text" placeholder="e.g. Chisom Cold Store" value={form.businessName} onChange={set("businessName")} className={inputCls} />
                </div>
                <div>
                  <Label hint="Is your business registered with CAC?">CAC Registration Status</Label>
                  <select required value={form.cacStatus} onChange={set("cacStatus")} className={selectCls}>
                    <option value="" disabled>Pick one…</option>
                    <option value="registered-ltd">Yes — Registered as a Limited Company</option>
                    <option value="registered-bn">Yes — Registered as a Business Name</option>
                    <option value="registered-coop">Yes — Registered as a Cooperative</option>
                    <option value="in-progress">Registration is in progress</option>
                    <option value="unregistered">Not registered yet</option>
                  </select>
                </div>
                <div>
                  <Label hint="Leave blank if not registered yet">CAC Number (if you have one)</Label>
                  <input type="text" placeholder="e.g. RC 1234567" value={form.cacNumber} onChange={set("cacNumber")} className={inputCls} />
                </div>
              </div>
              {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
              <button
                onClick={() => next("bhc-step", () => {
                  if (!form.founderName || !form.founderEmail || !form.founderPhone || !form.businessName || !form.cacStatus) {
                    setError("Please fill in all required fields."); return false;
                  }
                  return true;
                })}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-3.5 rounded-xl transition-all text-sm mt-2"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            BHC STEP
        ════════════════════════════════════════════════ */}
        {step === "bhc-step" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-navy-900 mb-1">
              {bhcResult ? "BHC Done ✓" : "Take the Business Health Check"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {bhcResult
                ? "Your Business Health Check is confirmed. You can move to the next step."
                : "Before you apply, you need to complete the Business Health Check (BHC). It has 20 simple questions and takes about 15 minutes. The fee is ₦15,000."}
            </p>

            {bhcResult ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-navy-900 font-bold text-sm">BHC Completed</p>
                    <p className="text-gray-500 text-xs">Linked to your SME Mall account</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white border border-green-100 rounded-xl px-4 py-3">
                  <span className="text-gray-500 text-sm">Your Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold text-navy-900">{bhcResult.percentage}</span>
                    <span className="text-gray-400 text-sm">/100</span>
                    <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full">
                      {bhcResult.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">What will be checked</p>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {["Legal & Registration", "Accounting & Finance", "Human Resources", "Marketing & Sales", "Technology & Tools", "Business Advisory"].map((d) => (
                        <div key={d} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-navy-900 font-bold text-sm">One-time fee</p>
                      <p className="text-gray-400 text-xs">Paid on bhctestt.com · About 15 minutes</p>
                    </div>
                    <p className="text-xl font-extrabold text-green-600">₦15,000</p>
                  </div>
                </div>

                <button
                  onClick={handleLaunchBhc}
                  disabled={bhcLaunching}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all text-sm"
                >
                  {bhcLaunching
                    ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Opening…</>
                    : <>{bhcLaunched ? "Open BHC Again" : "Start BHC Now →"}<svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></>
                  }
                </button>

                {bhcLaunched && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-center">
                    <p className="text-amber-700 text-sm mb-2">
                      Finish the BHC in the tab that opened. When you&apos;re done, this page will update on its own.
                    </p>
                    <button
                      onClick={checkBhc}
                      disabled={bhcChecking}
                      className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-bold hover:text-amber-900 transition-colors disabled:opacity-40"
                    >
                      {bhcChecking
                        ? <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Checking…</>
                        : "Check my result →"
                      }
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep("form-1")} className="border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-navy-900 font-semibold px-5 py-3 rounded-xl transition-all text-sm">← Back</button>
              <button
                disabled={!bhcResult}
                onClick={() => next("tc")}
                className="flex-1 bg-navy-900 hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all text-sm"
              >
                {bhcResult ? "Continue →" : "Complete BHC first"}
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            T&C
        ════════════════════════════════════════════════ */}
        {step === "tc" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-navy-900 mb-1">Read and agree</h2>
            <p className="text-gray-500 text-sm mb-5">Tick all four boxes to move to the application.</p>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-500 leading-relaxed space-y-3 mb-5 max-h-48 overflow-y-auto">
              {[
                ["1. About WIBG", "By applying to WIBG 2026, you agree to follow all guidelines and rules set by the organising team in partnership with SME Mall."],
                ["2. BHC Fee", "The ₦15,000 BHC fee is not refundable. Paying it does not mean you will be shortlisted or win."],
                ["3. Training Attendance", "You must attend both Saturday and Sunday sessions for at least 2 of the 3 August weekends to remain eligible."],
                ["4. Grand Finale", "If you are shortlisted among the top 6, you must be present in Lagos on September 12, 2026. Transport is your responsibility."],
              ].map(([title, body]) => (
                <div key={title}><p className="text-navy-900 font-semibold mb-0.5">{title}</p><p>{body}</p></div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              {TC_ITEMS.map((t) => (
                <label
                  key={t.id}
                  className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer border transition-all ${
                    tcChecked[t.id] ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all ${
                    tcChecked[t.id] ? "bg-green-500 border-green-500" : "border-gray-300"
                  }`}>
                    {tcChecked[t.id] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input type="checkbox" className="sr-only" checked={!!tcChecked[t.id]}
                    onChange={() => setTcChecked((c) => ({ ...c, [t.id]: !c[t.id] }))} />
                  <span className="text-gray-700 text-sm leading-relaxed">{t.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("bhc-step")} className="border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-navy-900 font-semibold px-5 py-3 rounded-xl transition-all text-sm">← Back</button>
              <button
                disabled={!tcAllChecked}
                onClick={() => next("form-2")}
                className="flex-1 bg-navy-900 hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all text-sm"
              >
                I Agree — Continue →
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            FORM 2 — Your Business
        ════════════════════════════════════════════════ */}
        {step === "form-2" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-navy-900 mb-1">Tell us about your business</h2>
            <p className="text-gray-500 text-sm mb-6">
              Answer in simple, everyday language. There are no wrong answers — just be honest and clear.
            </p>
            <div className="space-y-6">
              <div>
                <Label hint="What difficulty do your customers face before your business? Keep it simple.">
                  What problem are you solving?
                </Label>
                <textarea
                  rows={4}
                  placeholder="Example: Women traders in my area had to sell their tomatoes at very low prices because there was no place to keep them fresh. Many were losing money every week."
                  value={form.problem}
                  onChange={set("problem")}
                  className={textareaCls}
                />
              </div>
              <div>
                <Label hint="Describe what you sell or what service you provide.">
                  What does your business do?
                </Label>
                <textarea
                  rows={4}
                  placeholder="Example: I provide affordable daily cold storage for market women. They pay ₦500 per day to store their goods safely so they can sell at the right time."
                  value={form.solution}
                  onChange={set("solution")}
                  className={textareaCls}
                />
              </div>
              <div>
                <Label hint="Who are the people that buy from you or need your service? Where are they? How many of them are there?">
                  Who are your customers?
                </Label>
                <textarea
                  rows={4}
                  placeholder="Example: My customers are women who sell fresh produce in Bodija market, Ibadan. There are over 3,000 traders in that market alone who face this problem."
                  value={form.market}
                  onChange={set("market")}
                  className={textareaCls}
                />
              </div>
              {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep("tc")} className="border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-navy-900 font-semibold px-5 py-3 rounded-xl transition-all text-sm">← Back</button>
                <button
                  onClick={() => next("form-3", () => {
                    if (!form.problem || !form.solution || !form.market) {
                      setError("Please answer all three questions."); return false;
                    }
                    return true;
                  })}
                  className="flex-1 bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 rounded-xl transition-all text-sm"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            FORM 3 — Your Numbers
        ════════════════════════════════════════════════ */}
        {step === "form-3" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-navy-900 mb-1">Your business numbers</h2>
            <p className="text-gray-500 text-sm mb-6">
              Don&apos;t worry if your numbers are small — just be honest. Judges want to see that you understand your business.
            </p>
            <div className="space-y-5">
              <div>
                <Label hint="Tell us what your business has done so far. Do you have customers? Have you made any sales? What have you built or achieved?">
                  What has your business achieved so far?
                </Label>
                <textarea
                  rows={4}
                  placeholder="Example: I have 8 regular customers who pay me every week. In the last 3 months, I earned about ₦84,000. I also built a small storage shed and bought one used refrigerator."
                  value={form.traction}
                  onChange={set("traction")}
                  className={textareaCls}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label hint="Enter 0 if you haven't earned anything yet — that is okay.">
                    How much did your business earn in the last 3 months? (₦)
                  </Label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 84000"
                    value={form.revenue3m}
                    onChange={set("revenue3m")}
                    className={inputCls}
                  />
                </div>
                <div>
                  <Label hint="Give your best honest guess for the next 12 months.">
                    How much do you hope to earn in the next 12 months? (₦)
                  </Label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500000"
                    value={form.proj12m}
                    onChange={set("proj12m")}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <Label>Where is your business right now?</Label>
                <select required value={form.bizStage} onChange={set("bizStage")} className={selectCls}>
                  <option value="" disabled>Pick the one that fits you best…</option>
                  <option value="idea">Just an idea — I have not started yet</option>
                  <option value="prototype">I have started but I do not have paying customers yet</option>
                  <option value="early-traction">I have paying customers and I am making some money</option>
                  <option value="growth">My business is running well and I want to grow it bigger</option>
                </select>
              </div>

              {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

              <div className="flex gap-3">
                <button onClick={() => setStep("form-2")} className="border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-navy-900 font-semibold px-5 py-3 rounded-xl transition-all text-sm">← Back</button>
                <button
                  onClick={() => {
                    if (!form.traction || !form.bizStage) { setError("Please fill in all required fields."); return; }
                    submit();
                  }}
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-sm"
                >
                  {loading ? "Submitting…" : "Submit My Application →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            SUCCESS
        ════════════════════════════════════════════════ */}
        {step === "success" && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-8 sm:p-10 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-2">
                Application received, {form.founderName.split(" ")[0]}!
              </h2>
              <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
                We have your application. A confirmation email will be sent to{" "}
                <span className="text-navy-900 font-semibold">{form.founderEmail}</span>.
              </p>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-left max-w-sm mx-auto mb-6">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Receipt</span>
                  <span className="text-green-600 text-xs font-bold font-mono">#{receiptId.slice(-10).toUpperCase()}</span>
                </div>
                {[
                  { label: "Name",     val: form.founderName  },
                  { label: "Business", val: form.businessName },
                  { label: "BHC",      val: bhcResult ? `${bhcResult.percentage}/100 — ${bhcResult.status}` : "Completed" },
                  { label: "Stage",    val: form.bizStage     },
                  { label: "Date",     val: new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-400 text-xs">{r.label}</span>
                    <span className="text-navy-900 text-xs font-semibold max-w-[200px] text-right truncate">{r.val}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
                  Go to Dashboard
                </Link>
                <Link href="/dashboard/wibg" className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                  WIBG Overview
                </Link>
              </div>
            </div>

            {/* ── Pitch Video Instruction ─────────────────── */}
            <div className="bg-navy-900 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-lg">🎥</div>
                <div>
                  <p className="text-white font-extrabold text-base mb-1">One more thing — record your pitch video</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Record a short video (no more than 2 minutes) telling us about your business and why you should win the WIBG 2026 grant.
                    Post it on any social media platform — Instagram, Facebook, TikTok, or YouTube — and <strong className="text-white">tag SME Mall&apos;s official handle</strong> in your post.
                  </p>
                  <div className="bg-white/[0.06] rounded-xl p-4 space-y-2">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Our official handles</p>
                    {[
                      { platform: "Instagram", handle: "@smemallofficial" },
                      { platform: "Facebook",  handle: "@smemallofficial" },
                      { platform: "TikTok",    handle: "@smemallofficial" },
                      { platform: "X (Twitter)", handle: "@smemallofficial" },
                    ].map((s) => (
                      <div key={s.platform} className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">{s.platform}</span>
                        <span className="text-green-400 text-sm font-bold">{s.handle}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs mt-3">
                    Your pitch video helps the judges get to know you. Make sure your post is set to <strong className="text-gray-400">public</strong> so we can see it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        </>}

      </div>
    </DashboardLayout>
  );
}

/* ── Icons ───────────────────────────────────────────────────── */
function GridIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function ClipboardIcon() { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>; }
function TrophyIcon()    { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>; }
function AppsIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" /></svg>; }
function UserIcon()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>; }
