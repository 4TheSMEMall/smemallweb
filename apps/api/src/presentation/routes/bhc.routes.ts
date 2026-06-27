import { Router, type RequestHandler } from "express";
import type { BhcController } from "../controllers/BhcController";
import type { ServiceController } from "../controllers/ServiceController";

export function createBhcRouter(
  controller: BhcController,
  serviceController: ServiceController,
  authenticate: RequestHandler
): Router {
  const router = Router();

  // All BHC routes require a logged-in user
  router.use(authenticate);

  router.get("/launch-token",                    controller.getLaunchToken);
  router.get("/history",                        controller.getHistory);
  router.get("/gaps",                           controller.getGaps);
  router.get("/results/:assessmentId/report",   controller.downloadReport);

  router.post("/gaps/:gapId/request",           serviceController.requestService);
  router.get("/service-requests",               serviceController.getMyServiceRequests);
  router.post("/service-requests/:id/rate",     serviceController.rate);

  return router;
}
