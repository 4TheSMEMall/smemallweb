import { prisma } from "../database/prisma.client";
import type { IBhcGapRepository, CreateBhcGapData } from "../../domain/repositories/IBhcGapRepository";
import { BhcGapEntity, type GapStatus } from "../../domain/entities/BhcGap";
import type { GapPriority } from "../../domain/entities/BhcResult";

type DbClient = typeof prisma;

export class PrismaBhcGapRepository implements IBhcGapRepository {
  constructor(private readonly db: DbClient) {}

  async findByUserId(userId: string): Promise<BhcGapEntity[]> {
    const rows = await this.db.bhcGap.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async findOpenByUserId(userId: string): Promise<BhcGapEntity[]> {
    const rows = await this.db.bhcGap.findMany({
      where: { userId, status: "OPEN" },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async createMany(data: CreateBhcGapData[]): Promise<void> {
    if (data.length === 0) return;
    await this.db.bhcGap.createMany({
      data: data.map((d) => ({
        userId:        d.userId,
        bhcResultId:   d.bhcResultId,
        section:       d.section,
        gapTitle:      d.gapTitle,
        description:   d.description,
        priority:      d.priority,
        needsProvider: d.needsProvider,
        serviceTag:    d.serviceTag,
      })),
    });
  }

  async updateStatus(id: string, status: GapStatus): Promise<void> {
    await this.db.bhcGap.update({ where: { id }, data: { status } });
  }

  async closeMany(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await this.db.bhcGap.updateMany({
      where: { id: { in: ids } },
      data: { status: "CLOSED" },
    });
  }

  private toEntity(row: {
    id: string;
    userId: string;
    bhcResultId: string;
    section: string;
    gapTitle: string;
    description: string;
    priority: string;
    needsProvider: boolean;
    serviceTag: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): BhcGapEntity {
    return new BhcGapEntity(
      row.id,
      row.userId,
      row.bhcResultId,
      row.section,
      row.gapTitle,
      row.description,
      row.priority as GapPriority,
      row.needsProvider,
      row.serviceTag,
      row.status as GapStatus,
      row.createdAt,
      row.updatedAt
    );
  }
}
