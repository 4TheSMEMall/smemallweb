import { Router } from "express";
import type { ProviderController } from "../controllers/ProviderController";
import type { ITokenService } from "../../application/interfaces/ITokenService";
import { createAuthMiddleware, requireRoles } from "../middleware/authenticate";

export function createProviderRouter(
  controller: ProviderController,
  tokenService: ITokenService,
): Router {
  const router = Router();
  const authenticate = createAuthMiddleware(tokenService);
  const providerOnly = requireRoles("PROVIDER");

  router.use(authenticate, providerOnly);

  router.get("/me",                   controller.getMe);
  router.get("/jobs",                 controller.getMyJobs);
  router.patch("/jobs/:id/status",    controller.updateJobStatus);

  return router;
}
