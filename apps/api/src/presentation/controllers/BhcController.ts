import type { Request, Response, NextFunction } from "express";
import type { GetBhcHistoryUseCase } from "../../application/use-cases/bhc/GetBhcHistoryUseCase";
import type { GenerateBhcLaunchTokenUseCase } from "../../application/use-cases/bhc/GenerateBhcLaunchTokenUseCase";
import type { ApiResponse } from "@sme-mall/shared";

export class BhcController {
  constructor(
    private readonly getHistoryUseCase: GetBhcHistoryUseCase,
    private readonly generateLaunchTokenUseCase: GenerateBhcLaunchTokenUseCase,
    private readonly bhcApiUrl: string
  ) {}

  /**
   * GET /api/bhc/launch-token
   * Returns a short-lived signed JWT the BHC app uses to identify the user.
   * BHC reads it from the URL → pre-fills email → user skips the email field.
   */
  getLaunchToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.generateLaunchTokenUseCase.execute(
        req.user!.sub,
        req.user!.email
      );
      res.json({ success: true, data: { token } } satisfies ApiResponse<{ token: string }>);
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/bhc/history
   */
  getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getHistoryUseCase.execute(req.user!.sub);
      res.json({ success: true, data: result } satisfies ApiResponse<typeof result>);
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/bhc/results/:assessmentId/report
   * Proxies the PDF report from BHC's API on demand — nothing stored here.
   */
  downloadReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { assessmentId } = req.params;

      // Verify this assessment belongs to the requesting user before proxying
      const owned = await this.getHistoryUseCase.execute(req.user!.sub);
      const belongs = owned.history.some((r) => r.assessmentId === assessmentId);
      if (!belongs) {
        res.status(403).json({ success: false, message: "Forbidden" });
        return;
      }

      const bhcUrl = `${this.bhcApiUrl}/assessments/${assessmentId}/report`;

      const upstream = await fetch(bhcUrl, {
        headers: { Accept: "application/pdf" },
        signal: AbortSignal.timeout(15000),
      });

      if (!upstream.ok) {
        res.status(upstream.status).json({ success: false, message: "Report not available from BHC" });
        return;
      }

      res.setHeader("Content-Type",        "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="bhc-report-${assessmentId}.pdf"`);
      res.send(Buffer.from(await upstream.arrayBuffer()));
    } catch (err) {
      next(err);
    }
  };
}
