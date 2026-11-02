import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { getDb } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { requireUser } from "@/lib/admin/session";
import { buttonClass } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/form";
import { CategoryForm, ServiceRowForm } from "@/components/admin/ServiceForms";
import { AdminCard, AdminHeader, Badge } from "@/components/admin/ui";
import { deleteCategory, deleteService, saveCategory, saveService } from "../../actions";

export const metadata: Metadata = { title: "Раздел услуг" };

export default async function CategoryPage({ params }: PageProps<"/admin/services/categories/[id]">) {
  await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const category = await getDb().serviceCategory.findUnique({
    where: { id },
    include: {
      services: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
      articles: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!category) notFound();

  return (
    <>
      <AdminHeader
        title={category.name}
        back={{ href: "/admin/services", label: "Услуги и цены" }}
        actions={
          <form action={deleteCategory.bind(null, category.id)}>
            <ConfirmButton
              confirm={`Удалить раздел «${category.name}» и все его строки прайса (${category.services.length})? Статьи останутся без раздела.`}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Удалить раздел
            </ConfirmButton>
          </form>
        }
      />

      <AdminCard>
        <CategoryForm action={saveCategory.bind(null, category.id)} category={category} />
      </AdminCard>

      <AdminCard title={`Прайс · ${category.services.length}`} className="mt-6">
        <div className="grid gap-2">
          {category.services.map((service) => (
            <details key={service.id} className="rounded-2xl bg-surface-muted/70 ring-1 ring-line">
              <summary className="grid cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-3">
                <span className="min-w-0">
                  <span className="font-medium text-foreground">{service.name}</span>
                  {service.code && <span className="ml-2 text-xs text-muted">{service.code}</span>}
                  {!service.isPublished && (
                    <span className="ml-2">
                      <Badge>Скрыта</Badge>
                    </span>
                  )}
                </span>
                <span className="text-right font-semibold whitespace-nowrap text-brand-deep tabular-nums">
                  {formatPrice(service.priceFrom, service.priceTo)}
                  {service.unit && <span className="ml-1 text-xs font-normal text-muted">{service.unit}</span>}
                </span>
              </summary>
              <div className="grid gap-4 border-t border-line px-5 py-5">
                <ServiceRowForm action={saveService.bind(null, category.id, service.id)} service={service} />
                <form action={deleteService.bind(null, category.id, service.id)}>
                  <ConfirmButton confirm={`Удалить «${service.name}» из прайса?`}>
                    <Trash2 className="size-4" aria-hidden="true" />
                    Удалить строку
                  </ConfirmButton>
                </form>
              </div>
            </details>
          ))}
          <details className="rounded-2xl border border-dashed border-brand/40" open={category.services.length === 0}>
            <summary className="cursor-pointer px-5 py-3 font-semibold text-brand">Добавить строку прайса</summary>
            <div className="border-t border-line px-5 py-5">
              <ServiceRowForm action={saveService.bind(null, category.id, null)} />
            </div>
          </details>
        </div>
      </AdminCard>

      <AdminCard title="Статьи раздела" className="mt-6">
        {category.articles.length > 0 && (
          <ul className="mb-5 grid gap-2">
            {category.articles.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3">
                <Link href={`/admin/services/articles/${a.id}`} className="font-semibold text-brand-deep hover:text-brand">
                  {a.title}
                </Link>
                {!a.isPublished && <Badge>Скрыта</Badge>}
              </li>
            ))}
          </ul>
        )}
        <Link href={`/admin/services/articles/new?category=${category.id}`} className={buttonClass("outline", "sm")}>
          <Plus className="size-4" aria-hidden="true" />
          Добавить статью
        </Link>
      </AdminCard>
    </>
  );
}
