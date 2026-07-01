import { prisma } from "../database/prisma.client";
import type { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestEntity, type ServiceRequestStatus, type ServiceRequestWithDetails } from "../../domain/entities/ServiceRequest";

type DbClient = typeof prisma;

const detailsInclude = {
  gap: true,
  provider: true,
  user: { select: { firstName: true, lastName: true, email: true } },
} as const;

export class PrismaServiceRequestRepository implements IServiceRequestRepository {
  constructor(private readonly db: DbClient) {}

  async findById(id: string): Promise<ServiceRequestEntity | null> {
    const row = await this.db.serviceRequest.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findPendingWithDetails(): Promise<ServiceRequestWithDetails[]> {
    const rows = await this.db.serviceRequest.findMany({
      where: { status: "PENDING_REVIEW" },
      include: detailsInclude,
      orderBy: { requestedAt: "asc" },
    });
    return rows.map((r) => this.toDetails(r));
  }

  async findByStatusWithDetails(status: ServiceRequestStatus): Promise<ServiceRequestWithDetails[]> {
    const rows = await this.db.serviceRequest.findMany({
      where: { status },
      include: detailsInclude,
      orderBy: { requestedAt: "asc" },
    });
    return rows.map((r) => this.toDetails(r));
  }

  async findByUserIdWithDetails(userId: string): Promise<ServiceRequestWithDetails[]> {
    const rows = await this.db.serviceRequest.findMany({
      where: { userId },
      include: detailsInclude,
      orderBy: { requestedAt: "desc" },
    });
    return rows.map((r) => this.toDetails(r));
  }

  async findByProviderIdWithDetails(providerId: string): Promise<ServiceRequestWithDetails[]> {
    const rows = await this.db.serviceRequest.findMany({
      where: { providerId },
      include: detailsInclude,
      orderBy: { requestedAt: "desc" },
    });
    return rows.map((r) => this.toDetails(r));
  }

  async create(gapId: string, userId: string): Promise<ServiceRequestEntity> {
    const row = await this.db.serviceRequest.create({
      data: { gapId, userId },
    });
    return this.toEntity(row);
  }

  async assignProvider(id: string, providerId: string, priceAgreed: string | null, adminNotes: string | null): Promise<void> {
    await this.db.serviceRequest.update({
      where: { id },
      data: { providerId, priceAgreed, adminNotes, status: "ASSIGNED", assignedAt: new Date() },
    });
  }

  async updateStatus(id: string, status: ServiceRequestStatus, providerNotes?: string | null): Promise<void> {
    await this.db.serviceRequest.update({
      where: { id },
      data: {
        status,
        providerNotes: providerNotes ?? undefined,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });
  }

  async cancel(id: string, adminNotes: string | null): Promise<void> {
    await this.db.serviceRequest.update({
      where: { id },
      data: { status: "CANCELLED", adminNotes },
    });
  }

  async rate(id: string, starRating: number, reviewText: string | null): Promise<void> {
    await this.db.serviceRequest.update({
      where: { id },
      data: { starRating, reviewText, ratedAt: new Date() },
    });
  }

  private toEntity(row: {
    id: string;
    gapId: string;
    userId: string;
    providerId: string | null;
    status: string;
    priceAgreed: string | null;
    adminNotes: string | null;
    providerNotes: string | null;
    starRating: number | null;
    reviewText: string | null;
    requestedAt: Date;
    assignedAt: Date | null;
    completedAt: Date | null;
    ratedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): ServiceRequestEntity {
    return new ServiceRequestEntity(
      row.id,
      row.gapId,
      row.userId,
      row.providerId,
      row.status as ServiceRequestStatus,
      row.priceAgreed,
      row.adminNotes,
      row.providerNotes,
      row.starRating,
      row.reviewText,
      row.requestedAt,
      row.assignedAt,
      row.completedAt,
      row.ratedAt,
      row.createdAt,
      row.updatedAt
    );
  }

  private toDetails(row: {
    id: string;
    status: string;
    priceAgreed: string | null;
    adminNotes: string | null;
    providerNotes: string | null;
    starRating: number | null;
    reviewText: string | null;
    requestedAt: Date;
    assignedAt: Date | null;
    completedAt: Date | null;
    ratedAt: Date | null;
    gap: { id: string; section: string; gapTitle: string; description: string; priority: string; serviceTag: string | null };
    provider: { id: string; businessName: string; contactEmail: string; contactPhone: string } | null;
    user: { firstName: string; lastName: string; email: string };
  }): ServiceRequestWithDetails {
    return {
      id: row.id,
      status: row.status as ServiceRequestStatus,
      priceAgreed: row.priceAgreed,
      adminNotes: row.adminNotes,
      providerNotes: row.providerNotes,
      starRating: row.starRating,
      reviewText: row.reviewText,
      requestedAt: row.requestedAt,
      assignedAt: row.assignedAt,
      completedAt: row.completedAt,
      ratedAt: row.ratedAt,
      gap: {
        id: row.gap.id,
        section: row.gap.section,
        gapTitle: row.gap.gapTitle,
        description: row.gap.description,
        priority: row.gap.priority,
        serviceTag: row.gap.serviceTag,
      },
      provider: row.provider
        ? { id: row.provider.id, businessName: row.provider.businessName, contactEmail: row.provider.contactEmail, contactPhone: row.provider.contactPhone }
        : null,
      smeBusinessOwner: { firstName: row.user.firstName, lastName: row.user.lastName, email: row.user.email },
    };
  }
}
