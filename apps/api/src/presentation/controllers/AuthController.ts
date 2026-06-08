import type { Request, Response, NextFunction } from "express";
import type { RegisterUseCase } from "../../application/use-cases/auth/RegisterUseCase";
import type { LoginUseCase } from "../../application/use-cases/auth/LoginUseCase";
import type { GetMeUseCase } from "../../application/use-cases/auth/GetMeUseCase";
import type { ApiResponse, AuthResponse, User } from "@sme-mall/shared";

/**
 * Controller: translates HTTP ↔ use cases.
 * No business logic here — that lives in use cases.
 * Controllers only: extract input, call use case, format output.
 */
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.registerUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result } satisfies ApiResponse<AuthResponse>);
    } catch (err) {
      next(err);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.json({ success: true, data: result } satisfies ApiResponse<AuthResponse>);
    } catch (err) {
      next(err);
    }
  };

  me = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.getMeUseCase.execute(req.user!.sub);
      res.json({ success: true, data: result } satisfies ApiResponse<User>);
    } catch (err) {
      next(err);
    }
  };
}
