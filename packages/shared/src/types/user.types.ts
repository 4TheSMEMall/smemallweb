export type UserRole = "BUSINESS_OWNER" | "ADMIN" | "PARTNER" | "CONSULTANT";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokenPayload {
  sub: string;       // user id
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
