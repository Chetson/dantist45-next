import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Один экземпляр PrismaClient на процесс: в dev hot reload пересоздаёт модули,
// поэтому клиент кэшируется в globalThis, чтобы не плодить пулы соединений.
// Клиент создаётся лениво, при первом запросе: `next build` загружает модули
// без DATABASE_URL (Docker-образ собирается без БД).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getDb() {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL не задан. Скопируйте .env.example в .env.");
    }
    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    });
  }
  return globalForPrisma.prisma;
}
