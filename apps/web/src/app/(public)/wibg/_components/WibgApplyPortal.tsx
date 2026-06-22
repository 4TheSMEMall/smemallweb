"use client";

import { useState, useEffect } from "react";
import { bhcApi } from "@/lib/bhcApi";

type Step = "form-1" | "bhc-step" | "tc" | "form-2" | "form-3" | "form-4" | "success";

interface FormData {
  founderName:    string;
  founderEmail:   string;
  founderPhone:   string;
  businessName:   string;
  cacStatus:      string;
  cacNumber:      string;
  problem:        string;
  solution:       string;
  market:         string;
  traction:       string;
  revenue3m:      string;
  proj12m:        string;
  bizStage:       string;
  pitchVideoLink: string;
}

const EMPTY: FormData = {
  founderName: "", founderEmail: "", founderPhone: "",
  businessName: "", cacStatus: "", cacNumber: "",
  problem: "", solution: "", market: "",
  traction: "", revenue3m: "", proj12m: "", bizStage: "",
  pitchVideoLink: "",
};

const TC_ITEMS = [
  { id: "gender",  label: "I confirm that my business is majority female-owned or co-founded and actively managed by a woman." },
  { id: "bhc",     label: "I understand the BHC diagnostic fee of ₦15,000 is non-refundable and does not guarantee shortlisting." },
  { id: "webinar", label: "I commit to attending August webinars — at least 2 of 3 weekends, both Saturday and Sunday sessions." },
  { id: "agree",   label: "I accept all terms, conditions, and judging decisions of the WIBG 2026 committee." },
];

const PHASE_LABELS: Record<Step, string> = {
  "form-1":  "Business Profile",
  "bhc-step": "BHC Assessment",
  "tc":       "Terms & Agreement",
  "form-2":   "Business Concept",
  "form-3":   "Financials",
  "form-4":   "Pitch Video",
  "success":  "Submitted",
};

const STEP_ORDER: Step[] = ["form-1", "bhc-step", "tc", "form-2", "form-3", "form-4", "success"];

function stepIndex(s: Step) { return STEP_ORDER.indexOf(s); }

function wordCount(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

const inputCls    = "w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-colors";
const selectCls   = "w-full bg-navy-900 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors";
const textareaCls = "w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-colors resize-none";

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <p className="text-gray-400 text-xs font-semibold mb-1">{children}</p>
      {hint && <p className="text-gray-600 text-[11px] mb-1.5 leading-relaxed">{hint}</p>}
    </div>
  );
}

