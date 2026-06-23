import type { Request, Response, NextFunction } from "express";
import { DomainError, ValidationError } from "../../domain/errors/DomainError";
import type { ApiResponse } from "@sme-mall/shared";

/**
 * Centralised error handler.
 * Express calls this when next(error) is invoked anywhere.
 * All DomainErrors map to their own status code.
 * Unknown errors become 500 — never leak internals to the client.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof DomainError) {
    const body: Record<string, unknown> = {
      success: false,
      message: err.message,
    };
    if (err instanceof ValidationError) body.fields = err.fields;
    res.status(err.statusCode).json(body);
    return;
  }

  console.error("[Unhandled Error]", err);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  } satisfies ApiResponse);
}
