import { prisma } from "../database/prisma.client";
import type { IBhcResultRepository, CreateBhcResultData } from "../../domain/repositories/IBhcResultRepository";
import { BhcResultEntity, type SectionScore, type Gap } from "../../domain/entities/BhcResult";

type DbClient = typeof prisma;

export class PrismaBhcResultRepository implements IBhcResultRepository {
  constructor(private readonly db: DbClient) {}

  async findByUserId(userId: string): Promise<BhcResultEntity[]> {
    const rows = await this.db.bhcResult.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async findByAssessmentId(assessmentId: string): Promise<BhcResultEntity | null> {
    const row = await this.db.bhcResult.findUnique({ where: { assessmentId } });
    return row ? this.toEntity(row) : null;
  }

  async findLatestByUserId(userId: string): Promise<BhcResultEntity | null> {
    const row = await this.db.bhcResult.findFirst({
      where: { userId },
      orderBy: { completedAt: "desc" },
    });
    return row ? this.toEntity(row) : null;
  }

  async create(data: CreateBhcResultData): Promise<BhcResultEntity> {
    const row = await this.db.bhcResult.create({
      data: {
        userId:        data.userId,
        assessmentId:  data.assessmentId,
        score:         data.score,
        maxScore:      data.maxScore,
        percentage:    data.percentage,
        status:        data.status,
        sectionScores: data.sectionScores as object[],
        gaps:          data.gaps as unknown as object[],
        completedAt:   data.completedAt,
      },
    });
    return this.toEntity(row);
  }

  private toEntity(row: {
    id: string;
    userId: string;
    assessmentId: string;
    score: number;
    maxScore: number;
    percentage: number;
    status: string;
    sectionScores: unknown;
    gaps: unknown;
    completedAt: Date;
    createdAt: Date;
  }): BhcResultEntity {
    return new BhcResultEntity(
      row.id,
      row.userId,
      row.assessmentId,
      row.score,
      row.maxScore,
      row.percentage,
      row.status,
      row.sectionScores as SectionScore[],
      (row.gaps as Gap[] | null) ?? [],
      row.completedAt,
      row.createdAt
    );
  }
}
