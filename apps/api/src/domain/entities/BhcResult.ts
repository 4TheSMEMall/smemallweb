export interface SectionScore {
  name: string;
  score: number;
  max_score: number;
  percentage: number;
}

export type GapPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Gap {
  gap_title: string;
  section: string;
  description: string;
  priority: GapPriority;
  needs_provider: boolean;
  service_tag: string | null;
}

export class BhcResultEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly assessmentId: string, // BHC's UUID — used to proxy PDF requests
    public readonly score: number,
    public readonly maxScore: number,
    public readonly percentage: number,
    public readonly status: string,
    public readonly sectionScores: SectionScore[],
    public readonly gaps: Gap[],
    public readonly completedAt: Date,
    public readonly createdAt: Date
  ) {}

  get statusColor(): "critical" | "fair" | "good" | "excellent" {
    const s = this.status.toLowerCase();
    if (s === "critical") return "critical";
    if (s === "fair")     return "fair";
    if (s === "good")     return "good";
    return "excellent";
  }

  get isPassingScore(): boolean {
    return this.percentage >= 50;
  }
}
