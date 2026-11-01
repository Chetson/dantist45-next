import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Не через env(): иначе `prisma generate` (postinstall) падает без .env.
    url: process.env.DATABASE_URL,
  },
});
