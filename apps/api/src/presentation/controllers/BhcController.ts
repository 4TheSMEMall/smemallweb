import type { Request, Response, NextFunction } from "express";
import type { GetBhcHistoryUseCase } from "../../application/use-cases/bhc/GetBhcHistoryUseCase";
import type { ApiResponse } from "@sme-mall/shared";

export class BhcController {
  constructor(
    private readonly getHistoryUseCase: GetBhcHistoryUseCase,
    private readonly bhcApiUrl: string
  ) {}

  /**
   * GET /api/bhc/history
   * Returns the logged-in user's full BHC assessment history.
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
   * Proxies the PDF report from BHC's API and streams it to the browser.
   * We never store the PDF — we always fetch it fresh from BHC on demand.
   * The assessmentId stored in our DB is the key that unlocks the PDF.
   */
  downloadReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { assessmentId } = req.params;
      const bhcUrl = `${this.bhcApiUrl}/assessments/${assessmentId}/report`;

      const upstream = await fetch(bhcUrl, {
        headers: { Accept: "application/pdf" },
        signal: AbortSignal.timeout(15000),
      });

      if (!upstream.ok) {
        res.status(upstream.status).json({
          success: false,
          message: "Report not available from BHC",
        });
        return;
      }

      // Forward BHC's content headers and stream the PDF buffer
      res.setHeader("Content-Type",        "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="bhc-report-${assessmentId}.pdf"`);

      const buffer = await upstream.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (err) {
      next(err);
    }
  };
}
