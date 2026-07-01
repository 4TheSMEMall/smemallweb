import { prisma } from "../database/prisma.client";

export interface ActivityLogFilters {
  actorId?: string;
  entityType?: string;
  entityId?: string;
  from?: Date;
  to?: Date;
  page?: number;
  pageSize?: number;
}

export class PrismaActivityLogRepository {
  constructor(private readonly db = prisma) {}

  async log(
    actorId: string,
    actorRole: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.db.activityLog.create({
      data: { actorId, actorRole, action, entityType, entityId, metadata: metadata as object | undefined },
    });
  }

  async findAll(filters: ActivityLogFilters = {}) {
    const { actorId, entityType, entityId, from, to, page = 1, pageSize = 40 } = filters;
    const where = {
      ...(actorId    && { actorId }),
      ...(entityType && { entityType }),
      ...(entityId   && { entityId }),
      ...(from || to ? { createdAt: { ...(from && { gte: from }), ...(to && { lte: to }) } } : {}),
    };
    const [logs, total] = await Promise.all([
      this.db.activityLog.findMany({
        where,
        include: { actor: { select: { firstName: true, lastName: true, role: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.db.activityLog.count({ where }),
    ]);
    return { logs, total, page, pages: Math.ceil(total / pageSize) };
  }

  /** Summary of actions grouped by admin — for super admin dashboard */
  async statsByActor() {
    return this.db.activityLog.groupBy({
      by: ["actorId", "actorRole"],
      _count: { id: true },
      _max: { createdAt: true },
      orderBy: { _count: { id: "desc" } },
    });
  }
}

// ── Singleton instance used as a lightweight logging helper ───────────────
// Import this anywhere in the codebase and call logActivity() — no DI needed
// for a write-only audit trail. Errors are swallowed so they never block the
// main request flow.
const repo = new PrismaActivityLogRepository();

export async function logActivity(
  actorId: string,
  actorRole: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: Record<string, unknown>,
) {
  repo.log(actorId, actorRole, action, entityType, entityId, metadata)
    .catch((err) => console.error("[ActivityLog] failed to write:", err.message));
}
