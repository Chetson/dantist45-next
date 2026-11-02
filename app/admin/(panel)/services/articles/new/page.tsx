import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/admin/session";
import { ArticleForm } from "@/components/admin/ServiceForms";
import { AdminCard, AdminHeader } from "@/components/admin/ui";
import { saveArticle } from "../../actions";

export const metadata: Metadata = { title: "Новая статья" };

export default async function NewArticlePage({ searchParams }: PageProps<"/admin/services/articles/new">) {
  await requireUser();
  const { category } = await searchParams;
  const categoryId = Number(category) || undefined;
  const categories = await getDb().serviceCategory.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });
  const back = categoryId
    ? { href: `/admin/services/categories/${categoryId}`, label: "Раздел" }
    : { href: "/admin/services", label: "Услуги и цены" };

  return (
    <>
      <AdminHeader title="Новая статья" back={back} />
      <AdminCard>
        <ArticleForm action={saveArticle.bind(null, null)} categories={categories} defaultCategoryId={categoryId} />
      </AdminCard>
    </>
  );
}
