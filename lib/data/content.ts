import "server-only";
import { cacheTag } from "next/cache";
import { connection } from "next/server";
import { getDb } from "@/lib/db";
import { TAGS } from "./site";

// Услуги, сотрудники, уведомления, лицензии, документы.
// Схема кэширования описана в lib/data/site.ts.

// ─── Уведомления ──────────────────────────────────────────────────────

async function loadAnnouncements() {
  "use cache";
  cacheTag(TAGS.announcements);
  return getDb().announcement.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { clinics: { select: { id: true, name: true } } },
  });
}

/** Активные уведомления; окно показа (startsAt/endsAt) проверяется на каждый запрос. */
export async function getActiveAnnouncements() {
  await connection();
  const now = Date.now();
  return (await loadAnnouncements()).filter(
    (a) =>
      (!a.startsAt || a.startsAt.getTime() <= now) && (!a.endsAt || a.endsAt.getTime() > now),
  );
}

// ─── Услуги ───────────────────────────────────────────────────────────

async function loadServiceCatalog() {
  "use cache";
  cacheTag(TAGS.services);
  return getDb().serviceCategory.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    include: {
      services: { where: { isPublished: true }, orderBy: { sortOrder: "asc" } },
      articles: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
        select: { slug: true, title: true },
      },
    },
  });
}

async function loadArticle(slug: string) {
  "use cache";
  cacheTag(TAGS.services);
  return getDb().serviceArticle.findFirst({
    where: { slug, isPublished: true },
    include: {
      category: {
        include: {
          services: { where: { isPublished: true }, orderBy: { sortOrder: "asc" } },
          articles: {
            where: { isPublished: true },
            orderBy: { sortOrder: "asc" },
            select: { slug: true, title: true },
          },
        },
      },
    },
  });
}

export async function getServiceCatalog() {
  await connection();
  return loadServiceCatalog();
}

export async function getArticle(slug: string) {
  await connection();
  return loadArticle(slug);
}

// ─── Сотрудники ───────────────────────────────────────────────────────

const staffListInclude = {
  clinics: {
    orderBy: { clinic: { sortOrder: "asc" } },
    include: { clinic: { select: { slug: true, name: true } } },
  },
} as const;

async function loadStaff() {
  "use cache";
  cacheTag(TAGS.staff);
  return getDb().staff.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    include: staffListInclude,
  });
}

async function loadStaffMember(slug: string) {
  "use cache";
  cacheTag(TAGS.staff);
  return getDb().staff.findFirst({
    where: { slug, isPublished: true },
    include: {
      ...staffListInclude,
      documents: { orderBy: { sortOrder: "asc" } },
    },
  });
}

async function loadHomeDoctors() {
  "use cache";
  cacheTag(TAGS.staff, TAGS.settings);
  const db = getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  const mode = settings?.doctorsWidgetMode ?? "AUTO";
  if (mode === "HIDDEN") return null;

  return db.staff.findMany({
    where:
      mode === "SELECTED"
        ? { isPublished: true, showOnHome: true }
        : { isPublished: true, kind: "DOCTOR" },
    orderBy: { sortOrder: "asc" },
    take: settings?.doctorsWidgetLimit ?? 6,
    include: staffListInclude,
  });
}

export async function getStaff() {
  await connection();
  return loadStaff();
}

export async function getStaffMember(slug: string) {
  await connection();
  return loadStaffMember(slug);
}

/** Врачи для виджета на главной; null — виджет выключен в настройках. */
export async function getHomeDoctors() {
  await connection();
  return loadHomeDoctors();
}

export type StaffListItem = Awaited<ReturnType<typeof getStaff>>[number];

// ─── Лицензии и документы ─────────────────────────────────────────────

async function loadLicenses() {
  "use cache";
  cacheTag(TAGS.licenses);
  return getDb().license.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    include: {
      annexes: {
        orderBy: { sortOrder: "asc" },
        include: { clinic: { select: { slug: true, name: true } } },
      },
    },
  });
}

async function loadDocuments() {
  "use cache";
  cacheTag(TAGS.documents);
  return getDb().document.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getLicenses() {
  await connection();
  return loadLicenses();
}

export async function getDocuments() {
  await connection();
  return loadDocuments();
}
