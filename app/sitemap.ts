import type { MetadataRoute } from "next";
import { getServiceCatalog, getStaff } from "@/lib/data/content";
import { getClinics } from "@/lib/data/site";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalog, staff, clinics] = await Promise.all([getServiceCatalog(), getStaff(), getClinics()]);
  const url = (path: string) => new URL(path, siteUrl).toString();

  const staticPages = ["/", "/services", "/specialists", "/clinics", "/licenses", "/regulators", "/documents", "/privacy"];

  return [
    ...staticPages.map((path) => ({ url: url(path) })),
    ...catalog.flatMap((c) => c.articles).map((a) => ({ url: url(`/services/${a.slug}`) })),
    ...staff.map((s) => ({ url: url(`/specialists/${s.slug}`) })),
    ...clinics.map((c) => ({ url: url(`/clinics/${c.slug}`) })),
  ];
}
