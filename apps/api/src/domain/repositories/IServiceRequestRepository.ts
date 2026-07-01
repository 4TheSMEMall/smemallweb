import type { ServiceRequestEntity, ServiceRequestStatus, ServiceRequestWithDetails } from "../entities/ServiceRequest";

export interface IServiceRequestRepository {
  findById(id: string): Promise<ServiceRequestEntity | null>;
  findPendingWithDetails(): Promise<ServiceRequestWithDetails[]>;
  findByStatusWithDetails(status: ServiceRequestStatus): Promise<ServiceRequestWithDetails[]>;
  findByUserIdWithDetails(userId: string): Promise<ServiceRequestWithDetails[]>;
  findByProviderIdWithDetails(providerId: string): Promise<ServiceRequestWithDetails[]>;
  create(gapId: string, userId: string): Promise<ServiceRequestEntity>;
  assignProvider(id: string, providerId: string, priceAgreed: string | null, adminNotes: string | null): Promise<void>;
  updateStatus(id: string, status: ServiceRequestStatus, providerNotes?: string | null): Promise<void>;
  cancel(id: string, adminNotes: string | null): Promise<void>;
  rate(id: string, starRating: number, reviewText: string | null): Promise<void>;
}
