import type { PrismaMandateRepository } from "../../../infrastructure/repositories/PrismaMandateRepository";
import type { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { MandateEntity } from "../../../domain/entities/Mandate";
import { NotFoundError, ConflictError } from "../../../domain/errors/DomainError";
import { logActivity } from "../../../infrastructure/repositories/PrismaActivityLogRepository";

/**
 * Admin sends the mandate to the SME for review.
 * Updates both Mandate.status and ServiceRequest.status.
 */
export class SendMandateUseCase {
  constructor(
    private readonly mandateRepo: PrismaMandateRepository,
    private readonly serviceRequestRepo: IServiceRequestRepository,
  ) {}

  async execute(adminId: string, serviceRequestId: string): Promise<MandateEntity> {
    const mandate = await this.mandateRepo.findByServiceRequestId(serviceRequestId);
    if (!mandate) throw new NotFoundError("Mandate");
    if (mandate.status !== "DRAFT" && mandate.status !== "REJECTED") {
      throw new ConflictError("Only a DRAFT or REJECTED mandate can be sent");
    }

    const [sent] = await Promise.all([
      this.mandateRepo.send(mandate.id),
      this.serviceRequestRepo.updateStatus(serviceRequestId, "MANDATE_SENT"),
    ]);

    logActivity(adminId, "ADMIN", "mandate.sent", "Mandate", mandate.id, {
      serviceRequestId, price: mandate.price,
    });

    return sent;
  }
}
