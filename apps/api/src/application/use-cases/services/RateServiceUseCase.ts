import type { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import type { IBhcGapRepository } from "../../../domain/repositories/IBhcGapRepository";
import type { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { ForbiddenError, NotFoundError, ConflictError, ValidationError } from "../../../domain/errors/DomainError";

/**
 * SME confirms a completed job and rates the provider.
 * This is also the moment the gap is finally closed — we deliberately do not
 * touch the BHC score here (bhctestt.com owns that); the SME is nudged to
 * retake the assessment instead.
 */
export class RateServiceUseCase {
  constructor(
    private readonly serviceRequestRepo: IServiceRequestRepository,
    private readonly bhcGapRepo: IBhcGapRepository,
    private readonly providerRepo: IProviderRepository
  ) {}

  async execute(userId: string, requestId: string, starRating: number, reviewText: string | null): Promise<void> {
    if (starRating < 1 || starRating > 5) {
      throw new ValidationError("Rating must be between 1 and 5 stars");
    }

    const request = await this.serviceRequestRepo.findById(requestId);
    if (!request) throw new NotFoundError("Service request");
    if (request.userId !== userId) throw new ForbiddenError("This request does not belong to you");
    if (request.status !== "COMPLETED") throw new ConflictError("This job has not been marked complete yet");
    if (request.ratedAt) throw new ConflictError("This job has already been rated");

    await this.serviceRequestRepo.rate(requestId, starRating, reviewText);
    await this.bhcGapRepo.updateStatus(request.gapId, "CLOSED");

    if (request.providerId) {
      await this.providerRepo.recordRating(request.providerId, starRating);
    }
  }
}
