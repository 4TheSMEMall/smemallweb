import type { LoginRequest, AuthResponse } from "@sme-mall/shared";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository";
import type { IPasswordService } from "../../interfaces/IPasswordService";
import type { ITokenService } from "../../interfaces/ITokenService";
import {
  UnauthorizedError,
  ForbiddenError,
} from "../../../domain/errors/DomainError";

export class LoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(request: LoginRequest): Promise<AuthResponse> {
    const user = await this.userRepo.findByEmail(request.email.toLowerCase());
    if (!user) {
      // Generic message — don't reveal whether email exists (security best practice)
      throw new UnauthorizedError("Invalid email or password");
    }

    if (user.isSuspended()) {
      throw new ForbiddenError(
        "Your account has been suspended. Contact support."
      );
    }

    const passwordValid = await this.passwordService.compare(
      request.password,
      user.passwordHash
    );
    if (!passwordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin || undefined, // omit from token when false to keep payload small
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        isSuperAdmin: user.isSuperAdmin || undefined,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
