import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { validate } from "../middleware/validate";
import type { WibgController } from "../controllers/WibgController";
import type { RequestHandler } from "express";

const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  keyGenerator: (req) => req.ip ?? "unknown",
  message: { success: false, message: "Too many submission attempts from this IP. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const applySchema = z.object({
  founderName:    z.string().min(2, "Founder name is required"),
  founderEmail:   z.string().email("Valid email required"),
  founderPhone:   z.string().min(7, "Phone number is required"),
  businessName:   z.string().min(2, "Business name is required"),
  cacStatus:      z.string().min(1, "CAC status is required"),
  cacNumber:      z.string().optional(),
  problem:        z.string().min(1, "Problem description is required"),
  solution:       z.string().min(1, "Solution description is required"),
  market:         z.string().min(1, "Market description is required"),
  traction:       z.string().min(1, "Traction description is required"),
  revenue3m:      z.coerce.number().min(0),
  proj12m:        z.coerce.number().min(0),
  bhcRef:         z.string().min(1, "BHC reference is required"),
  bizStage:       z.string().min(1, "Business stage is required"),
  pitchVideoLink: z.string().optional().refine(
    (v) => !v || v.startsWith("http://") || v.startsWith("https://"),
    "Pitch video link must be a valid URL (http or https)",
  ),
});

const attendSchema = z.object({
  name:  z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Phone number is required"),
  role:  z.enum(["entrepreneur", "investor", "student", "enthusiast", "press"]),
  notes: z.string().optional(),
});

export function createWibgRouter(
  controller: WibgController,
  authenticate: RequestHandler,
): Router {
  const router = Router();

  router.get("/my-status", authenticate, controller.getMyStatus);
  router.post("/apply",    applyLimiter, validate(applySchema), controller.submitApplication);
  router.post("/attend",   validate(attendSchema), controller.registerAttendee);

  return router;
}
