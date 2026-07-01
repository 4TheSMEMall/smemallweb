import { prisma } from "../database/prisma.client";
import type {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
  UserFilters,
} from "../../domain/repositories/IUserRepository";
import { UserEntity } from "../../domain/entities/User";
import type { UserRole, UserStatus } from "@sme-mall/shared";

type DbClient = typeof prisma;

/**
 * Concrete implementation of IUserRepository using Prisma.
 * The domain layer never imports this — it only knows the interface.
 * Swap this for a MongoDB version and nothing else changes.
 */
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly db: DbClient) {}

  async findById(id: string): Promise<UserEntity | null> {
    const row = await this.db.user.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const row = await this.db.user.findUnique({ where: { email } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const row = await this.db.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        phone: data.phone,
      },
    });
    return this.toEntity(row);
  }

  async update(id: string, data: Partial<UpdateUserData>): Promise<UserEntity> {
    const { status, ...rest } = data;
    const row = await this.db.user.update({
      where: { id },
      data: {
        ...rest,
        ...(status && { status: status as UserStatus }),
      },
    });
    return this.toEntity(row);
  }

  async findAll(filters?: UserFilters): Promise<UserEntity[]> {
    const rows = await this.db.user.findMany({
      where: this.buildWhereClause(filters),
      skip:
        filters?.page && filters?.pageSize
          ? (filters.page - 1) * filters.pageSize
          : undefined,
      take: filters?.pageSize,
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => this.toEntity(r as Parameters<typeof this.toEntity>[0]));
  }

  async count(filters?: UserFilters): Promise<number> {
    return this.db.user.count({ where: this.buildWhereClause(filters) });
  }

  async setSuperAdmin(id: string, isSuperAdmin: boolean): Promise<UserEntity> {
    const row = await this.db.user.update({
      where: { id },
      data: { isSuperAdmin },
    });
    return this.toEntity(row);
  }

  private buildWhereClause(filters?: UserFilters) {
    if (!filters) return {};
    return {
      ...(filters.role && { role: filters.role }),
      ...(filters.status && { status: filters.status as UserStatus }),
      ...(filters.search && {
        OR: [
          { email: { contains: filters.search, mode: "insensitive" as const } },
          {
            firstName: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
          {
            lastName: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
    };
  }

  private toEntity(row: {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: UserStatus;
    isSuperAdmin: boolean;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): UserEntity {
    return new UserEntity(
      row.id,
      row.email,
      row.passwordHash,
      row.firstName,
      row.lastName,
      row.role,
      row.status,
      row.isSuperAdmin,
      row.phone ?? undefined,
      row.createdAt,
      row.updatedAt
    );
  }
}
