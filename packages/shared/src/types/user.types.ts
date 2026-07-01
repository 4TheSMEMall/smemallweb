export type UserRole = "BUSINESS_OWNER" | "ADMIN" | "PARTNER" | "CONSULTANT" | "PROVIDER";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  isSuperAdmin?: boolean;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokenPayload {
  sub: string;           // user id
  email: string;
  role: UserRole;
  isSuperAdmin?: boolean; // only true for ADMIN users with elevated rights
  iat?: number;
  exp?: number;
}
