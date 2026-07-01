import type { UserRole, UserStatus } from "@sme-mall/shared";

/**
 * Domain Entity — the canonical shape of a User in our system.
 * This class contains business rules, not database concerns.
 * No Prisma, no Express — pure TypeScript.
 */
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: UserRole,
    public readonly status: UserStatus,
    public readonly isSuperAdmin: boolean,
    public readonly phone: string | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive(): boolean {
    return this.status === "ACTIVE";
  }

  isSuspended(): boolean {
    return this.status === "SUSPENDED";
  }

  toPublicProfile(): Omit<UserEntity, "passwordHash"> {
    const { passwordHash: _, ...profile } = this;
    return profile as Omit<UserEntity, "passwordHash">;
  }
}
