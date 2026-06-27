import { Router } from "express";
import type { AdminController } from "../controllers/AdminController";
import type { ITokenService } from "../../application/interfaces/ITokenService";
import { createAuthMiddleware, requireRoles } from "../middleware/authenticate";

export function createAdminRouter(
  controller: AdminController,
  tokenService: ITokenService,
): Router {
  const router = Router();
  const authenticate = createAuthMiddleware(tokenService);
  const adminOnly    = requireRoles("ADMIN");

  router.use(authenticate, adminOnly);

  router.get("/stats",                          controller.getStats);
  router.get("/wibg",                           controller.getApplications);
  router.get("/wibg/:id",                       controller.getApplication);
  router.patch("/wibg/:id/status",              controller.updateApplicationStatus);
  router.post("/wibg/:id/video-reminder",       controller.sendVideoReminder);
  router.patch("/wibg/:id/video-tag",           controller.toggleVideoTag);
  router.get("/users",                          controller.getUsers);
  router.patch("/users/:id/status",             controller.updateUserStatus);

  router.get("/providers",                      controller.getProviders);
  router.post("/providers",                     controller.createProvider);
  router.get("/service-requests",               controller.getPendingServiceRequests);
  router.post("/service-requests/:id/assign",   controller.assignServiceRequest);
  router.post("/service-requests/:id/cancel",   controller.cancelServiceRequest);

  return router;
}
