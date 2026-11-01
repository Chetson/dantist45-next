// Перенос категорий и прайса из SQLite старого сайта (github.com/Chetson/dantist45,
// файл data/database.db) в PostgreSQL.
//
//   npm run import:legacy -- /путь/к/database.db
//
// Категории сопоставляются по названию, затем по slug. Услуги импортируемых категорий
// заменяются целиком, поэтому повторный запуск безопасен.
// Цены в старой БД — текст («2 000 ₽», «от 1500», «1000-2000»); строки,
// из которых не удалось извлечь число, пропускаются и выводятся в отчёте.

import "dotenv/config";
import { DatabaseSync } from "node:sqlite";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { slugify } from "../lib/slugify";

type LegacyCategory = { id: number; name: string; order_index: number };
type LegacyService = {
  category_id: number;
  name: string;
  price: string;
  order_index: number;
};

function parsePrice(raw: string) {
  const numbers = raw
    .replace(/\s| /g, "")
    .match(/\d+(?:[.,]\d+)?/g)
    ?.map((n) => Math.round(Number(n.replace(",", "."))));
  if (!numbers?.length) return null;
  const [priceFrom, priceTo] = numbers;
  return { priceFrom, priceTo: priceTo !== undefined && priceTo > priceFrom ? priceTo : null };
}

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Укажите путь к database.db старого сайта");

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL не задан");

  const sqlite = new DatabaseSync(file, { readOnly: true });
  const categories = sqlite
    .prepare("SELECT id, name, order_index FROM service_categories ORDER BY order_index, id")
    .all() as LegacyCategory[];
  const services = sqlite
    .prepare("SELECT category_id, name, price, order_index FROM services ORDER BY order_index, id")
    .all() as LegacyService[];
  sqlite.close();

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  const skipped: LegacyService[] = [];
  let imported = 0;

  try {
    await prisma.$transaction(async (tx) => {
      for (const legacy of categories) {
        // Сначала ищем категорию с тем же названием (у категорий из seed
        // slug задан вручную), иначе — по slug названия.
        const name = legacy.name.trim();
        const category =
          (await tx.serviceCategory.findFirst({
            where: { name: { equals: name, mode: "insensitive" } },
          })) ??
          (await tx.serviceCategory.upsert({
            where: { slug: slugify(name) },
            create: { slug: slugify(name), name, sortOrder: legacy.order_index },
            update: {},
          }));

        await tx.service.deleteMany({ where: { categoryId: category.id } });

        const rows = services.filter((s) => s.category_id === legacy.id);
        for (const [i, row] of rows.entries()) {
          const price = parsePrice(row.price);
          if (!price) {
            skipped.push(row);
            continue;
          }
          await tx.service.create({
            data: {
              categoryId: category.id,
              name: row.name.trim(),
              ...price,
              sortOrder: i,
            },
          });
          imported++;
        }
      }
    });
  } finally {
    await prisma.$disconnect();
  }

  console.log(`Категорий: ${categories.length}, услуг импортировано: ${imported}`);
  if (skipped.length) {
    console.warn("Пропущены (не удалось разобрать цену):");
    for (const s of skipped) console.warn(`  «${s.name}» — «${s.price}»`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
