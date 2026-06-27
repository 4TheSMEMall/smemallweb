import type { GapPriority } from "./BhcResult";

export type GapStatus = "OPEN" | "REQUESTED" | "IN_PROGRESS" | "CLOSED";

export class BhcGapEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly bhcResultId: string,
    public readonly section: string,
    public readonly gapTitle: string,
    public readonly description: string,
    public readonly priority: GapPriority,
    public readonly needsProvider: boolean,
    public readonly serviceTag: string | null,
    public readonly status: GapStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
