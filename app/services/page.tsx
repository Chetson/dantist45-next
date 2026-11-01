import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Suspense } from "react";
import { PriceDisclaimer, PriceTable } from "@/components/services/PriceTable";
import { iconCircle } from "@/components/ui/button";
import { CategoryIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { getServiceCatalog } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Услуги и цены",
  alternates: { canonical: "/services" },
  description:
    "Стоматологические услуги и цены клиники «Дантист» в Кургане: терапия, хирургия, ортопедия, гигиена.",
};

async function Catalog() {
  const catalog = await getServiceCatalog();
  const updatedAt = catalog
    .flatMap((c) => c.services)
    .reduce<Date | undefined>((max, s) => (!max || s.updatedAt > max ? s.updatedAt : max), undefined);

  return (
    <div className="container-page space-y-6 pb-8">
      {/* Навигация по направлениям — вторая строка шапки (слот @subnav). */}

      {catalog.map((category) => (
        <section
          key={category.id}
          id={category.slug}
          aria-labelledby={`${category.slug}-title`}
          className="card card-pad scroll-mt-12 grid grid-cols-12 gap-x-6 gap-y-8 *:col-span-12 *:min-w-0 lg:[&>*:first-child]:col-span-4 lg:[&>*:last-child]:col-span-8"
        >
          <div>
            <span className={`${iconCircle} size-14`}>
              <CategoryIcon name={category.icon} className="size-6" />
            </span>
            <h2
              id={`${category.slug}-title`}
              className="type-h3 mt-6 [overflow-wrap:anywhere] text-brand-deep lowercase hyphens-auto"
            >
              {category.name}
            </h2>
            {category.summary && <p className="mt-3 text-muted">{category.summary}</p>}
            {category.articles.length > 0 && (
              <ul className="mt-6 space-y-2">
                {category.articles.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/services/${article.slug}`}
                      className="group inline-flex items-center gap-2 font-semibold text-brand hover:text-brand-strong"
                    >
                      {article.title}
                      <ArrowUpRight
                        className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <PriceTable services={category.services} caption={`Цены: ${category.name}`} />
        </section>
      ))}

      <div className="px-2 pt-4">
        <PriceDisclaimer updatedAt={updatedAt} />
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="прайс-лист"
        current="Услуги и цены"
        lead="Стоматологическая помощь в рамках лицензии на медицинскую деятельность. Запись на приём — по телефону филиала."
      />
      <Suspense
        fallback={
          <div className="container-page space-y-6">
            <Skeleton className="h-12" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        }
      >
        <Catalog />
      </Suspense>
    </>
  );
}
