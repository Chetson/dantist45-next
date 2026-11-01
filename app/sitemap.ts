import type { MetadataRoute } from "next";
import { getServiceCatalog, getStaff } from "@/lib/data/content";
import { getClinics } from "@/lib/data/site";
import { siteUrl } from "@/lib/site-url";

/** Самая поздняя дата из списка — дата обновления страницы-списка. */
function latest(dates: Date[]) {
  return dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;
}

// lastModified берётся из updatedAt записей в БД: поисковики быстрее
// переобходят страницы, которые изменились. Для страниц без данных в БД
// (лицензии, документы, политика) дата не указывается.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalog, staff, clinics] = await Promise.all([getServiceCatalog(), getStaff(), getClinics()]);
  const url = (path: string) => new URL(path, siteUrl).toString();

  const articles = catalog.flatMap((c) => c.articles);
  const servicesUpdated = latest([
    ...catalog.map((c) => c.updatedAt),
    ...catalog.flatMap((c) => c.services.map((s) => s.updatedAt)),
    ...articles.map((a) => a.updatedAt),
  ]);
  const staffUpdated = latest(staff.map((s) => s.updatedAt));
  const clinicsUpdated = latest(clinics.map((c) => c.updatedAt));
  const siteUpdated = latest(
    [servicesUpdated, staffUpdated, clinicsUpdated].filter((d): d is Date => d !== undefined),
  );

  return [
    { url: url("/"), lastModified: siteUpdated },
    { url: url("/services"), lastModified: servicesUpdated },
    { url: url("/specialists"), lastModified: staffUpdated },
    { url: url("/clinics"), lastModified: clinicsUpdated },
    { url: url("/licenses") },
    { url: url("/regulators") },
    { url: url("/documents") },
    { url: url("/privacy") },
    ...articles.map((a) => ({ url: url(`/services/${a.slug}`), lastModified: a.updatedAt })),
    ...staff.map((s) => ({ url: url(`/specialists/${s.slug}`), lastModified: s.updatedAt })),
    ...clinics.map((c) => ({ url: url(`/clinics/${c.slug}`), lastModified: c.updatedAt })),
  ];
}
