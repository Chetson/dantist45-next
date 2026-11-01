import "server-only";
import { cacheTag } from "next/cache";
import { connection } from "next/server";
import { getDb } from "@/lib/db";

// Общие данные для layout (Header/Footer). Админка будет сбрасывать кэш
// через revalidateTag/updateTag с этими тегами.
//
// Схема для всех функций чтения из БД: публичная функция вызывает connection(),
// а запрос к БД живёт во внутренней функции с 'use cache'. Так `next build`
// не обращается к базе (образ Docker собирается без БД), а на сервере
// результат кэшируется в памяти до инвалидации по тегу.
// Компоненты, которые их вызывают, должны быть обёрнуты в <Suspense>.
export const TAGS = {
  organization: "organization",
  clinics: "clinics",
  regulators: "regulators",
} as const;

async function loadOrganization() {
  "use cache";
  cacheTag(TAGS.organization);
  return getDb().organization.findUnique({ where: { id: 1 } });
}

async function loadClinics() {
  "use cache";
  cacheTag(TAGS.clinics);
  return getDb().clinic.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    include: {
      phones: { orderBy: { sortOrder: "asc" } },
      schedule: { orderBy: { sortOrder: "asc" } },
    },
  });
}

async function loadRegulators() {
  "use cache";
  cacheTag(TAGS.regulators);
  return getDb().regulator.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getOrganization() {
  await connection();
  return loadOrganization();
}

export async function getClinics() {
  await connection();
  return loadClinics();
}

export async function getRegulators() {
  await connection();
  return loadRegulators();
}
