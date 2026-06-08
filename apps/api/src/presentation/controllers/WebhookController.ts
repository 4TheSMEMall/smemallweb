import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import type { SaveBhcResultUseCase } from "../../application/use-cases/bhc/SaveBhcResultUseCase";
import { ValidationError } from "../../domain/errors/DomainError";

/**
 * Receives inbound webhooks from BHC.
 *
 * Security model:
 *   BHC signs the raw JSON body with HMAC-SHA256 using a shared secret.
 *   We recompute the same HMAC and compare. If they don't match, we return 401.
 *   This prevents anyone from faking a score by hitting our endpoint directly.
 *
 * Important: Express must parse this route with express.raw() NOT express.json()
 * so we get the exact bytes BHC signed (JSON.stringify output order matters for HMAC).
 */
export class WebhookController {
  constructor(
    private readonly saveBhcResult: SaveBhcResultUseCase,
    private readonly webhookSecret: string
  ) {}

  bhc = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // ── 1. Verify HMAC signature ──────────────────────────
      const signature = req.headers["x-webhook-signature"] as string | undefined;
      if (!signature) {
        return next(new ValidationError("Missing X-Webhook-Signature header"));
      }

      const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
      if (!rawBody) {
        return next(new ValidationError("Unable to read raw request body"));
      }

      const expected = `sha256=${crypto
        .createHmac("sha256", this.webhookSecret)
        .update(rawBody)
        .digest("hex")}`;

      // Timing-safe comparison prevents timing attacks
      const sigBuffer      = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expected);
      const valid =
        sigBuffer.length === expectedBuffer.length &&
        crypto.timingSafeEqual(sigBuffer, expectedBuffer);

      if (!valid) {
        res.status(401).json({ success: false, message: "Invalid webhook signature" });
        return;
      }

      // ── 2. Parse and handle the event ─────────────────────
      const payload = JSON.parse(rawBody.toString());

      if (payload.event === "bhc.assessment.completed") {
        await this.saveBhcResult.execute(payload);
      }
      // Unknown events are silently accepted (forward-compatible)

      // Always return 200 quickly — BHC doesn't retry on success
      res.status(200).json({ received: true });
    } catch (err) {
      next(err);
    }
  };
}
