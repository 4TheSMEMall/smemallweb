import type { Request, Response, NextFunction } from "express";
import type { SubmitApplicationUseCase } from "../../application/use-cases/wibg/SubmitApplicationUseCase";
import type { RegisterAttendeeUseCase } from "../../application/use-cases/wibg/RegisterAttendeeUseCase";
import type { ApiResponse } from "@sme-mall/shared";
import { sendApplicationReceivedEmail } from "../../infrastructure/services/BrevoEmailService";

export class WibgController {
  constructor(
    private readonly submitApplicationUseCase: SubmitApplicationUseCase,
    private readonly registerAttendeeUseCase: RegisterAttendeeUseCase
  ) {}

  submitApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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
