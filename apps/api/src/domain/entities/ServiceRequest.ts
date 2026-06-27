export type ServiceRequestStatus = "PENDING_REVIEW" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export class ServiceRequestEntity {
  constructor(
    public readonly id: string,
    public readonly gapId: string,
    public readonly userId: string,
    public readonly providerId: string | null,
    public readonly status: ServiceRequestStatus,
    public readonly priceAgreed: string | null,
    public readonly adminNotes: string | null,
    public readonly providerNotes: string | null,
    public readonly starRating: number | null,
    public readonly reviewText: string | null,
    public readonly requestedAt: Date,
    public readonly assignedAt: Date | null,
    public readonly completedAt: Date | null,
    public readonly ratedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

// Read-side projection — a service request with its gap and provider details
// flattened in, for list views (admin queue, provider jobs, SME tracker).
export interface ServiceRequestWithDetails {
  id: string;
  status: ServiceRequestStatus;
  priceAgreed: string | null;
  adminNotes: string | null;
  providerNotes: string | null;
  starRating: number | null;
  reviewText: string | null;
  requestedAt: Date;
  assignedAt: Date | null;
  completedAt: Date | null;
  ratedAt: Date | null;
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
