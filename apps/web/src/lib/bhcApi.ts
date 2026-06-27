import api from "./api";
import type { ApiResponse } from "@sme-mall/shared";

export interface SectionScore {
  name: string;
  score: number;
  max_score: number;
  percentage: number;
}

export type GapPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Gap {
  gap_title: string;
  section: string;
  description: string;
  priority: GapPriority;
  needs_provider: boolean;
  service_tag: string | null;
}

export type GapStatus = "OPEN" | "REQUESTED" | "IN_PROGRESS" | "CLOSED";

// A trackable gap row — has a real id and status, unlike the raw Gap[] snapshot on BhcResult.
export interface TrackedGap {
  id: string;
  userId: string;
  bhcResultId: string;
  section: string;
  gapTitle: string;
  description: string;
  priority: GapPriority;
  needsProvider: boolean;
  serviceTag: string | null;
  status: GapStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BhcResult {
  id: string;
  assessmentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: string;
  sectionScores: SectionScore[];
  gaps: Gap[];
  completedAt: string;
  createdAt: string;
}

export interface BhcHistory {
  latest: BhcResult | null;
  history: BhcResult[];
  totalAssessments: number;
}

const BHC_BASE_URL = process.env.NEXT_PUBLIC_BHC_URL ?? "https://bhctestt.com";

export const bhcApi = {
  getHistory: () =>
    api.get<ApiResponse<BhcHistory>>("/bhc/history"),

  getGaps: () =>
    api.get<ApiResponse<TrackedGap[]>>("/bhc/gaps"),

  downloadReport: (assessmentId: string) =>
    api.get(`/bhc/results/${assessmentId}/report`, { responseType: "blob" }),

  /**
   * Gets a signed launch token then opens BHC with the token in the URL.
   * BHC reads the token, verifies it, and pre-fills the user's email.
   */
  launchTest: async () => {
    const res = await api.get<ApiResponse<{ token: string }>>("/bhc/launch-token");
    const token = res.data.data?.token;
    const url = token
      ? `${BHC_BASE_URL}/start?token=${token}`
      : `${BHC_BASE_URL}/start`;
    window.open(url, "_blank", "noopener,noreferrer");
  },
};

export function statusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "critical":   return "text-red-600 bg-red-50 border-red-200";
    case "fair":       return "text-amber-600 bg-amber-50 border-amber-200";
    case "good":       return "text-blue-600 bg-blue-50 border-blue-200";
    case "excellent":  return "text-emerald-600 bg-emerald-50 border-emerald-200";
    default:           return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function statusBarColor(status: string): string {
  switch (status.toLowerCase()) {
    case "critical":  return "bg-red-500";
    case "fair":      return "bg-amber-500";
    case "good":      return "bg-blue-500";
    case "excellent": return "bg-emerald-500";
    default:          return "bg-gray-400";
  }
}

export function gapPriorityColor(priority: GapPriority): string {
  switch (priority) {
    case "CRITICAL": return "text-red-600 bg-red-50 border-red-200";
    case "HIGH":      return "text-amber-600 bg-amber-50 border-amber-200";
    case "MEDIUM":    return "text-blue-600 bg-blue-50 border-blue-200";
    case "LOW":       return "text-gray-500 bg-gray-50 border-gray-200";
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
