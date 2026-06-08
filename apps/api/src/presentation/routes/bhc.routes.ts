import { Router, type RequestHandler } from "express";
import type { BhcController } from "../controllers/BhcController";

export function createBhcRouter(
  controller: BhcController,
  authenticate: RequestHandler
): Router {
  const router = Router();

  // All BHC routes require a logged-in user
  router.use(authenticate);

  router.get("/history",                        controller.getHistory);
  router.get("/results/:assessmentId/report",   controller.downloadReport);

  return router;
}
