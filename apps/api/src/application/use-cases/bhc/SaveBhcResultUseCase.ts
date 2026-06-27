import type { IBhcResultRepository } from "../../../domain/repositories/IBhcResultRepository";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository";
import type { IBhcGapRepository } from "../../../domain/repositories/IBhcGapRepository";
import type { BhcResultEntity, SectionScore, Gap } from "../../../domain/entities/BhcResult";
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
  gaps: Gap[];
  completedAt: string;
}

export class SaveBhcResultUseCase {
  constructor(
    private readonly bhcResultRepo: IBhcResultRepository,
    private readonly userRepo: IUserRepository,
    private readonly bhcGapRepo: IBhcGapRepository
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

    const result = await this.bhcResultRepo.create({
      userId:       user.id,
      assessmentId: input.assessmentId,
      score:        input.score,
      maxScore:     input.maxScore,
      percentage:   input.percentage,
      status:       input.status,
      sectionScores: input.sectionScores,
      gaps:         input.gaps ?? [],
      completedAt:  new Date(input.completedAt),
    });

    await this.syncGaps(user.id, result.id, input.gaps ?? []);

    return result;
  }

  /**
   * Reconciles trackable BhcGap rows against the latest assessment's gap snapshot.
   * - A gap (matched by section + title) that's still OPEN and reappears is left alone (no duplicate row).
   * - A gap not present in the new snapshot is auto-closed (assumed self-fixed).
   * - Gaps already REQUESTED/IN_PROGRESS are never touched here — they're mid service-request
   *   and only move forward through the marketplace flow, not a retest.
   */
  private async syncGaps(userId: string, bhcResultId: string, gaps: Gap[]): Promise<void> {
    const openGaps = await this.bhcGapRepo.findOpenByUserId(userId);
    const openKey = (g: { section: string; gapTitle: string }) => `${g.section}::${g.gapTitle}`;
    const openByKey = new Map(openGaps.map((g) => [openKey(g), g]));

    const incomingKeys = new Set(gaps.map((g) => `${g.section}::${g.gap_title}`));

    const toCreate = gaps.filter((g) => !openByKey.has(`${g.section}::${g.gap_title}`));
    const toClose  = openGaps.filter((g) => !incomingKeys.has(openKey(g))).map((g) => g.id);

    await this.bhcGapRepo.createMany(
      toCreate.map((g) => ({
        userId,
        bhcResultId,
        section:       g.section,
        gapTitle:      g.gap_title,
        description:   g.description,
        priority:      g.priority,
        needsProvider: g.needs_provider,
        serviceTag:    g.service_tag,
      }))
    );

    await this.bhcGapRepo.closeMany(toClose);
  }
}
