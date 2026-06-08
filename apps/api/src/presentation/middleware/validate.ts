import type { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { ValidationError } from "../../domain/errors/DomainError";

/**
 * Zod validation middleware factory.
 * Usage: router.post('/login', validate(loginSchema), controller.login)
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fields: Record<string, string[]> = {};
      result.error.errors.forEach((e) => {
        const key = e.path.join(".");
        fields[key] = [...(fields[key] ?? []), e.message];
      });
      return next(new ValidationError("Validation failed", fields));
    }
    req.body = result.data;
    next();
  };
}

// ── Auth schemas ──────────────────────────────────────────────
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  role: z.enum(["BUSINESS_OWNER", "ADMIN", "PARTNER", "CONSULTANT"]),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
