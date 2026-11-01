import "server-only";
import { cacheTag } from "next/cache";
import { connection } from "next/server";
import { getDb } from "@/lib/db";

// Схема для всех функций чтения из БД (lib/data/*): публичная функция вызывает
// connection(), а запрос живёт во внутренней функции с 'use cache'. Так
// `next build` не обращается к базе (образ Docker собирается без БД), а на
// сервере результат кэшируется в памяти до инвалидации по тегу из TAGS.
// Компоненты, которые их вызывают, должны быть обёрнуты в <Suspense>.
export const TAGS = {
  organization: "organization",
  clinics: "clinics",
  regulators: "regulators",
  settings: "settings",
  staff: "staff",
  services: "services",
  announcements: "announcements",
  licenses: "licenses",
  documents: "documents",
} as const;

async function loadOrganization() {
  "use cache";
  cacheTag(TAGS.organization);
  return getDb().organization.findUnique({ where: { id: 1 } });
}

async function loadSettings() {
  "use cache";
  cacheTag(TAGS.settings);
  return getDb().siteSettings.findUnique({ where: { id: 1 } });
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
      _count: { select: { staff: { where: { staff: { isPublished: true } } } } },
    },
  });
}

async function loadClinic(slug: string) {
  "use cache";
  cacheTag(TAGS.clinics, TAGS.staff, TAGS.licenses);
  return getDb().clinic.findFirst({
    where: { slug, isPublished: true },
    include: {
      phones: { orderBy: { sortOrder: "asc" } },
      schedule: { orderBy: { sortOrder: "asc" } },
      staff: {
        where: { staff: { isPublished: true } },
        orderBy: { staff: { sortOrder: "asc" } },
        include: { staff: true },
      },
      licenseAnnexes: {
        orderBy: { sortOrder: "asc" },
        include: { license: { select: { number: true, issuedAt: true } } },
      },
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

export async function getSettings() {
  await connection();
  return loadSettings();
}

export async function getClinics() {
  await connection();
  return loadClinics();
}

export async function getClinic(slug: string) {
  await connection();
  return loadClinic(slug);
}

export async function getRegulators() {
  await connection();
  return loadRegulators();
}

/** Ссылки на карты строятся по адресу: без встраивания карт и их cookie. */
export function mapLinks(address: string) {
  const query = encodeURIComponent(address);
  return {
    yandex: `https://yandex.ru/maps/?text=${query}`,
    twoGis: `https://2gis.ru/kurgan/search/${query}`,
  };
}
