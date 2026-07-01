import type { PrismaMandateRepository, CreateMandateData } from "../../../infrastructure/repositories/PrismaMandateRepository";
import type { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { MandateEntity } from "../../../domain/entities/Mandate";
import { NotFoundError, ConflictError, ForbiddenError } from "../../../domain/errors/DomainError";

/**
 * Admin creates or revises a mandate for a service request.
 * A mandate can only be created once the request is ASSIGNED.
 * A SENT mandate that's been REJECTED can be revised and re-sent.
 */
export class CreateOrUpdateMandateUseCase {
  constructor(
    private readonly mandateRepo: PrismaMandateRepository,
    private readonly serviceRequestRepo: IServiceRequestRepository,
  ) {}

  async execute(
    adminId: string,
    serviceRequestId: string,
    data: Omit<CreateMandateData, "serviceRequestId" | "createdByAdminId">,
  ): Promise<MandateEntity> {
    const request = await this.serviceRequestRepo.findById(serviceRequestId);
    if (!request) throw new NotFoundError("Service request");
    if (request.status === "PENDING_REVIEW") {
      throw new ConflictError("Assign a provider before creating a mandate");
    }
    if (request.status === "MANDATE_SIGNED" || request.status === "IN_PROGRESS" || request.status === "COMPLETED") {
      throw new ConflictError("Mandate is already signed — work is underway");
    }

    const existing = await this.mandateRepo.findByServiceRequestId(serviceRequestId);

    if (!existing) {
      return this.mandateRepo.create({ ...data, serviceRequestId, createdByAdminId: adminId });
    }

    if (!existing.isEditable) {
      throw new ForbiddenError("This mandate has already been sent and not yet rejected — you cannot edit it");
    }

    return this.mandateRepo.update(existing.id, data);
  }
}
