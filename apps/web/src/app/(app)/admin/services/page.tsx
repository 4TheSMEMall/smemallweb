"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { serviceApi, statusBadgeColor, statusLabel, type Provider, type ServiceRequestWithDetails, type Mandate } from "@/lib/serviceApi";
import {
  CheckCircleIcon, WrenchIcon, GridIcon, TrophyIcon, UsersIcon, BuildingIcon, StarIcon, MegaphoneIcon,
} from "@/components/ui/icons";

const navItems = [
  { label: "Overview",      path: "/admin",              icon: <GridIcon /> },
  { label: "WIBG Pipeline", path: "/admin/wibg",         icon: <TrophyIcon /> },
  { label: "Services",      path: "/admin/services",     icon: <WrenchIcon /> },
  { label: "Users",         path: "/admin/users",        icon: <UsersIcon /> },
  { label: "Partners",      path: "/admin/partners",     icon: <BuildingIcon /> },
  { label: "Consultants",   path: "/admin/consultants",  icon: <StarIcon /> },
  { label: "Announcements", path: "/admin/content",      icon: <MegaphoneIcon /> },
];

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [tempPasswordResult, setTempPasswordResult] = useState<{ businessName: string; tempPassword: string } | null>(null);
  const [assigning, setAssigning] = useState<ServiceRequestWithDetails | null>(null);
  const [mandating, setMandating] = useState<ServiceRequestWithDetails | null>(null);

  const { data: providers, isLoading: loadingProviders } = useQuery({
    queryKey: ["admin-providers"],
    queryFn:  () => serviceApi.getProviders().then((r) => r.data.data!),
  });

  const { data: pending, isLoading: loadingPending } = useQuery({
    queryKey: ["admin-pending-requests"],
    queryFn:  () => serviceApi.getPendingServiceRequests().then((r) => r.data.data!),
  });

  const { data: assigned } = useQuery({
    queryKey: ["admin-assigned-requests"],
    queryFn:  () => serviceApi.getAssignedServiceRequests().then((r) => r.data.data!),
  });

  const { data: mandateSent } = useQuery({
    queryKey: ["admin-mandate-sent"],
    queryFn:  () => serviceApi.getMandateSentRequests().then((r) => r.data.data!),
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-requests"] });
    queryClient.invalidateQueries({ queryKey: ["admin-assigned-requests"] });
    queryClient.invalidateQueries({ queryKey: ["admin-mandate-sent"] });
  }

  async function handleCancel(req: ServiceRequestWithDetails) {
    if (!confirm(`Cancel the request for "${req.gap.gapTitle}"? The gap will reopen for the SME.`)) return;
    await serviceApi.cancelServiceRequest(req.id);
    refresh();
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-6xl space-y-8">

        {/* Header */}
        <div className="relative bg-navy-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-radial from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <p className="text-gray-400 text-sm mb-1">Admin Portal</p>
            <h1 className="text-2xl font-extrabold text-white mb-1">Service Marketplace</h1>
            <p className="text-gray-400 text-sm">Manage providers and match pending BHC gap requests.</p>
          </div>
        </div>

        {/* Pending requests */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-navy-900">Pending Requests</h2>
              <p className="text-gray-400 text-sm mt-0.5">SMEs waiting to be matched with a provider</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              {pending?.length ?? 0} pending
            </span>
          </div>

          {loadingPending && <div className="p-6"><div className="bg-gray-100 rounded-xl h-16 animate-pulse" /></div>}

          {!loadingPending && (pending ?? []).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3"><CheckCircleIcon className="w-6 h-6 text-emerald-500" /></div>
              <p className="font-bold text-navy-900 mb-1">No pending requests</p>
              <p className="text-gray-400 text-sm">All caught up.</p>
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {(pending ?? []).map((req) => (
              <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{req.gap.section} · {req.gap.priority}</p>
                  <p className="font-bold text-navy-900">{req.gap.gapTitle}</p>
                  {req.smeBusinessOwner && (
                    <p className="text-xs text-gray-500 mt-1">{req.smeBusinessOwner.firstName} {req.smeBusinessOwner.lastName} · {req.smeBusinessOwner.email}</p>
                  )}
                  {req.gap.serviceTag && (
                    <span className="inline-block mt-2 text-[10px] font-bold text-navy-900 bg-gray-100 px-2 py-0.5 rounded-full">
                      {req.gap.serviceTag.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleCancel(req)}
                    className="text-xs font-semibold text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setAssigning(req)}
                    className="text-xs font-bold text-white bg-navy-900 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors"
                  >
                    Assign Provider →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awaiting Mandate — ASSIGNED but no mandate sent yet */}
        {(assigned ?? []).length > 0 && (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-navy-900">Awaiting Mandate</h2>
                <p className="text-gray-400 text-sm mt-0.5">Provider assigned — create and send the mandate next</p>
              </div>
              <span className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
                {assigned?.length ?? 0} awaiting
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {(assigned ?? []).map((req) => (
                <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{req.gap.section}</p>
                    <p className="font-bold text-navy-900">{req.gap.gapTitle}</p>
                    {req.smeBusinessOwner && <p className="text-xs text-gray-500 mt-1">{req.smeBusinessOwner.firstName} {req.smeBusinessOwner.lastName}</p>}
                    {req.provider && <p className="text-xs text-blue-600 mt-0.5">Provider: {req.provider.businessName}</p>}
                  </div>
                  <button onClick={() => setMandating(req)}
                    className="flex-shrink-0 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg transition-colors">
                    Create Mandate →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mandate Sent — waiting for SME signature */}
        {(mandateSent ?? []).length > 0 && (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-extrabold text-navy-900">Mandate Sent — Awaiting Signature</h2>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                {mandateSent?.length ?? 0} pending
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {(mandateSent ?? []).map((req) => (
                <div key={req.id} className="p-6 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-navy-900 text-sm">{req.gap.gapTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{req.smeBusinessOwner?.firstName} {req.smeBusinessOwner?.lastName} · {req.smeBusinessOwner?.email}</p>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                    Waiting for SME
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Providers directory */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-navy-900">Provider Directory</h2>
              <p className="text-gray-400 text-sm mt-0.5">Vetted providers available for assignment</p>
            </div>
            <button
              onClick={() => setShowAddProvider(true)}
              className="text-xs font-bold text-white bg-navy-900 hover:bg-red-500 px-4 py-2.5 rounded-xl transition-colors"
            >
              + Add Provider
            </button>
          </div>

          {loadingProviders && <div className="p-6"><div className="bg-gray-100 rounded-xl h-16 animate-pulse" /></div>}

          {!loadingProviders && (providers ?? []).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3"><WrenchIcon className="w-6 h-6 text-gray-400" /></div>
              <p className="font-bold text-navy-900 mb-1">No providers yet</p>
              <p className="text-gray-400 text-sm">Add your first vetted service provider to start matching requests.</p>
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {(providers ?? []).map((p) => (
              <div key={p.id} className="p-6 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-navy-900">{p.businessName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.contactEmail} · {p.contactPhone}</p>
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {p.serviceTags.map((t) => (
                      <span key={t} className="text-[10px] font-bold text-navy-900 bg-gray-100 px-2 py-0.5 rounded-full">{t.replace(/_/g, " ")}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-navy-900">★ {p.avgRating.toFixed(1)}</p>
                  <p className="text-[11px] text-gray-400">{p.reviewCount} review{p.reviewCount !== 1 ? "s" : ""}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.active ? "text-emerald-700 bg-emerald-50" : "text-gray-500 bg-gray-100"}`}>
                    {p.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddProvider && (
        <AddProviderModal
          onClose={() => setShowAddProvider(false)}
          onCreated={(businessName, tempPassword) => {
            setShowAddProvider(false);
            setTempPasswordResult({ businessName, tempPassword });
            refresh();
          }}
        />
      )}

      {tempPasswordResult && (
        <TempPasswordModal result={tempPasswordResult} onClose={() => setTempPasswordResult(null)} />
      )}

      {assigning && (
        <AssignProviderModal
          request={assigning}
          providers={providers ?? []}
          onClose={() => setAssigning(null)}
          onAssigned={() => { setAssigning(null); refresh(); }}
        />
      )}

      {mandating && (
        <MandateModal
          request={mandating}
          onClose={() => setMandating(null)}
          onSaved={() => { setMandating(null); refresh(); }}
        />
      )}
    </DashboardLayout>
  );
}

function MandateModal({ request, onClose, onSaved }: { request: ServiceRequestWithDetails; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: `${request.gap.gapTitle} — Service Mandate`,
    scope: "",
    deliverables: "",
    timeline: "",
    price: request.priceAgreed?.replace(/[^0-9.]/g, "") ?? "",
    adminNotes: "",
  });
  const [step, setStep] = useState<"edit" | "preview">("edit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function saveDraft() {
    if (!form.title || !form.scope || !form.deliverables || !form.timeline || !form.price) {
      setError("Please fill in all fields."); return;
    }
    setSubmitting(true); setError("");
    try {
      await serviceApi.saveMandate(request.id, { ...form, price: Number(form.price) });
      setStep("preview");
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not save mandate.");
    } finally { setSubmitting(false); }
  }

  async function sendToSme() {
    setSubmitting(true); setError("");
    try {
      await serviceApi.saveMandate(request.id, { ...form, price: Number(form.price) });
      await serviceApi.sendMandate(request.id);
      onSaved();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not send mandate.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-gray-100">
          <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-1">{request.gap.section}</p>
          <h2 className="text-xl font-extrabold text-navy-900">Create Mandate</h2>
          <p className="text-gray-500 text-sm mt-1">{request.gap.gapTitle} · {request.smeBusinessOwner?.firstName} {request.smeBusinessOwner?.lastName}</p>
        </div>

        {step === "edit" ? (
          <div className="p-6 sm:p-8 space-y-4">
            <div>
              <p className="text-sm font-semibold text-navy-900 mb-1.5">Mandate Title</p>
              <input value={form.title} onChange={set("title")} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900 mb-1.5">Scope of Work</p>
              <p className="text-[11px] text-gray-400 mb-1.5">What the provider will do. Be specific.</p>
              <textarea value={form.scope} onChange={set("scope")} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors resize-none" placeholder="e.g. Register the business with CAC as a Business Name, obtain RC number, provide certified copy of certificate..." />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900 mb-1.5">Deliverables</p>
              <textarea value={form.deliverables} onChange={set("deliverables")} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors resize-none" placeholder="e.g. Certified CAC certificate, RC number, stamped copy for records..." />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-navy-900 mb-1.5">Timeline</p>
                <input value={form.timeline} onChange={set("timeline")} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" placeholder="e.g. 5 working days" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-900 mb-1.5">Agreed Price (₦)</p>
                <input type="number" min="0" value={form.price} onChange={set("price")} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" placeholder="15000" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900 mb-1.5">Internal Notes (not shown to SME)</p>
              <textarea value={form.adminNotes} onChange={set("adminNotes")} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors resize-none" placeholder="Any internal context for the team..." />
            </div>
            {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="border border-gray-200 text-gray-500 font-semibold px-5 py-3 rounded-xl text-sm">Cancel</button>
              <button onClick={saveDraft} disabled={submitting} className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all">
                {submitting ? "Saving…" : "Preview Mandate →"}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 space-y-4 border border-gray-200">
              <h3 className="font-extrabold text-navy-900 text-lg border-b border-gray-200 pb-3">{form.title}</h3>
              {[
                { label: "Scope of Work", val: form.scope },
                { label: "Deliverables", val: form.deliverables },
                { label: "Timeline", val: form.timeline },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.val}</p>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-500">Agreed Price</p>
                <p className="text-lg font-extrabold text-navy-900">₦{Number(form.price).toLocaleString()}</p>
              </div>
              <p className="text-[11px] text-gray-400 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                By clicking "Sign & Approve", the SME confirms they agree to this scope, price, and timeline.
              </p>
            </div>
            {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep("edit")} className="border border-gray-200 text-gray-500 font-semibold px-5 py-3 rounded-xl text-sm">Edit</button>
              <button onClick={sendToSme} disabled={submitting} className="flex-1 bg-navy-900 hover:bg-red-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all">
                {submitting ? "Sending…" : "Send to SME →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Service catalogue — maps directly to the BHC gap-engine service tags ─────
const SERVICE_CATALOG = [
  {
    pillar: "Legal",
    dot: "bg-blue-500",
    badge: "text-blue-700 bg-blue-50 border-blue-200",
    services: [
      { tag: "cac_filing",           label: "CAC Business Registration" },
      { tag: "legal_consulting",     label: "Legal Consulting" },
      { tag: "licensing_compliance", label: "Licences & Permits" },
      { tag: "ip_legal",             label: "IP & Trademark" },
    ],
  },
  {
    pillar: "Finance & Accounting",
    dot: "bg-emerald-500",
    badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
    services: [
      { tag: "bookkeeping",         label: "Bookkeeping Setup" },
      { tag: "audit",               label: "Audit & Accounts" },
      { tag: "financial_advisory",  label: "Financial Advisory" },
      { tag: "tax_filing",          label: "Tax Filing" },
      { tag: "compliance_advisory", label: "Regulatory Compliance" },
    ],
  },
  {
    pillar: "Human Resources",
    dot: "bg-purple-500",
    badge: "text-purple-700 bg-purple-50 border-purple-200",
    services: [
      { tag: "hr_consulting", label: "HR Consulting" },
    ],
  },
  {
    pillar: "Marketing & Branding",
    dot: "bg-pink-500",
    badge: "text-pink-700 bg-pink-50 border-pink-200",
    services: [
      { tag: "branding_design",    label: "Branding & Design" },
      { tag: "marketing_strategy", label: "Marketing Strategy" },
      { tag: "digital_marketing",  label: "Digital Marketing" },
    ],
  },
  {
    pillar: "Business Advisory",
    dot: "bg-amber-500",
    badge: "text-amber-700 bg-amber-50 border-amber-200",
    services: [
      { tag: "business_planning",     label: "Business Plan Writing" },
      { tag: "business_advisory",     label: "Business Advisory" },
      { tag: "operations_consulting", label: "Operations Consulting" },
    ],
  },
  {
    pillar: "Technology",
    dot: "bg-cyan-500",
    badge: "text-cyan-700 bg-cyan-50 border-cyan-200",
    services: [
      { tag: "web_design",          label: "Website Design" },
      { tag: "digital_tools_setup", label: "Digital Tools Setup" },
    ],
  },
] as const;

type ServiceTag = typeof SERVICE_CATALOG[number]["services"][number]["tag"];

function ServiceTagPicker({ selected, onChange }: { selected: string[]; onChange: (tags: string[]) => void }) {
  function toggle(tag: string) {
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]);
  }
  return (
    <div className="space-y-3">
      {SERVICE_CATALOG.map((group) => (
        <div key={group.pillar} className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
            <span className={`w-2 h-2 rounded-full ${group.dot} flex-shrink-0`} />
            <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">{group.pillar}</span>
          </div>
          <div className="flex flex-wrap gap-2 p-3">
            {group.services.map((svc) => {
              const active = selected.includes(svc.tag);
              return (
                <button
                  key={svc.tag}
                  type="button"
                  onClick={() => toggle(svc.tag)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    active
                      ? `${group.badge} border`
                      : "text-gray-500 bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {active && "✓ "}{svc.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function AddProviderModal({ onClose, onCreated }: { onClose: () => void; onCreated: (businessName: string, tempPassword: string) => void }) {
  const [form, setForm] = useState({ businessName: "", firstName: "", lastName: "", contactEmail: "", contactPhone: "" });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!form.businessName || !form.firstName || !form.lastName || !form.contactEmail || !form.contactPhone) {
      setError("Please fill in all contact fields."); return;
    }
    if (selectedTags.length === 0) { setError("Select at least one service this provider offers."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await serviceApi.createProvider({
        businessName: form.businessName,
        firstName: form.firstName,
        lastName: form.lastName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        serviceTags: selectedTags,
      });
      onCreated(res.data.data!.provider.businessName, res.data.data!.tempPassword);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not create provider.");
    } finally { setSubmitting(false); }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-navy-900 mb-1">Add Service Provider</h2>
          <p className="text-gray-500 text-sm">Creates a login account (role: Provider) plus their provider profile.</p>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          {/* Basic info */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Provider Details</p>
            <div className="space-y-3">
              <input placeholder="Business name" value={form.businessName} onChange={set("businessName")}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="First name" value={form.firstName} onChange={set("firstName")}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
                <input placeholder="Last name" value={form.lastName} onChange={set("lastName")}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
              </div>
              <input placeholder="Contact email (used to log in)" type="email" value={form.contactEmail} onChange={set("contactEmail")}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
              <input placeholder="Contact phone" value={form.contactPhone} onChange={set("contactPhone")}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors" />
            </div>
          </div>

          {/* Service catalogue picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Services Offered</p>
              {selectedTags.length > 0 && (
                <span className="text-[10px] font-bold text-navy-900 bg-navy-900/5 px-2 py-0.5 rounded-full">
                  {selectedTags.length} selected
                </span>
              )}
            </div>
            <ServiceTagPicker selected={selectedTags} onChange={setSelectedTags} />
          </div>

          {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="border border-gray-200 hover:border-gray-300 text-gray-500 font-semibold px-5 py-3 rounded-xl text-sm">
              Cancel
            </button>
            <button onClick={submit} disabled={submitting} className="flex-1 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all">
              {submitting ? "Creating…" : "Create Provider"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TempPasswordModal({ result, onClose }: { result: { businessName: string; tempPassword: string }; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircleIcon className="w-8 h-8 text-emerald-500" /></div>
        <h2 className="text-xl font-extrabold text-navy-900 mb-2">{result.businessName} added</h2>
        <p className="text-gray-500 text-sm mb-5">Share this temporary password with the provider — it won&apos;t be shown again.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-lg font-mono font-bold text-navy-900">{result.tempPassword}</p>
        </div>
        <button onClick={onClose} className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 rounded-xl transition-all text-sm">
          Done
        </button>
      </div>
    </div>
  );
}

function AssignProviderModal({ request, providers, onClose, onAssigned }: {
  request: ServiceRequestWithDetails; providers: Provider[]; onClose: () => void; onAssigned: () => void;
}) {
  const [providerId, setProviderId] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const gapTag = request.gap.serviceTag;
  const active = providers.filter((p) => p.active);

  // Split into matched (can handle this gap type) and others
  const matched = gapTag ? active.filter((p) => p.serviceTags.includes(gapTag)) : [];
  const others  = active.filter((p) => !matched.includes(p));

  // Find the human-readable label for the gap's service tag
  const tagLabel = gapTag
    ? (SERVICE_CATALOG as unknown as { pillar: string; services: { tag: string; label: string }[] }[])
        .flatMap((g) => g.services)
        .find((s) => s.tag === gapTag)?.label ?? gapTag
    : null;

  async function submit() {
    if (!providerId) return;
    setSubmitting(true);
    try {
      await serviceApi.assignServiceRequest(request.id, providerId, price || undefined, notes || undefined);
      onAssigned();
    } finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{request.gap.section} · {request.gap.priority}</p>
        <h2 className="text-xl font-extrabold text-navy-900 mb-1">{request.gap.gapTitle}</h2>
        {tagLabel && (
          <p className="text-xs text-gray-400 mb-5">Needs: <span className="font-semibold text-navy-900">{tagLabel}</span></p>
        )}

        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-1">
          {active.length === 0 && (
            <p className="text-amber-700 text-xs bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              No active providers yet. Add one from the directory first.
            </p>
          )}

          {matched.length > 0 && (
            <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-1.5">
              ✓ Matched for this service
            </p>
          )}
          {matched.map((p) => (
            <ProviderCard key={p.id} provider={p} selected={providerId === p.id} onSelect={() => setProviderId(p.id)} isMatch />
          ))}

          {others.length > 0 && (
            <p className={`text-[9px] font-black text-gray-400 uppercase tracking-widest ${matched.length > 0 ? "mt-3" : ""} mb-1.5`}>
              {matched.length > 0 ? "Other providers" : "Available providers"}
            </p>
          )}
          {others.map((p) => (
            <ProviderCard key={p.id} provider={p} selected={providerId === p.id} onSelect={() => setProviderId(p.id)} isMatch={false} />
          ))}
        </div>

        <input placeholder="Agreed price (optional, e.g. ₦15,000)" value={price} onChange={(e) => setPrice(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors mb-3" />
        <textarea placeholder="Internal notes (optional)" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-900 transition-colors mb-5 resize-none" />

        <div className="flex gap-3">
          <button onClick={onClose} className="border border-gray-200 hover:border-gray-300 text-gray-500 font-semibold px-5 py-3 rounded-xl text-sm">
            Cancel
          </button>
          <button onClick={submit} disabled={!providerId || submitting} className="flex-1 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all">
            {submitting ? "Assigning…" : "Assign →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProviderCard({ provider, selected, onSelect, isMatch }: {
  provider: Provider; selected: boolean; onSelect: () => void; isMatch: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${
        selected
          ? "border-navy-900 bg-navy-900/[0.04]"
          : "border-gray-100 hover:border-gray-200 bg-white"
      }`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
        selected ? "bg-navy-900 text-white" : "bg-gray-100 text-gray-500"
      }`}>
        {provider.businessName.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-bold text-navy-900 truncate">{provider.businessName}</span>
          {isMatch && <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">Match</span>}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-gray-400">★ {provider.avgRating.toFixed(1)} · {provider.reviewCount} review{provider.reviewCount !== 1 ? "s" : ""}</span>
        </div>
      </div>
      {selected && (
        <div className="w-4 h-4 rounded-full bg-navy-900 flex items-center justify-center flex-shrink-0">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
      )}
    </button>
  );
}

