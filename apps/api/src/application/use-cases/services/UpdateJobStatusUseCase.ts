import type { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import type { IBhcGapRepository } from "../../../domain/repositories/IBhcGapRepository";
import type { ServiceRequestStatus } from "../../../domain/entities/ServiceRequest";
import { ForbiddenError, NotFoundError, ConflictError } from "../../../domain/errors/DomainError";

const ALLOWED_TRANSITIONS: Record<ServiceRequestStatus, ServiceRequestStatus[]> = {
  PENDING_REVIEW: [],
  ASSIGNED:       ["IN_PROGRESS"],
  IN_PROGRESS:    ["COMPLETED"],
  COMPLETED:      [],
  CANCELLED:      [],
};

/**
 * Provider advances their own assigned job forward: ASSIGNED -> IN_PROGRESS -> COMPLETED.
 * Marking COMPLETED does not close the gap yet — the SME must confirm + rate first.
 */
export class UpdateJobStatusUseCase {
  constructor(
    private readonly serviceRequestRepo: IServiceRequestRepository,
    private readonly bhcGapRepo: IBhcGapRepository
  ) {}

  async execute(providerId: string, requestId: string, nextStatus: ServiceRequestStatus, providerNotes: string | null): Promise<void> {
    const request = await this.serviceRequestRepo.findById(requestId);
    if (!request) throw new NotFoundError("Service request");
    if (request.providerId !== providerId) throw new ForbiddenError("This job is not assigned to you");

    const allowed = ALLOWED_TRANSITIONS[request.status];
    if (!allowed.includes(nextStatus)) {
      throw new ConflictError(`Cannot move from ${request.status} to ${nextStatus}`);
    }

    await this.serviceRequestRepo.updateStatus(requestId, nextStatus, providerNotes);

    if (nextStatus === "IN_PROGRESS") {
      await this.bhcGapRepo.updateStatus(request.gapId, "IN_PROGRESS");
    }
    // On COMPLETED, the gap stays IN_PROGRESS until the SME rates it (see RateServiceUseCase).
  }
}
