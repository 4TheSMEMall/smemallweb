import type { AuthTokenPayload } from "@sme-mall/shared";

export interface ITokenService {
  sign(payload: Omit<AuthTokenPayload, "iat" | "exp">): string;
  verify(token: string): AuthTokenPayload;
}
