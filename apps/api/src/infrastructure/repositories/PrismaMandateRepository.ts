import { prisma } from "../database/prisma.client";
import { MandateEntity, type MandateStatus } from "../../domain/entities/Mandate";

type DbClient = typeof prisma;

export interface CreateMandateData {
  serviceRequestId: string;
  createdByAdminId: string;
  title: string;
  scope: string;
  deliverables: string;
  timeline: string;
  price: number;
  currency?: string;
  adminNotes?: string;
}

export class PrismaMandateRepository {
  constructor(private readonly db: DbClient = prisma) {}

  async findByServiceRequestId(serviceRequestId: string): Promise<MandateEntity | null> {
    const row = await this.db.mandate.findUnique({ where: { serviceRequestId } });
    return row ? this.toEntity(row) : null;
  }

  async findById(id: string): Promise<MandateEntity | null> {
    const row = await this.db.mandate.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: CreateMandateData): Promise<MandateEntity> {
    const row = await this.db.mandate.create({
      data: {
        serviceRequestId: data.serviceRequestId,
        createdByAdminId: data.createdByAdminId,
        title: data.title,
        scope: data.scope,
        deliverables: data.deliverables,
        timeline: data.timeline,
        price: data.price,
        currency: data.currency ?? "NGN",
        adminNotes: data.adminNotes,
      },
    });
    return this.toEntity(row);
  }

  async update(id: string, data: Partial<Pick<CreateMandateData, "title" | "scope" | "deliverables" | "timeline" | "price" | "adminNotes">>): Promise<MandateEntity> {
    const row = await this.db.mandate.update({ where: { id }, data });
    return this.toEntity(row);
  }

  async send(id: string): Promise<MandateEntity> {
    const row = await this.db.mandate.update({
      where: { id },
      data: { status: "SENT", sentAt: new Date() },
    });
    return this.toEntity(row);
  }

  async sign(id: string, signedByUserId: string): Promise<MandateEntity> {
    const row = await this.db.mandate.update({
      where: { id },
      data: { status: "SIGNED", signedAt: new Date(), signedByUserId },
    });
    return this.toEntity(row);
  }

  async reject(id: string, rejectionReason: string): Promise<MandateEntity> {
    const row = await this.db.mandate.update({
      where: { id },
      data: { status: "REJECTED", rejectedAt: new Date(), rejectionReason },
    });
    return this.toEntity(row);
  }

  private toEntity(row: {
    id: string; serviceRequestId: string; createdByAdminId: string;
    title: string; scope: string; deliverables: string; timeline: string;
    price: number; currency: string; status: string; adminNotes: string | null;
    sentAt: Date | null; signedAt: Date | null; signedByUserId: string | null;
    rejectedAt: Date | null; rejectionReason: string | null;
    createdAt: Date; updatedAt: Date;
  }): MandateEntity {
    return new MandateEntity(
      row.id, row.serviceRequestId, row.createdByAdminId, row.title, row.scope,
      row.deliverables, row.timeline, row.price, row.currency,
      row.status as MandateStatus, row.adminNotes, row.sentAt, row.signedAt,
      row.signedByUserId, row.rejectedAt, row.rejectionReason, row.createdAt, row.updatedAt
    );
  }
}
