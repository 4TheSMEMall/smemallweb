import type { Request, Response, NextFunction } from "express";
import type { RequestServiceUseCase } from "../../application/use-cases/services/RequestServiceUseCase";
import type { RateServiceUseCase } from "../../application/use-cases/services/RateServiceUseCase";
import type { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import type { ApiResponse } from "@sme-mall/shared";

export class ServiceController {
  constructor(
    private readonly requestServiceUseCase: RequestServiceUseCase,
    private readonly rateServiceUseCase: RateServiceUseCase,
    private readonly serviceRequestRepo: IServiceRequestRepository
  ) {}

  /**
   * POST /api/bhc/gaps/:gapId/request
   */
  requestService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const request = await this.requestServiceUseCase.execute(req.user!.sub, req.params.gapId as string);
      res.status(201).json({ success: true, data: request } satisfies ApiResponse<typeof request>);
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/bhc/service-requests — the SME's Execution Tracker
   */
  getMyServiceRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requests = await this.serviceRequestRepo.findByUserIdWithDetails(req.user!.sub);
      res.json({ success: true, data: requests } satisfies ApiResponse<typeof requests>);
    } catch (err) {
      next(err);
    }
  };

  /**
   * POST /api/bhc/service-requests/:id/rate
   */
  rate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { starRating, reviewText } = req.body as { starRating: number; reviewText?: string };
      await this.rateServiceUseCase.execute(req.user!.sub, req.params.id as string, starRating, reviewText ?? null);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  };
}
