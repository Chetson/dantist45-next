import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { PriceDisclaimer, PriceTable } from "@/components/services/PriceTable";
import { buttonClass } from "@/components/ui/button";
import { Markdown } from "@/components/ui/Markdown";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { getArticle } from "@/lib/data/content";

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  if (!article) notFound();
  return {
    title: article.title,
    description: article.body.split("\n")[0].slice(0, 160),
  };
}

async function Article({ slug }: { slug: string }) {
  const article = await getArticle(slug);
  if (!article) notFound();
  const category = article.category;

  return (
    <>
      <PageHeader
        title={article.title}
        crumbs={[{ href: "/services", label: "Услуги и цены" }]}
        current={article.title}
        keepCase
      />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_20rem]">
        <article className="min-w-0">
          <Markdown>{article.body}</Markdown>

          {category && (
            <section className="mt-12" aria-labelledby="prices-title">
              <h2 id="prices-title" className="mb-5 font-display text-2xl text-brand-deep font-extrabold tracking-tight">
                Цены: {category.name.toLowerCase()}
              </h2>
              <PriceTable services={category.services} caption={`Цены: ${category.name}`} />
              <div className="mt-4">
                <PriceDisclaimer />
              </div>
            </section>
          )}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {category && category.articles.length > 1 && (
            <nav aria-label="Другие услуги направления" className="card p-6">
              <h2 className="mb-3 font-display text-lg text-brand-deep font-extrabold tracking-tight">{category.name}</h2>
              <ul className="space-y-1">
                {category.articles.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/services/${item.slug}`}
                      aria-current={item.slug === slug ? "page" : undefined}
                      className="block rounded-xl px-3 py-2 text-sm hover:bg-brand-soft aria-[current=page]:bg-brand-soft aria-[current=page]:font-semibold aria-[current=page]:text-brand"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="bg-sky-panel rounded-[var(--radius-panel)] p-6 text-white shadow-lg shadow-accent-strong/30">
            <h2 className="font-display text-xl font-extrabold tracking-tight">Нужна консультация?</h2>
            <p className="mt-2 text-sm text-white/75">
              Позвоните в удобный филиал — администратор подберёт время приёма.
            </p>
            <Link href="/clinics" className={`${buttonClass("light", "md")} mt-5 w-full`}>
              Телефоны филиалов
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

export default function ServiceArticlePage({ params }: PageProps<"/services/[slug]">) {
  return (
    <Suspense
      fallback={
        <>
          <div className="container-page h-56 pt-12"><Skeleton className="h-24 max-w-2xl" /></div>
          <div className="container-page space-y-4 py-14">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-40" />
          </div>
        </>
      }
    >
      {params.then(({ slug }) => (
        <Article slug={slug} />
      ))}
    </Suspense>
  );
}