export function WibgApplyPortal({ onClose }: { onClose: () => void }) {
  const [step, setStep]           = useState<Step>("form-1");
  const [tcChecked, setTcChecked] = useState<Record<string, boolean>>({});
  const [form, setForm]           = useState<FormData>(EMPTY);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [receiptId, setReceiptId] = useState("");

  // BHC step state
  const [bhcLaunched, setBhcLaunched]   = useState(false);
  const [bhcChecking, setBhcChecking]   = useState(false);
  const [bhcResult, setBhcResult]       = useState<{ percentage: number; status: string } | null>(null);
  const [bhcLaunching, setBhcLaunching] = useState(false);

  const tcAllChecked = TC_ITEMS.every((t) => tcChecked[t.id]);

  // On entering the BHC step, immediately check if user already has a result
  useEffect(() => {
    if (step !== "bhc-step") return;
    checkBhcResult();
  }, [step]);

  // When user returns to this tab after being on bhctestt.com, auto-check
  useEffect(() => {
    if (step !== "bhc-step" || !bhcLaunched) return;
    const handler = () => {
      if (!document.hidden) checkBhcResult();
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [step, bhcLaunched]);

  async function checkBhcResult() {
    setBhcChecking(true);
    try {
      const res = await bhcApi.getHistory();
      const latest = res.data.data?.latest;
      if (latest) setBhcResult({ percentage: latest.percentage, status: latest.status });
    } catch {
      // ignore
    } finally {
      setBhcChecking(false);
    }
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

  const goNext = (next: Step, validate?: () => boolean) => {
    if (validate && !validate()) return;
    setError("");
    setStep(next);
  };

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wibg/apply`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          revenue3m: Number(form.revenue3m) || 0,
          proj12m:   Number(form.proj12m)   || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Submission failed. Please try again.");
      setReceiptId(data.data.id);
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const currentIdx = stepIndex(step);

  return (
    <div className="fixed inset-0 z-[60] bg-navy-950 flex flex-col overflow-y-auto">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-navy-950/95 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-green-400 text-xs font-bold uppercase tracking-widest truncate">
            {PHASE_LABELS[step]}
          </span>
          {step !== "success" && (
            <span className="text-gray-700 text-xs hidden sm:inline">
              {currentIdx + 1} / {STEP_ORDER.length - 1}
            </span>
          )}
        </div>

        {/* Mini progress bar */}
        {step !== "success" && (
          <div className="hidden sm:flex items-center gap-1 flex-1 mx-8 max-w-xs">
            {STEP_ORDER.slice(0, -1).map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i < currentIdx ? "bg-green-500" :
                  i === currentIdx ? "bg-green-500/50" :
                  "bg-white/[0.08]"
                }`}
              />
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/[0.08] text-gray-500 hover:text-white hover:border-white/25 transition-colors flex-shrink-0"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* ── FORM 1: Profile ───────────────────────────────── */}
        {step === "form-1" && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-3">Founder &amp; Business Profile</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Let&apos;s start with your business.</h2>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              After this you&apos;ll take the BHC diagnostic through SME Mall — it unlocks the rest of the application.
            </p>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Full Name</Label><input required type="text" placeholder="Adeola Ogunlesi" value={form.founderName} onChange={set("founderName")} className={inputCls} /></div>
                <div><Label>Email Address</Label><input required type="email" placeholder="adeola@business.com" value={form.founderEmail} onChange={set("founderEmail")} className={inputCls} /></div>
                <div><Label>Phone Number</Label><input required type="tel" placeholder="+234 803 123 4567" value={form.founderPhone} onChange={set("founderPhone")} className={inputCls} /></div>
                <div><Label>Registered Business Name</Label><input required type="text" placeholder="ColdBox Agriculture Ltd" value={form.businessName} onChange={set("businessName")} className={inputCls} /></div>
                <div>
                  <Label>CAC Registration Status</Label>
                  <select required value={form.cacStatus} onChange={set("cacStatus")} className={selectCls}>
                    <option value="" disabled>Select status</option>
                    <option value="registered-ltd">Registered — Private Limited (Ltd)</option>
                    <option value="registered-bn">Registered — Business Name (BN)</option>
                    <option value="registered-coop">Registered — Cooperative Society</option>
                    <option value="in-progress">Registration In Progress</option>
                    <option value="unregistered">Unregistered</option>
                  </select>
                </div>
                <div><Label hint="e.g. RC 1234567 or BN 987654">CAC Number (if registered)</Label><input type="text" placeholder="RC 1234567 or BN 987654" value={form.cacNumber} onChange={set("cacNumber")} className={inputCls} /></div>
              </div>
              {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
              <div className="pt-2">
                <button
                  onClick={() => goNext("bhc-step", () => {
                    if (!form.founderName || !form.founderEmail || !form.founderPhone || !form.businessName || !form.cacStatus) {
                      setError("Please fill in all required fields."); return false;
                    }
                    return true;
                  })}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition-all text-sm"
                >
                  Continue to BHC Assessment →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── BHC STEP ──────────────────────────────────────── */}
        {step === "bhc-step" && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-3">Business Health Check</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              {bhcResult ? "BHC Complete." : "Take your BHC now."}
            </h2>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              {bhcResult
                ? "Your BHC result is on file. You can continue to the application."
                : "The BHC diagnostic is required before you can submit your pitch application. It takes about 15 minutes and costs ₦15,000."}
            </p>

            {/* Already have result */}
            {bhcResult && (
              <div className="bg-green-500/10 border border-green-500/25 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">BHC Verified</p>
                    <p className="text-gray-500 text-xs">Linked to your SME Mall account</p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-white/[0.04] rounded-xl">
                  <span className="text-gray-500 text-sm">Your BHC Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold text-white">{bhcResult.percentage}</span>
                    <span className="text-gray-600 text-sm">/100</span>
                    <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                      {bhcResult.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Not yet taken */}
            {!bhcResult && (
              <div className="space-y-4 mb-6">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/[0.06]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25 mb-4">What the BHC measures</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {["Legal & Compliance", "Accounting & Finance", "Human Resources", "Marketing & Sales", "Technology & Innovation", "Advisory & Governance"].map((d) => (
                        <div key={d} className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                          <span className="text-gray-400 text-sm">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-sm">Assessment Fee</p>
                      <p className="text-gray-500 text-xs">Paid on bhctestt.com · ~15 minutes</p>
                    </div>
                    <p className="text-2xl font-extrabold text-green-400">₦15,000</p>
                  </div>
                </div>

                <button
                  onClick={handleLaunchBhc}
                  disabled={bhcLaunching}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all text-sm"
                >
                  {bhcLaunching ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Launching…</>
                  ) : (
                    <>{bhcLaunched ? "Relaunch BHC" : "Launch BHC via SME Mall"}
                      <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </>
                  )}
                </button>

                {bhcLaunched && (
                  <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl px-5 py-4 text-center">
                    <p className="text-gray-500 text-xs mb-3">
                      Complete the BHC in the tab that opened. When you&apos;re done, come back here — your result will load automatically.
                    </p>
                    <button
                      onClick={checkBhcResult}
                      disabled={bhcChecking}
                      className="inline-flex items-center gap-2 text-green-400 text-xs font-bold hover:text-green-300 transition-colors disabled:opacity-40"
                    >
                      {bhcChecking ? (
                        <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Checking…</>
                      ) : "Check my result manually →"}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep("form-1")} className="border border-white/[0.08] hover:border-white/20 text-gray-500 hover:text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm">
                ← Back
              </button>
              <button
                disabled={!bhcResult}
                onClick={() => goNext("tc")}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all text-sm"
              >
                {bhcResult ? "Continue to Terms →" : "Complete BHC to continue"}
              </button>
            </div>
          </div>
        )}

        {/* ── T&C ───────────────────────────────────────────── */}
        {step === "tc" && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-3">Eligibility &amp; Terms</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">Read and agree before you proceed.</h2>

            <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 text-xs text-gray-500 leading-relaxed space-y-4 mb-6 max-h-52 overflow-y-auto">
              {[
                ["1. Introduction", "By participating in WIBG 2026, you agree to comply with all guidelines, schedules, and terms set forth by the committee in partnership with SME Mall."],
                ["2. Gateway Fee", "The ₦15,000 BHC fee is non-refundable. Payment does not guarantee shortlisting or grant receipt. Scoring is performed independently."],
                ["3. Webinar Attendance", "Participants must attend both Saturday and Sunday sessions for at least 2 of the 3 August weekends to remain eligible for shortlisting."],
                ["4. Video Pitch", "A shareable link to a 2-minute video pitch must be submitted. The link must be accessible — anyone with the link can view."],
                ["5. In-Person Finale", "Top 6 finalists must be physically available in Lagos on September 12, 2026. Travel and logistics are the participant's responsibility."],
              ].map(([title, body]) => (
                <div key={title}>
                  <p className="text-white font-semibold mb-1">{title}</p>
                  <p>{body}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-8">
              {TC_ITEMS.map((t) => (
                <label
                  key={t.id}
                  className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                    tcChecked[t.id]
                      ? "bg-green-500/10 border border-green-500/25"
                      : "bg-white/[0.02] border border-white/[0.07] hover:border-white/15"
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all ${
                    tcChecked[t.id] ? "bg-green-500 border-green-500" : "border-white/20"
                  }`}>
                    {tcChecked[t.id] && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input type="checkbox" className="sr-only" checked={!!tcChecked[t.id]}
                    onChange={() => setTcChecked((c) => ({ ...c, [t.id]: !c[t.id] }))} />
                  <span className="text-gray-300 text-sm leading-relaxed">{t.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("bhc-step")} className="border border-white/[0.08] hover:border-white/20 text-gray-500 hover:text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm">← Back</button>
              <button
                disabled={!tcAllChecked}
                onClick={() => goNext("form-2")}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all text-sm"
              >
                I Agree — Start Application →
              </button>
            </div>
          </div>
        )}

        {/* ── APPLICATION PROGRESS BAR (form-2 to form-4) ──── */}
        {(step === "form-2" || step === "form-3" || step === "form-4") && (
          <div className="flex items-center gap-1.5 mb-10">
            {["form-2", "form-3", "form-4"].map((s, i) => {
              const activeIdx = ["form-2", "form-3", "form-4"].indexOf(step);
              return (
                <div key={s} className="flex items-center gap-1.5 flex-1">
                  <div className={`h-1 flex-1 rounded-full transition-all ${i <= activeIdx ? "bg-green-500" : "bg-white/10"}`} />
                </div>
              );
            })}
            <span className="text-gray-600 text-[11px] font-bold ml-2 flex-shrink-0">
              {["form-2", "form-3", "form-4"].indexOf(step) + 1} / 3
            </span>
          </div>
        )}

        {/* ── FORM 2: Concept ───────────────────────────────── */}
        {step === "form-2" && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-3">Business Concept &amp; Market</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">What problem do you solve?</h2>
            <p className="text-gray-600 text-sm mb-8">Be specific. 30–80 words each. Judges reward customer insight over jargon.</p>
            <div className="space-y-6">
              <div>
                <Label hint="Who exactly suffers from this? Include location, age, income level.">The Problem</Label>
                <textarea rows={4} placeholder="Smallholder women farmers in Oyo State (ages 35–55, earning ₦30,000/month) lose 40% of their harvest due to lack of cold storage…" value={form.problem} onChange={set("problem")} className={textareaCls} />
                <p className="text-right text-[11px] text-gray-700 mt-1">{wordCount(form.problem)} / 80 words</p>
              </div>
              <div>
                <Label hint="What is your product or service? How does it solve the problem?">Your Solution</Label>
                <textarea rows={4} placeholder="ColdBox is a solar-powered, pay-as-you-go cold storage unit. Farmers rent it via mobile money (₦500/day)…" value={form.solution} onChange={set("solution")} className={textareaCls} />
                <p className="text-right text-[11px] text-gray-700 mt-1">{wordCount(form.solution)} / 80 words</p>
              </div>
              <div>
                <Label hint="TAM in Naira (show math). Who are your first 100 customers?">The Market</Label>
                <textarea rows={4} placeholder="Target: 2.3M smallholder women farmers. ₦500/day × 200 days × 10% = ₦23B TAM. First 100: tomato sellers in Ibadan…" value={form.market} onChange={set("market")} className={textareaCls} />
                <p className="text-right text-[11px] text-gray-700 mt-1">{wordCount(form.market)} / 80 words</p>
              </div>
              {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep("tc")} className="border border-white/[0.08] hover:border-white/20 text-gray-500 hover:text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm">← Back</button>
                <button
                  onClick={() => goNext("form-3", () => {
                    if (!form.problem || !form.solution || !form.market) { setError("Please fill in all three fields."); return false; }
                    return true;
                  })}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all text-sm"
                >
                  Next: Financials →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── FORM 3: Financials ────────────────────────────── */}
        {step === "form-3" && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-3">Traction &amp; Financials</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Show us the numbers.</h2>
            <p className="text-gray-600 text-sm mb-8">Financial Feasibility carries the highest judging weight (12%). Be honest and specific.</p>
            <div className="space-y-5">
              <div>
                <Label hint="Paying customers, revenue last 3 months, what you've built so far.">Your Traction</Label>
                <textarea rows={4} placeholder="5 prototypes built, tested with 12 farmers. 8 pay weekly. Revenue last 3 months: ₦84,000…" value={form.traction} onChange={set("traction")} className={textareaCls} />
                <p className="text-right text-[11px] text-gray-700 mt-1">{wordCount(form.traction)} / 80 words</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Actual Revenue — Last 3 Months (₦)</Label><input type="number" min="0" placeholder="84000" value={form.revenue3m} onChange={set("revenue3m")} className={inputCls} /></div>
                <div><Label>Projected Revenue — Next 12 Months (₦)</Label><input type="number" min="0" placeholder="1000000" value={form.proj12m} onChange={set("proj12m")} className={inputCls} /></div>
                <div className="sm:col-span-2">
                  <Label>Current Business Stage</Label>
                  <select required value={form.bizStage} onChange={set("bizStage")} className={selectCls}>
                    <option value="" disabled>Select stage</option>
                    <option value="idea">Idea Stage</option>
                    <option value="prototype">Prototype / MVP Stage</option>
                    <option value="early-traction">Early Traction (Paying customers)</option>
                    <option value="growth">Growth &amp; Expansion Stage</option>
                  </select>
                </div>
              </div>
              {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep("form-2")} className="border border-white/[0.08] hover:border-white/20 text-gray-500 hover:text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm">← Back</button>
                <button
                  onClick={() => goNext("form-4", () => {
                    if (!form.traction || !form.bizStage) { setError("Please fill in all required fields."); return false; }
                    return true;
                  })}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all text-sm"
                >
                  Next: Pitch Video →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── FORM 4: Pitch Video ───────────────────────────── */}
        {step === "form-4" && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-3">Pitch Video</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Make us believe in you.</h2>
            <p className="text-gray-600 text-sm mb-8">2 minutes. That&apos;s all you get. Make every second count.</p>

            <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 mb-6">
              <p className="text-white font-semibold text-sm mb-3">What to cover in 2 minutes:</p>
              <ol className="space-y-2 list-decimal list-inside">
                {[
                  "Introduce yourself and your business — name, what you do, where you operate",
                  "State the problem you solve and why it matters right now",
                  "Show your traction — real numbers, real customers, real progress",
                  "Tell us why you should win and what you'll do with the grant",
                ].map((b) => (
                  <li key={b} className="text-gray-500 text-sm leading-relaxed">{b}</li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <div>
                <Label hint='Upload to Google Drive, YouTube, or Dropbox then paste the shareable link. Set access to "Anyone with the link can view."'>
                  Shareable Video Link
                </Label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={form.pitchVideoLink}
                  onChange={set("pitchVideoLink")}
                  className={inputCls}
                />
              </div>

              {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep("form-3")} className="border border-white/[0.08] hover:border-white/20 text-gray-500 hover:text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm">← Back</button>
                <button
                  onClick={submit}
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-sm"
                >
                  {loading ? "Submitting…" : "Submit My Application →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SUCCESS ───────────────────────────────────────── */}
        {step === "success" && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400 mb-4">Application Received</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              You&apos;re in the running,<br />{form.founderName.split(" ")[0]}.
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
              Your pitch application has been securely logged. A confirmation and next-steps guide will be sent to{" "}
              <span className="text-white">{form.founderEmail}</span>.
            </p>

            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 text-left max-w-sm mx-auto mb-8">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.07]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Receipt</span>
                <span className="text-green-400 text-xs font-bold font-mono">#{receiptId.slice(-10).toUpperCase()}</span>
              </div>
              {[
                { label: "Founder",  val: form.founderName  },
                { label: "Business", val: form.businessName },
                { label: "BHC",      val: bhcResult ? `${bhcResult.percentage}/100 — ${bhcResult.status}` : "Completed" },
                { label: "Stage",    val: form.bizStage     },
                { label: "Date",     val: new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                  <span className="text-gray-600 text-xs">{r.label}</span>
                  <span className="text-white text-xs font-semibold max-w-[200px] text-right truncate">{r.val}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm"
            >
              Back to WIBG Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
