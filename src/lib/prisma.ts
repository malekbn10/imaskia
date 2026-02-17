import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  // During build time, DATABASE_URL might not be available
  if (!url) {
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === "then") return undefined;
        throw new Error("PrismaClient is not available (no DATABASE_URL)");
      },
    });
  }
  return new PrismaClient({
    datasourceUrl: url,
  });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
