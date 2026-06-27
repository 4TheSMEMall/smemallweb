import api from "./api";
import type { ApiResponse } from "@sme-mall/shared";

export type ServiceRequestStatus = "PENDING_REVIEW" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

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

  assignServiceRequest: (requestId: string, providerId: string, priceAgreed?: string, adminNotes?: string) =>
    api.post<ApiResponse<null>>(`/admin/service-requests/${requestId}/assign`, { providerId, priceAgreed, adminNotes }),

  cancelServiceRequest: (requestId: string, adminNotes?: string) =>
    api.post<ApiResponse<null>>(`/admin/service-requests/${requestId}/cancel`, { adminNotes }),
};

export function statusBadgeColor(status: ServiceRequestStatus): string {
  switch (status) {
    case "PENDING_REVIEW": return "text-gray-600 bg-gray-50 border-gray-200";
    case "ASSIGNED":       return "text-blue-600 bg-blue-50 border-blue-200";
    case "IN_PROGRESS":    return "text-amber-600 bg-amber-50 border-amber-200";
    case "COMPLETED":      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "CANCELLED":      return "text-red-600 bg-red-50 border-red-200";
  }
}

export function statusLabel(status: ServiceRequestStatus): string {
  switch (status) {
    case "PENDING_REVIEW": return "Pending Review";
    case "ASSIGNED":       return "Assigned";
    case "IN_PROGRESS":    return "In Progress";
    case "COMPLETED":      return "Completed";
    case "CANCELLED":      return "Cancelled";
  }
}
