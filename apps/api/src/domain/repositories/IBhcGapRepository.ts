import type { BhcGapEntity, GapStatus } from "../entities/BhcGap";
import type { GapPriority } from "../entities/BhcResult";

export interface CreateBhcGapData {
  userId: string;
  bhcResultId: string;
  section: string;
  gapTitle: string;
  description: string;
  priority: GapPriority;
  needsProvider: boolean;
  serviceTag: string | null;
}

export interface IBhcGapRepository {
  findByUserId(userId: string): Promise<BhcGapEntity[]>;
  findOpenByUserId(userId: string): Promise<BhcGapEntity[]>;
  createMany(data: CreateBhcGapData[]): Promise<void>;
  updateStatus(id: string, status: GapStatus): Promise<void>;
  closeMany(ids: string[]): Promise<void>;
}
