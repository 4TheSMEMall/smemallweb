import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma client.
 * In development, hot reloads create new module instances which would
 * open multiple DB connections — this global trick prevents that.
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
