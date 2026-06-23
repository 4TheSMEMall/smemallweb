import type { PrismaClient } from "@prisma/client";

export class GetAdminStatsUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute() {
    const [totalUsers, bhcCompletions, wibgTotal, wibgByStatus, attendees] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.bhcResult.count(),
        this.prisma.wibgApplication.count(),
        this.prisma.wibgApplication.groupBy({
          by: ["status"],
          _count: { id: true },
        }),
        this.prisma.wibgAttendee.count(),
      ]);

    const byStatus = Object.fromEntries(
      wibgByStatus.map((r) => [r.status, r._count.id]),
    ) as Record<string, number>;

    return { totalUsers, bhcCompletions, wibgTotal, byStatus, attendees };
  }
}
