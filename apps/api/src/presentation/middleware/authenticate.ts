import type { Request, Response, NextFunction } from "express";
import type { AuthTokenPayload, UserRole } from "@sme-mall/shared";
import type { ITokenService } from "../../application/interfaces/ITokenService";
import {
  UnauthorizedError,
  ForbiddenError,
} from "../../domain/errors/DomainError";

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function createAuthMiddleware(tokenService: ITokenService) {
  return function authenticate(
    req: Request,
    _res: Response,
    next: NextFunction
  ): void {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next(new UnauthorizedError("No token provided"));
    }

    const token = authHeader.slice(7);
    try {
      req.user = tokenService.verify(token);
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function requireRoles(...roles: UserRole[]) {
  return function (req: Request, _res: Response, next: NextFunction): void {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError("You don't have permission to do that"));
    }
    next();
  };
}

/** Guards routes that only a Super Admin (ADMIN + isSuperAdmin=true) can access. */
export function requireSuperAdmin() {
  return function (req: Request, _res: Response, next: NextFunction): void {
    if (!req.user) return next(new UnauthorizedError());
    if (req.user.role !== "ADMIN" || !req.user.isSuperAdmin) {
      return next(new ForbiddenError("Super Admin access required"));
    }
    next();
  };
}
