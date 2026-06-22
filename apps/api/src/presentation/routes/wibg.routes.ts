import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import type { WibgController } from "../controllers/WibgController";

const applySchema = z.object({
  founderName:    z.string().min(2, "Founder name is required"),
  founderEmail:   z.string().email("Valid email required"),
  founderPhone:   z.string().min(7, "Phone number is required"),
  businessName:   z.string().min(2, "Business name is required"),
  cacStatus:      z.string().min(1, "CAC status is required"),
  cacNumber:      z.string().optional(),
  problem:        z.string().min(20, "Please describe the problem (min 20 chars)"),
  solution:       z.string().min(20, "Please describe your solution (min 20 chars)"),
  market:         z.string().min(20, "Please describe the market (min 20 chars)"),
  traction:       z.string().min(10, "Please describe your traction"),
  revenue3m:      z.coerce.number().min(0),
  proj12m:        z.coerce.number().min(0),
  bhcRef:         z.string().min(1, "BHC reference is required"),
  bizStage:       z.string().min(1, "Business stage is required"),
  pitchVideoLink: z.string().optional(),
});

const attendSchema = z.object({
  name:  z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Phone number is required"),
  role:  z.enum(["entrepreneur", "investor", "student", "enthusiast", "press"]),
  notes: z.string().optional(),
});

export function createWibgRouter(controller: WibgController): Router {
  const router = Router();

  router.post("/apply",  validate(applySchema),  controller.submitApplication);
  router.post("/attend", validate(attendSchema),  controller.registerAttendee);

  return router;
}
