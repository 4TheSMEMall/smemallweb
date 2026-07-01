export type MandateStatus = "DRAFT" | "SENT" | "SIGNED" | "REJECTED";

export class MandateEntity {
  constructor(
    public readonly id: string,
    public readonly serviceRequestId: string,
    public readonly createdByAdminId: string,
    public readonly title: string,
    public readonly scope: string,
    public readonly deliverables: string,
    public readonly timeline: string,
    public readonly price: number,
    public readonly currency: string,
    public readonly status: MandateStatus,
    public readonly adminNotes: string | null,
    public readonly sentAt: Date | null,
    public readonly signedAt: Date | null,
    public readonly signedByUserId: string | null,
    public readonly rejectedAt: Date | null,
    public readonly rejectionReason: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get isEditable(): boolean {
    return this.status === "DRAFT" || this.status === "REJECTED";
  }
}
