import type { PrismaClient } from "@prisma/client";

export type WibgApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "TOP_20"
  | "TOP_6"
  | "WINNER_1ST"
  | "WINNER_2ND"
  | "WINNER_3RD"
  | "REJECTED";

export interface ApplicationInput {
  founderName: string;
  founderEmail: string;
  founderPhone: string;
  businessName: string;
  cacStatus: string;
  cacNumber?: string;
  problem: string;
  solution: string;
  market: string;
  traction: string;
  revenue3m: number;
  proj12m: number;
  bhcRef: string;
  bizStage: string;
  pitchVideoLink?: string;
}

export interface AttendeeInput {
  name: string;
  email: string;
  phone: string;
  role: string;
  notes?: string;
}

export interface AdminApplicationFilters {
  status?: WibgApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export class PrismaWibgRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createApplication(data: ApplicationInput) {
    return this.prisma.wibgApplication.create({ data });
  }

  async findApplicationById(id: string) {
    return this.prisma.wibgApplication.findUnique({ where: { id } });
  }

  async findApplicationByEmail(email: string) {
    return this.prisma.wibgApplication.findFirst({
      where: { founderEmail: { equals: email, mode: "insensitive" } },
    });
  }

  async updateVideoTagged(id: string, tagged: boolean) {
    return this.prisma.wibgApplication.update({
      where: { id },
      data: { videoTagged: tagged },
    });
  }

  async findApplications(filters: AdminApplicationFilters = {}) {
    const { status, search, page = 1, limit = 20 } = filters;
    const where = {
      ...(status ? { status } : {}),
      ...(search ? {
        OR: [
          { founderName:  { contains: search, mode: "insensitive" as const } },
          { founderEmail: { contains: search, mode: "insensitive" as const } },
          { businessName: { contains: search, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [applications, total] = await Promise.all([
      this.prisma.wibgApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.wibgApplication.count({ where }),
    ]);
    return { applications, total, page, pages: Math.ceil(total / limit) };
  }

  async updateApplicationStatus(
    id: string,
    status: WibgApplicationStatus,
    adminNotes?: string,
  ) {
    return this.prisma.wibgApplication.update({
      where: { id },
      data: {
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      },
    });
  }

  async countByStatus() {
    const rows = await this.prisma.wibgApplication.groupBy({
      by: ["status"],
      _count: { id: true },
    });
    return Object.fromEntries(rows.map((r) => [r.status, r._count.id])) as
      Partial<Record<WibgApplicationStatus, number>>;
  }

  async createAttendee(data: AttendeeInput) {
    return this.prisma.wibgAttendee.create({ data });
  }

  async findAttendeeByEmail(email: string) {
    return this.prisma.wibgAttendee.findUnique({ where: { email } });
  }
}
