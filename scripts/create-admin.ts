// Создаёт администратора админки или сбрасывает ему пароль:
//   npm run admin:create -- admin@example.ru "Имя Фамилия"
// Пароль генерируется и выводится один раз. Если пользователь с таким email
// уже есть, ему выдаётся роль admin, пароль меняется, сессии завершаются.
// В Docker: docker compose run --rm migrate npx tsx scripts/create-admin.ts <email> "<имя>"

import "dotenv/config";
import { randomBytes, randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../generated/prisma/client";

const [emailArg, ...nameParts] = process.argv.slice(2);
const email = emailArg?.trim().toLowerCase();
const name = nameParts.join(" ").trim() || "Администратор";
if (!email || !email.includes("@")) {
  console.error('Использование: npm run admin:create -- <email> "<имя>"');
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL не задан");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const password = randomBytes(12).toString("base64url");
  const hash = await hashPassword(password);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: existing.id },
        data: { role: "admin", banned: false, banReason: null, banExpires: null },
      }),
      prisma.account.deleteMany({ where: { userId: existing.id, providerId: "credential" } }),
      prisma.account.create({
        data: {
          id: randomUUID(),
          accountId: existing.id,
          providerId: "credential",
          userId: existing.id,
          password: hash,
        },
      }),
      prisma.session.deleteMany({ where: { userId: existing.id } }),
    ]);
    console.log(`Пароль пользователя ${email} сброшен, роль — admin.`);
  } else {
    const id = randomUUID();
    await prisma.user.create({
      data: {
        id,
        email,
        name,
        role: "admin",
        accounts: {
          create: { id: randomUUID(), accountId: id, providerId: "credential", password: hash },
        },
      },
    });
    console.log(`Создан администратор ${email}.`);
  }
  console.log(`Пароль: ${password}`);
  console.log("Сохраните его и смените после входа: /admin/account.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
