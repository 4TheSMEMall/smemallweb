import type { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import type { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { NotFoundError, ConflictError } from "../../../domain/errors/DomainError";

/**
 * Admin assigns a provider from the directory to a PENDING_REVIEW request.
 * No matching algorithm in v1 — admin picks manually.
 */
export class AssignProviderUseCase {
  constructor(
    private readonly serviceRequestRepo: IServiceRequestRepository,
    private readonly providerRepo: IProviderRepository
  ) {}

  async execute(requestId: string, providerId: string, priceAgreed: string | null, adminNotes: string | null): Promise<void> {
    const request = await this.serviceRequestRepo.findById(requestId);
    if (!request) throw new NotFoundError("Service request");
    if (request.status !== "PENDING_REVIEW") throw new ConflictError("Only pending requests can be assigned");

    const provider = await this.providerRepo.findById(providerId);
    if (!provider) throw new NotFoundError("Provider");
    if (!provider.active) throw new ConflictError("This provider is not active");

    await this.serviceRequestRepo.assignProvider(requestId, providerId, priceAgreed, adminNotes);
  }
}
