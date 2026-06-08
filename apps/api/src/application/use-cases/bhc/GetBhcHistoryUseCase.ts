import type { IBhcResultRepository } from "../../../domain/repositories/IBhcResultRepository";
import type { BhcResultEntity } from "../../../domain/entities/BhcResult";

export interface BhcHistoryOutput {
  latest: BhcResultEntity | null;
  history: BhcResultEntity[];
  totalAssessments: number;
}

export class GetBhcHistoryUseCase {
  constructor(private readonly bhcResultRepo: IBhcResultRepository) {}

  async execute(userId: string): Promise<BhcHistoryOutput> {
    const history = await this.bhcResultRepo.findByUserId(userId);
    const latest  = history[0] ?? null; // already ordered by completedAt desc

    return {
      latest,
      history,
      totalAssessments: history.length,
    };
  }
}
