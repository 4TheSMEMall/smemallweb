import type { BhcResultEntity, SectionScore, Gap } from "../entities/BhcResult";

export interface CreateBhcResultData {
  userId: string;
  assessmentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: string;
  sectionScores: SectionScore[];
  gaps: Gap[];
  completedAt: Date;
}

export interface IBhcResultRepository {
  findByUserId(userId: string): Promise<BhcResultEntity[]>;
  findByAssessmentId(assessmentId: string): Promise<BhcResultEntity | null>;
  findLatestByUserId(userId: string): Promise<BhcResultEntity | null>;
  create(data: CreateBhcResultData): Promise<BhcResultEntity>;
}
