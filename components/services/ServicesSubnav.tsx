import { getServiceCatalog } from "@/lib/data/content";
import { SubnavLinks } from "@/components/layout/SubnavLinks";

/** Строка сабхедера на /services: якоря на направления прайса. */
export async function ServicesSubnav() {
  const catalog = await getServiceCatalog();
  return (
    <SubnavLinks
      label="Направления"
      items={catalog.map((category) => ({ id: category.slug, label: category.name }))}
    />
  );
}
