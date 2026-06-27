import type { IBhcGapRepository } from "../../../domain/repositories/IBhcGapRepository";
import type { BhcGapEntity } from "../../../domain/entities/BhcGap";

export class GetMyGapsUseCase {
  constructor(private readonly bhcGapRepo: IBhcGapRepository) {}

  async execute(userId: string): Promise<BhcGapEntity[]> {
    return this.bhcGapRepo.findByUserId(userId);
  }
}
