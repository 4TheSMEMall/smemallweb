import { Router } from "express";
import type { RequestHandler } from "express";
import type { AuthController } from "../controllers/AuthController";
import { validate, registerSchema, loginSchema } from "../middleware/validate";

export function createAuthRouter(
  controller: AuthController,
  authenticate: RequestHandler
): Router {
  const router = Router();

  router.post("/register", validate(registerSchema), controller.register);
  router.post("/login", validate(loginSchema), controller.login);
  router.get("/me", authenticate, controller.me);

  return router;
}
