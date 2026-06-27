import type { Request, Response, NextFunction } from "express";
import type { UpdateJobStatusUseCase } from "../../application/use-cases/services/UpdateJobStatusUseCase";
import type { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import type { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import type { ServiceRequestStatus } from "../../domain/entities/ServiceRequest";
import type { ApiResponse } from "@sme-mall/shared";
import { NotFoundError } from "../../domain/errors/DomainError";

export class ProviderController {
  constructor(
    private readonly updateJobStatusUseCase: UpdateJobStatusUseCase,
    private readonly providerRepo: IProviderRepository,
    private readonly serviceRequestRepo: IServiceRequestRepository
  ) {}

  /**
   * GET /api/provider/me — the provider's own profile (business name, rating, etc)
   */
  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const provider = await this.providerRepo.findByUserId(req.user!.sub);
      if (!provider) { res.status(404).json({ success: false, message: "Provider profile not found" }); return; }
      res.json({ success: true, data: provider } satisfies ApiResponse<typeof provider>);
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/provider/jobs — jobs assigned to this provider
   */
  getMyJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const provider = await this.providerRepo.findByUserId(req.user!.sub);
      if (!provider) { res.status(404).json({ success: false, message: "Provider profile not found" }); return; }

      const jobs = await this.serviceRequestRepo.findByProviderIdWithDetails(provider.id);
      res.json({ success: true, data: jobs } satisfies ApiResponse<typeof jobs>);
    } catch (err) {
      next(err);
    }
  };

  /**
   * PATCH /api/provider/jobs/:id/status
   */
  updateJobStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const provider = await this.providerRepo.findByUserId(req.user!.sub);
      if (!provider) throw new NotFoundError("Provider profile");

      const { status, providerNotes } = req.body as { status: ServiceRequestStatus; providerNotes?: string };
      await this.updateJobStatusUseCase.execute(provider.id, req.params.id as string, status, providerNotes ?? null);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  };
}
