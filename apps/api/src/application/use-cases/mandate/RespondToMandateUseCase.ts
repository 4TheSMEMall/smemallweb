import type { PrismaMandateRepository } from "../../../infrastructure/repositories/PrismaMandateRepository";
import type { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { MandateEntity } from "../../../domain/entities/Mandate";
import { NotFoundError, ForbiddenError, ConflictError } from "../../../domain/errors/DomainError";
import { logActivity } from "../../../infrastructure/repositories/PrismaActivityLogRepository";

/**
 * The SME either signs or rejects the sent mandate.
 * Signing → ServiceRequest advances to MANDATE_SIGNED (provider can now start).
 * Rejecting → mandate goes back to REJECTED; admin must revise and re-send.
 */
export class RespondToMandateUseCase {
  constructor(
    private readonly mandateRepo: PrismaMandateRepository,
    private readonly serviceRequestRepo: IServiceRequestRepository,
  ) {}

  async sign(userId: string, serviceRequestId: string): Promise<MandateEntity> {
    const { mandate, request } = await this.validate(userId, serviceRequestId);

    const [signed] = await Promise.all([
      this.mandateRepo.sign(mandate.id, userId),
      this.serviceRequestRepo.updateStatus(serviceRequestId, "MANDATE_SIGNED"),
    ]);

    logActivity(userId, "BUSINESS_OWNER", "mandate.signed", "Mandate", mandate.id, {
      serviceRequestId, price: mandate.price,
    });

    void request; // consumed by validate
    return signed;
  }

  async reject(userId: string, serviceRequestId: string, rejectionReason: string): Promise<MandateEntity> {
    const { mandate } = await this.validate(userId, serviceRequestId);

    const [rejected] = await Promise.all([
      this.mandateRepo.reject(mandate.id, rejectionReason),
      this.serviceRequestRepo.updateStatus(serviceRequestId, "ASSIGNED"), // revert to ASSIGNED
    ]);

    logActivity(userId, "BUSINESS_OWNER", "mandate.rejected", "Mandate", mandate.id, {
      serviceRequestId, reason: rejectionReason,
    });

    return rejected;
  }

  private async validate(userId: string, serviceRequestId: string) {
    const request = await this.serviceRequestRepo.findById(serviceRequestId);
    if (!request) throw new NotFoundError("Service request");
    if (request.userId !== userId) throw new ForbiddenError("This request does not belong to you");
    if (request.status !== "MANDATE_SENT") {
      throw new ConflictError("No mandate is awaiting your response");
    }
    const mandate = await this.mandateRepo.findByServiceRequestId(serviceRequestId);
    if (!mandate) throw new NotFoundError("Mandate");
    return { mandate, request };
  }
}
