import api from "./api";
import type { ApiResponse } from "@sme-mall/shared";

export type ServiceRequestStatus = "PENDING_REVIEW" | "ASSIGNED" | "MANDATE_SENT" | "MANDATE_SIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type MandateStatus = "DRAFT" | "SENT" | "SIGNED" | "REJECTED";

export interface Mandate {
  id: string;
  serviceRequestId: string;
  createdByAdminId: string;
  title: string;
  scope: string;
  deliverables: string;
  timeline: string;
  price: number;
  currency: string;
  status: MandateStatus;
  adminNotes: string | null;
  sentAt: string | null;
  signedAt: string | null;
  signedByUserId: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isSuperAdmin: boolean;
  status: string;
  createdAt: string;
}

export interface ServiceRequestWithDetails {
  id: string;
  status: ServiceRequestStatus;
  priceAgreed: string | null;
  adminNotes: string | null;
  providerNotes: string | null;
  starRating: number | null;
  reviewText: string | null;
  requestedAt: string;
  assignedAt: string | null;
  completedAt: string | null;
  ratedAt: string | null;
  gap: {
    id: string;
    section: string;
    gapTitle: string;
    description: string;
    priority: string;
    serviceTag: string | null;
  };
  provider: {
    id: string;
    businessName: string;
    contactEmail: string;
    contactPhone: string;
  } | null;
  smeBusinessOwner?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  serviceTags: string[];
  contactEmail: string;
  contactPhone: string;
  active: boolean;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export const serviceApi = {
  // ── SME-facing ──────────────────────────────────────────────
  requestService: (gapId: string) =>
    api.post<ApiResponse<{ id: string }>>(`/bhc/gaps/${gapId}/request`),

  getMyServiceRequests: () =>
    api.get<ApiResponse<ServiceRequestWithDetails[]>>("/bhc/service-requests"),

  rateService: (requestId: string, starRating: number, reviewText?: string) =>
    api.post<ApiResponse<null>>(`/bhc/service-requests/${requestId}/rate`, { starRating, reviewText }),

  // ── Provider-facing ─────────────────────────────────────────
  getProviderMe: () =>
    api.get<ApiResponse<Provider>>("/provider/me"),

  getProviderJobs: () =>
    api.get<ApiResponse<ServiceRequestWithDetails[]>>("/provider/jobs"),

  updateJobStatus: (requestId: string, status: ServiceRequestStatus, providerNotes?: string) =>
    api.patch<ApiResponse<null>>(`/provider/jobs/${requestId}/status`, { status, providerNotes }),

  // ── Admin-facing ────────────────────────────────────────────
  getProviders: () =>
    api.get<ApiResponse<Provider[]>>("/admin/providers"),

  createProvider: (data: { businessName: string; contactEmail: string; contactPhone: string; serviceTags: string[]; firstName: string; lastName: string }) =>
    api.post<ApiResponse<{ provider: Provider; tempPassword: string }>>("/admin/providers", data),

  getPendingServiceRequests: () =>
    api.get<ApiResponse<ServiceRequestWithDetails[]>>("/admin/service-requests"),

  getAssignedServiceRequests: () =>
    api.get<ApiResponse<ServiceRequestWithDetails[]>>("/admin/service-requests/assigned"),

  getMandateSentRequests: () =>
    api.get<ApiResponse<ServiceRequestWithDetails[]>>("/admin/service-requests/mandate-sent"),

  assignServiceRequest: (requestId: string, providerId: string, priceAgreed?: string, adminNotes?: string) =>
    api.post<ApiResponse<null>>(`/admin/service-requests/${requestId}/assign`, { providerId, priceAgreed, adminNotes }),

  cancelServiceRequest: (requestId: string, adminNotes?: string) =>
    api.post<ApiResponse<null>>(`/admin/service-requests/${requestId}/cancel`, { adminNotes }),

  // ── Mandate — admin side ──────────────────────────────────────
  getMandate: (serviceRequestId: string) =>
    api.get<ApiResponse<Mandate | null>>(`/admin/service-requests/${serviceRequestId}/mandate`),

  saveMandate: (serviceRequestId: string, data: { title: string; scope: string; deliverables: string; timeline: string; price: number; adminNotes?: string }) =>
    api.post<ApiResponse<Mandate>>(`/admin/service-requests/${serviceRequestId}/mandate`, data),

  sendMandate: (serviceRequestId: string) =>
    api.post<ApiResponse<Mandate>>(`/admin/service-requests/${serviceRequestId}/mandate/send`),

  // ── Mandate — SME side ────────────────────────────────────────
  getMandateForSme: (serviceRequestId: string) =>
    api.get<ApiResponse<Mandate | null>>(`/bhc/service-requests/${serviceRequestId}/mandate`),

  signMandate: (serviceRequestId: string) =>
    api.post<ApiResponse<Mandate>>(`/bhc/service-requests/${serviceRequestId}/mandate/sign`),

  rejectMandate: (serviceRequestId: string, reason: string) =>
    api.post<ApiResponse<Mandate>>(`/bhc/service-requests/${serviceRequestId}/mandate/reject`, { reason }),

  // ── Super Admin — Team ────────────────────────────────────────
  listAdmins: () =>
    api.get<ApiResponse<AdminUser[]>>("/admin/team"),

  createAdmin: (data: { email: string; firstName: string; lastName: string; phone?: string; password: string }) =>
    api.post<ApiResponse<AdminUser>>("/admin/team", data),

  toggleSuperAdmin: (adminId: string, isSuperAdmin: boolean) =>
    api.patch<ApiResponse<AdminUser>>(`/admin/team/${adminId}/super`, { isSuperAdmin }),

  // ── Super Admin — Activity Log ────────────────────────────────
  getActivityLog: (params?: { actorId?: string; entityType?: string; page?: number }) =>
    api.get<ApiResponse<{ logs: ActivityLogEntry[]; total: number; page: number; pages: number }>>("/admin/activity-log", { params }),

  getActivityStats: () =>
    api.get<ApiResponse<ActivityStatRow[]>>("/admin/activity-log/stats"),
};

export interface ActivityLogEntry {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  actor: { firstName: string; lastName: string; role: string };
}

export interface ActivityStatRow {
  actorId: string;
  actorRole: string;
  _count: { id: number };
  _max: { createdAt: string | null };
}

export function statusBadgeColor(status: ServiceRequestStatus): string {
  switch (status) {
    case "PENDING_REVIEW":  return "text-gray-600 bg-gray-50 border-gray-200";
    case "ASSIGNED":        return "text-blue-600 bg-blue-50 border-blue-200";
    case "MANDATE_SENT":    return "text-violet-600 bg-violet-50 border-violet-200";
    case "MANDATE_SIGNED":  return "text-indigo-600 bg-indigo-50 border-indigo-200";
    case "IN_PROGRESS":     return "text-amber-600 bg-amber-50 border-amber-200";
    case "COMPLETED":       return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "CANCELLED":       return "text-red-600 bg-red-50 border-red-200";
  }
}

export function statusLabel(status: ServiceRequestStatus): string {
  switch (status) {
    case "PENDING_REVIEW":  return "Pending Review";
    case "ASSIGNED":        return "Assigned";
    case "MANDATE_SENT":    return "Mandate Sent";
    case "MANDATE_SIGNED":  return "Mandate Signed";
    case "IN_PROGRESS":     return "In Progress";
    case "COMPLETED":       return "Completed";
    case "CANCELLED":       return "Cancelled";
  }
}
