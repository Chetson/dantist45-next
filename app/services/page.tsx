import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { PriceDisclaimer, PriceTable } from "@/components/services/PriceTable";
import { CategoryIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { getServiceCatalog } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Услуги и цены",
  description:
    "Стоматологические услуги и цены клиники «Дантист» в Кургане: терапия, хирургия, ортопедия, гигиена.",
};

async function Catalog() {
  const catalog = await getServiceCatalog();
  const updatedAt = catalog
    .flatMap((c) => c.services)
    .reduce<Date | undefined>((max, s) => (!max || s.updatedAt > max ? s.updatedAt : max), undefined);

  return (
    <>
      <nav aria-label="Направления" className="sticky top-18 z-30 border-b border-line bg-white/95 backdrop-blur">
        <ul className="container-page flex gap-2 overflow-x-auto py-3 text-sm">
          {catalog.map((category) => (
            <li key={category.id}>
              <a
                href={`#${category.slug}`}
                className="block rounded-full border border-line px-4 py-1.5 whitespace-nowrap transition-colors hover:border-brand hover:text-brand"
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-page space-y-16 py-14">
        {catalog.map((category) => (
          <section key={category.id} id={category.slug} aria-labelledby={`${category.slug}-title`}>
            <div className="flex items-start gap-5">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <CategoryIcon name={category.icon} className="size-7" />
              </span>
              <div>
                <h2 id={`${category.slug}-title`} className="font-display text-2xl text-brand-deep sm:text-3xl">
                  {category.name}
                </h2>
                {category.summary && <p className="mt-2 text-muted">{category.summary}</p>}
              </div>
            </div>

            {category.articles.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.articles.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/services/${article.slug}`}
                      className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-line px-5 py-4 font-medium transition-colors hover:border-brand hover:bg-brand-soft/40"
                    >
                      {article.title}
                      <ArrowRight
                        className="size-4 shrink-0 text-brand transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6">
              <PriceTable services={category.services} caption={`Цены: ${category.name}`} />
            </div>
          </section>
        ))}

        <PriceDisclaimer updatedAt={updatedAt} />
      </div>
    </>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Услуги и цены"
        current="Услуги и цены"
        lead="Стоматологическая помощь в рамках лицензии на медицинскую деятельность. Запись на приём — по телефону филиала."
      />
      <Suspense
        fallback={
          <div className="container-page space-y-6 py-14">
            <Skeleton className="h-12" />
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </div>
        }
      >
        <Catalog />
      </Suspense>
    </>
  );
}
