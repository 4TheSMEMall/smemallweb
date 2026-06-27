import { prisma } from "../database/prisma.client";
import type { IProviderRepository, CreateProviderData } from "../../domain/repositories/IProviderRepository";
import { ProviderEntity } from "../../domain/entities/Provider";

type DbClient = typeof prisma;

export class PrismaProviderRepository implements IProviderRepository {
  constructor(private readonly db: DbClient) {}

  async findAll(): Promise<ProviderEntity[]> {
    const rows = await this.db.provider.findMany({ orderBy: { businessName: "asc" } });
    return rows.map((r) => this.toEntity(r));
  }

  async findById(id: string): Promise<ProviderEntity | null> {
    const row = await this.db.provider.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findByUserId(userId: string): Promise<ProviderEntity | null> {
    const row = await this.db.provider.findUnique({ where: { userId } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: CreateProviderData): Promise<ProviderEntity> {
    const row = await this.db.provider.create({
      data: {
        userId:       data.userId,
        businessName: data.businessName,
        serviceTags:  data.serviceTags,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
      },
    });
    return this.toEntity(row);
  }

  async recordRating(providerId: string, newStarRating: number): Promise<void> {
    const provider = await this.db.provider.findUnique({ where: { id: providerId } });
    if (!provider) return;
    const newCount = provider.reviewCount + 1;
    const newAvg = (provider.avgRating * provider.reviewCount + newStarRating) / newCount;
    await this.db.provider.update({
      where: { id: providerId },
      data: { avgRating: newAvg, reviewCount: newCount },
    });
  }

  private toEntity(row: {
    id: string;
    userId: string;
    businessName: string;
    serviceTags: string[];
    contactEmail: string;
    contactPhone: string;
    active: boolean;
    avgRating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
  }): ProviderEntity {
    return new ProviderEntity(
      row.id,
      row.userId,
      row.businessName,
      row.serviceTags,
      row.contactEmail,
      row.contactPhone,
      row.active,
      row.avgRating,
      row.reviewCount,
      row.createdAt,
      row.updatedAt
    );
  }
}
