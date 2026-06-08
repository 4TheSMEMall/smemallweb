import jwt from "jsonwebtoken";
import type { AuthTokenPayload } from "@sme-mall/shared";
import type { ITokenService } from "../../application/interfaces/ITokenService";
import { UnauthorizedError } from "../../domain/errors/DomainError";

export class JwtTokenService implements ITokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string = "7d"
  ) {}

  sign(payload: Omit<AuthTokenPayload, "iat" | "exp">): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
  }

  verify(token: string): AuthTokenPayload {
    try {
      return jwt.verify(token, this.secret) as AuthTokenPayload;
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }
}
