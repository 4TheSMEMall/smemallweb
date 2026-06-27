import type { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import type { IBhcGapRepository } from "../../../domain/repositories/IBhcGapRepository";
import { NotFoundError, ConflictError } from "../../../domain/errors/DomainError";

export class CancelServiceRequestUseCase {
  constructor(
    private readonly serviceRequestRepo: IServiceRequestRepository,
    private readonly bhcGapRepo: IBhcGapRepository
  ) {}

  async execute(requestId: string, adminNotes: string | null): Promise<void> {
    const request = await this.serviceRequestRepo.findById(requestId);
    if (!request) throw new NotFoundError("Service request");
    if (request.status === "COMPLETED") throw new ConflictError("Cannot cancel a completed request");

    await this.serviceRequestRepo.cancel(requestId, adminNotes);
    await this.bhcGapRepo.updateStatus(request.gapId, "OPEN");
  }
}
