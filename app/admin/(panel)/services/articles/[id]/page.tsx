import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/admin/session";
import { ConfirmButton } from "@/components/admin/form";
import { ArticleForm } from "@/components/admin/ServiceForms";
import { AdminCard, AdminHeader, PublicLink } from "@/components/admin/ui";
import { deleteArticle, saveArticle } from "../../actions";

export const metadata: Metadata = { title: "Статья" };

export default async function ArticlePage({ params }: PageProps<"/admin/services/articles/[id]">) {
  await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const db = getDb();
  const [article, categories] = await Promise.all([
    db.serviceArticle.findUnique({ where: { id } }),
    db.serviceCategory.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!article) notFound();

  const back = article.categoryId
    ? { href: `/admin/services/categories/${article.categoryId}`, label: "Раздел" }
    : { href: "/admin/services", label: "Услуги и цены" };

  return (
    <>
      <AdminHeader
        title={article.title}
        back={back}
        actions={
          <form action={deleteArticle.bind(null, article.id)}>
            <ConfirmButton confirm={`Удалить статью «${article.title}»?`}>
              <Trash2 className="size-4" aria-hidden="true" />
              Удалить
            </ConfirmButton>
          </form>
        }
      >
        {article.isPublished && <PublicLink href={`/services/${article.slug}`} />}
      </AdminHeader>
      <AdminCard>
        <ArticleForm action={saveArticle.bind(null, article.id)} article={article} categories={categories} />
      </AdminCard>
    </>
  );
}
