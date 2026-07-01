import type { UserRole } from "@sme-mall/shared";
import type { UserEntity } from "../entities/User";

/**
 * Repository Interface — defines WHAT can be done with users.
 * The domain layer owns this interface; infrastructure implements it.
 * This is the Dependency Inversion Principle in action:
 * high-level policy (use cases) does NOT depend on low-level details (Prisma).
 */
export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<UserEntity>;
  update(id: string, data: Partial<UpdateUserData>): Promise<UserEntity>;
  findAll(filters?: UserFilters): Promise<UserEntity[]>;
  count(filters?: UserFilters): Promise<number>;
  setSuperAdmin(id: string, isSuperAdmin: boolean): Promise<UserEntity>;
}

export interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

export interface UpdateUserData {
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
}

export interface UserFilters {
  role?: UserRole;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}
