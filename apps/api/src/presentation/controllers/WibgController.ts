import type { Request, Response, NextFunction } from "express";
import type { SubmitApplicationUseCase } from "../../application/use-cases/wibg/SubmitApplicationUseCase";
import type { RegisterAttendeeUseCase } from "../../application/use-cases/wibg/RegisterAttendeeUseCase";
import type { PrismaWibgRepository } from "../../infrastructure/repositories/PrismaWibgRepository";
import type { ApiResponse } from "@sme-mall/shared";
import { sendApplicationReceivedEmail } from "../../infrastructure/services/BrevoEmailService";

export class WibgController {
  constructor(
    private readonly submitApplicationUseCase: SubmitApplicationUseCase,
    private readonly registerAttendeeUseCase: RegisterAttendeeUseCase,
    private readonly wibgRepo: PrismaWibgRepository,
  ) {}

  submitApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Block re-submission by account email (catches users who change founderEmail in the form)
      const accountEmail = req.user?.email;
      if (accountEmail) {
        const existing = await this.wibgRepo.findApplicationByEmail(accountEmail);
        if (existing) {
          res.status(409).json({ success: false, message: "You have already submitted a WIBG application. Only one application per account is allowed." });
          return;
        }
      }
      const application = await this.submitApplicationUseCase.execute(req.body);
      sendApplicationReceivedEmail(
        application.founderEmail,
        application.founderName,
        application.businessName,
        application.id,
      ).catch((err) => console.error("[Email] submission email failed:", err));
      res.status(201).json({
        success: true,
        data: { id: application.id, submittedAt: application.createdAt },
      } satisfies ApiResponse<{ id: string; submittedAt: Date }>);
    } catch (err) {
      next(err);
    }
  };

  getMyStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = req.user?.email;
      if (!email) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
      const application = await this.wibgRepo.findApplicationByEmail(email);
      res.json({ success: true, data: application });
    } catch (err) {
      next(err);
    }
  };

  registerAttendee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const attendee = await this.registerAttendeeUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: { id: attendee.id },
      } satisfies ApiResponse<{ id: string }>);
    } catch (err) {
      next(err);
    }
  };
}
