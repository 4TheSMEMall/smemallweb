import type { IBhcGapRepository } from "../../../domain/repositories/IBhcGapRepository";
import type { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestEntity } from "../../../domain/entities/ServiceRequest";
import { ForbiddenError, NotFoundError, ConflictError } from "../../../domain/errors/DomainError";

/**
 * SME clicks "Fix This" on an open gap that needs a provider.
 * v1 is admin-mediated: this just files the request — no provider is
 * chosen here. An admin picks a provider from the directory separately.
 */
export class RequestServiceUseCase {
  constructor(
    private readonly bhcGapRepo: IBhcGapRepository,
    private readonly serviceRequestRepo: IServiceRequestRepository
  ) {}

  async execute(userId: string, gapId: string): Promise<ServiceRequestEntity> {
    const gaps = await this.bhcGapRepo.findByUserId(userId);
    const gap = gaps.find((g) => g.id === gapId);

    if (!gap) throw new NotFoundError("Gap");
    if (gap.userId !== userId) throw new ForbiddenError("This gap does not belong to you");
    if (!gap.needsProvider) throw new ConflictError("This gap does not need a service provider");
    if (gap.status !== "OPEN") throw new ConflictError("A request for this gap already exists");

    const request = await this.serviceRequestRepo.create(gapId, userId);
    await this.bhcGapRepo.updateStatus(gapId, "REQUESTED");

    return request;
  }
}
