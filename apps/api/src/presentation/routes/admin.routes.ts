import { Router } from "express";
import type { AdminController } from "../controllers/AdminController";
import type { MandateController } from "../controllers/MandateController";
import type { ITokenService } from "../../application/interfaces/ITokenService";
import { createAuthMiddleware, requireRoles, requireSuperAdmin } from "../middleware/authenticate";

export function createAdminRouter(
  controller: AdminController,
  mandateController: MandateController,
  tokenService: ITokenService,
): Router {
  const router = Router();
  const authenticate = createAuthMiddleware(tokenService);
  const adminOnly    = requireRoles("ADMIN");

  router.use(authenticate, adminOnly);

  router.get("/stats",                          controller.getStats);
  router.get("/wibg",                           controller.getApplications);
  router.get("/wibg/scoreboard",                controller.getScoreboard);
  router.get("/wibg/:id",                       controller.getApplication);
  router.patch("/wibg/:id/status",              controller.updateApplicationStatus);
  router.post("/wibg/:id/video-reminder",       controller.sendVideoReminder);
  router.patch("/wibg/:id/video-tag",           controller.toggleVideoTag);
  router.get("/wibg/:id/scores",                controller.getApplicationScores);
  router.post("/wibg/:id/score",                controller.submitScore);
  router.get("/users",                          controller.getUsers);
  router.patch("/users/:id/status",             controller.updateUserStatus);

  router.get("/providers",                      controller.getProviders);
  router.post("/providers",                     controller.createProvider);
  router.get("/service-requests",                      controller.getPendingServiceRequests);
  router.get("/service-requests/assigned",             controller.getAssignedServiceRequests);
  router.get("/service-requests/mandate-sent",         controller.getMandateSentRequests);
  router.post("/service-requests/:id/assign",          controller.assignServiceRequest);
  router.post("/service-requests/:id/cancel",          controller.cancelServiceRequest);
  router.get("/service-requests/:id/mandate",          mandateController.getMandate);
  router.post("/service-requests/:id/mandate",         mandateController.saveMandate);
  router.post("/service-requests/:id/mandate/send",    mandateController.sendMandate);

  // ── Super Admin only ────────────────────────────────────────────────────
  const superAdminOnly = requireSuperAdmin();
  router.get("/team",                    superAdminOnly, controller.listAdmins);
  router.post("/team",                   superAdminOnly, controller.createAdmin);
  router.patch("/team/:id/super",        superAdminOnly, controller.toggleSuperAdmin);
  router.get("/activity-log",            superAdminOnly, controller.getActivityLog);
  router.get("/activity-log/stats",      superAdminOnly, controller.getActivityStats);

  return router;
}
