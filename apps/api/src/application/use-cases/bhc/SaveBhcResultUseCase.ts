import type { IBhcResultRepository } from "../../../domain/repositories/IBhcResultRepository";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository";
import type { BhcResultEntity, SectionScore } from "../../../domain/entities/BhcResult";
import { NotFoundError } from "../../../domain/errors/DomainError";

/**
 * Called by the webhook endpoint when BHC fires after a completed assessment.
 * Looks up the user by email (the common identifier between both systems),
 * then saves the result. Idempotent — duplicate assessmentIds are ignored.
 */
export interface SaveBhcResultInput {
  event: string;
  email: string;
  assessmentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: string;
  sectionScores: SectionScore[];
  completedAt: string;
}

export class SaveBhcResultUseCase {
  constructor(
    private readonly bhcResultRepo: IBhcResultRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(input: SaveBhcResultInput): Promise<BhcResultEntity> {
    // Look up SME Mall user by email — the bridge between both systems
    const user = await this.userRepo.findByEmail(input.email.toLowerCase());
    if (!user) {
      throw new NotFoundError(
        `No SME Mall account found for email ${input.email}. ` +
        `User must sign up on The SME Mall before BHC results can be saved.`
      );
    }

    // Idempotency — if this assessmentId already exists, return it
    const existing = await this.bhcResultRepo.findByAssessmentId(input.assessmentId);
    if (existing) return existing;

    return this.bhcResultRepo.create({
      userId:       user.id,
      assessmentId: input.assessmentId,
      score:        input.score,
      maxScore:     input.maxScore,
      percentage:   input.percentage,
      status:       input.status,
      sectionScores: input.sectionScores,
      completedAt:  new Date(input.completedAt),
    });
  }
}
