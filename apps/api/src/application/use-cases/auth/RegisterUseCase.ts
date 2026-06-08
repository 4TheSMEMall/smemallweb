import type { RegisterRequest, AuthResponse } from "@sme-mall/shared";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository";
import type { IPasswordService } from "../../interfaces/IPasswordService";
import type { ITokenService } from "../../interfaces/ITokenService";
import { ConflictError } from "../../../domain/errors/DomainError";

/**
 * Use Case: Register a new user.
 *
 * Receives: raw request data
 * Returns: a JWT token + public user profile
 * Knows about: domain entities, repository interface, service interfaces
 * Does NOT know about: HTTP, Prisma, bcrypt — those are injected via interfaces
 */
export class RegisterUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(request: RegisterRequest): Promise<AuthResponse> {
    const existing = await this.userRepo.findByEmail(request.email);
    if (existing) {
      throw new ConflictError("An account with this email already exists");
    }

    const passwordHash = await this.passwordService.hash(request.password);

    const user = await this.userRepo.create({
      email: request.email.toLowerCase().trim(),
      passwordHash,
      firstName: request.firstName.trim(),
      lastName: request.lastName.trim(),
      role: request.role,
      phone: request.phone,
    });

    const token = this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
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
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
