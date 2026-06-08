import { Router, type RequestHandler } from "express";
import type { WebhookController } from "../controllers/WebhookController";

/**
 * Webhook routes use express.raw() middleware, NOT express.json().
 * We need the raw bytes to recompute the HMAC signature for verification.
 * The raw buffer is attached to req.rawBody for the controller to read.
 */
export function createWebhookRouter(controller: WebhookController): Router {
  const router = Router();

  const captureRawBody: RequestHandler = (req, _res, next) => {
    let data = Buffer.alloc(0);
    req.on("data", (chunk: Buffer) => {
      data = Buffer.concat([data, chunk]);
    });
    req.on("end", () => {
      (req as unknown as { rawBody: Buffer }).rawBody = data;
      next();
    });
  };

  router.post("/bhc", captureRawBody, controller.bhc);

  return router;
}
