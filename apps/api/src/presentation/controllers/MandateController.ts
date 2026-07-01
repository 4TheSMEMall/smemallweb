import type { Request, Response, NextFunction } from "express";
import type { CreateOrUpdateMandateUseCase } from "../../application/use-cases/mandate/CreateOrUpdateMandateUseCase";
import type { SendMandateUseCase } from "../../application/use-cases/mandate/SendMandateUseCase";
import type { RespondToMandateUseCase } from "../../application/use-cases/mandate/RespondToMandateUseCase";
import type { PrismaMandateRepository } from "../../infrastructure/repositories/PrismaMandateRepository";
import type { ApiResponse } from "@sme-mall/shared";

export class MandateController {
  constructor(
    private readonly createOrUpdateUseCase: CreateOrUpdateMandateUseCase,
    private readonly sendUseCase: SendMandateUseCase,
    private readonly respondUseCase: RespondToMandateUseCase,
    private readonly mandateRepo: PrismaMandateRepository,
  ) {}

  // ── Admin routes ──────────────────────────────────────────────

  /** GET /api/admin/service-requests/:id/mandate */
  getMandate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mandate = await this.mandateRepo.findByServiceRequestId(req.params.id as string);
      res.json({ success: true, data: mandate } satisfies ApiResponse<typeof mandate>);
    } catch (err) { next(err); }
  };

  /** POST /api/admin/service-requests/:id/mandate — create or update */
  saveMandate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, scope, deliverables, timeline, price, adminNotes } = req.body as {
        title: string; scope: string; deliverables: string; timeline: string; price: number; adminNotes?: string;
      };
      if (!title || !scope || !deliverables || !timeline || !price) {
        res.status(400).json({ success: false, message: "title, scope, deliverables, timeline and price are all required" });
        return;
      }
      const mandate = await this.createOrUpdateUseCase.execute(
        req.user!.sub,
        req.params.id as string,
        { title, scope, deliverables, timeline, price: Number(price), adminNotes },
      );
      res.status(201).json({ success: true, data: mandate } satisfies ApiResponse<typeof mandate>);
    } catch (err) { next(err); }
  };

  /** POST /api/admin/service-requests/:id/mandate/send */
  sendMandate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mandate = await this.sendUseCase.execute(req.user!.sub, req.params.id as string);
      res.json({ success: true, data: mandate } satisfies ApiResponse<typeof mandate>);
    } catch (err) { next(err); }
  };

  // ── SME routes ────────────────────────────────────────────────

  /** GET /api/bhc/service-requests/:id/mandate */
  getMandateForSme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mandate = await this.mandateRepo.findByServiceRequestId(req.params.id as string);
      res.json({ success: true, data: mandate } satisfies ApiResponse<typeof mandate>);
    } catch (err) { next(err); }
  };

  /** POST /api/bhc/service-requests/:id/mandate/sign */
  signMandate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mandate = await this.respondUseCase.sign(req.user!.sub, req.params.id as string);
      res.json({ success: true, data: mandate } satisfies ApiResponse<typeof mandate>);
    } catch (err) { next(err); }
  };

  /** POST /api/bhc/service-requests/:id/mandate/reject */
  rejectMandate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { reason } = req.body as { reason: string };
      if (!reason?.trim()) {
        res.status(400).json({ success: false, message: "A rejection reason is required" }); return;
      }
      const mandate = await this.respondUseCase.reject(req.user!.sub, req.params.id as string, reason);
      res.json({ success: true, data: mandate } satisfies ApiResponse<typeof mandate>);
    } catch (err) { next(err); }
  };
}
