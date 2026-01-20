import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Sangat berguna untuk melihat apa yang terjadi di terminal saat test.http dijalankan
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;