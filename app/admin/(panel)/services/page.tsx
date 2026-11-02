import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/admin/session";
import { buttonClass } from "@/components/ui/button";
import { linkButtonClass } from "@/components/admin/styles";
import { AdminCard, AdminHeader, AdminTable, Badge, EmptyState, PublicLink } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Услуги и цены" };

export default async function ServicesAdminPage() {
  await requireUser();
  const db = getDb();
  const [categories, orphanArticles] = await Promise.all([
    db.serviceCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { services: true, articles: true } } },
    }),
    db.serviceArticle.findMany({ where: { categoryId: null }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      <AdminHeader
        title="Услуги и цены"
        actions={
          <>
            <Link href="/admin/services/articles/new" className={buttonClass("outline", "sm")}>
              <Plus className="size-4" aria-hidden="true" />
              Статья
            </Link>
            <Link href="/admin/services/categories/new" className={buttonClass("primary", "sm")}>
              <Plus className="size-4" aria-hidden="true" />
              Раздел
            </Link>
          </>
        }
      >
        Разделы прайса, строки с ценами и статьи об услугах. <PublicLink href="/services" />
      </AdminHeader>

      {categories.length === 0 ? (
        <EmptyState>Разделов пока нет.</EmptyState>
      ) : (
        <AdminTable head={["№", "Раздел", "Позиций", "Статей", "Статус", ""]}>
          {categories.map((c) => (
            <tr key={c.id}>
              <td className="text-muted tabular-nums">{c.sortOrder}</td>
              <td>
                <Link href={`/admin/services/categories/${c.id}`} className="font-semibold text-brand-deep hover:text-brand">
                  {c.name}
                </Link>
              </td>
              <td className="tabular-nums">{c._count.services}</td>
              <td className="tabular-nums">{c._count.articles}</td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {c.isPublished ? <Badge tone="success">На сайте</Badge> : <Badge>Скрыт</Badge>}
                  {c.showOnHome && <Badge tone="brand">Главная</Badge>}
                </div>
              </td>
              <td className="text-right">
                <Link href={`/admin/services/categories/${c.id}`} className={linkButtonClass}>
                  Открыть
                </Link>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      {orphanArticles.length > 0 && (
        <AdminCard title="Статьи без раздела" className="mt-6">
          <ul className="grid gap-2">
            {orphanArticles.map((a) => (
              <li key={a.id} className="flex items-center gap-3">
                <Link href={`/admin/services/articles/${a.id}`} className="font-semibold text-brand-deep hover:text-brand">
                  {a.title}
                </Link>
                {!a.isPublished && <Badge>Скрыта</Badge>}
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
    </>
  );
}
