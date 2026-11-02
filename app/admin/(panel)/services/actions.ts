"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { TAGS } from "@/lib/data/site";
import { slugify } from "@/lib/slugify";
import { requireUser } from "@/lib/admin/session";
import {
  checkbox,
  integer,
  optionalInteger,
  optionalText,
  parseForm,
  slug,
  text,
  uniqueViolation,
  type FormState,
} from "@/lib/admin/form";

// ─── Разделы ──────────────────────────────────────────────────────────

const categorySchema = z.object({
  name: text("Название"),
  slug: slug(),
  summary: optionalText(),
  icon: optionalText(),
  sortOrder: integer("Порядок"),
  isPublished: checkbox(),
  showOnHome: checkbox(),
});

export async function saveCategory(id: number | null, _: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const { data, state } = parseForm(categorySchema, formData);
  if (!data) return state;
  const fields = { ...data, slug: data.slug || slugify(data.name) };

  let savedId: number;
  try {
    const db = getDb();
    const category = id
      ? await db.serviceCategory.update({ where: { id }, data: fields })
      : await db.serviceCategory.create({ data: fields });
    savedId = category.id;
  } catch (error) {
    return uniqueViolation(error, "slug", "Такой адрес раздела уже занят");
  }
  updateTag(TAGS.services);
  if (!id) redirect(`/admin/services/categories/${savedId}`);
  return { message: "Сохранено" };
}

export async function deleteCategory(id: number) {
  await requireUser();
  // Строки прайса удаляются каскадно, статьи остаются без раздела.
  await getDb().serviceCategory.deleteMany({ where: { id } });
  updateTag(TAGS.services);
  redirect("/admin/services");
}

// ─── Строки прайса ────────────────────────────────────────────────────

const serviceSchema = z
  .object({
    code: optionalText(),
    name: text("Название"),
    priceFrom: integer("Цена").pipe(z.number().min(0, "Цена не может быть отрицательной")),
    priceTo: optionalInteger("Цена до"),
    unit: optionalText(),
    note: optionalText(),
    sortOrder: integer("Порядок"),
    isPublished: checkbox(),
  })
  .refine((v) => v.priceTo === null || v.priceTo > v.priceFrom, {
    path: ["priceTo"],
    message: "Должна быть больше цены «от»",
  });

export async function saveService(
  categoryId: number,
  id: number | null,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();
  const { data, state } = parseForm(serviceSchema, formData);
  if (!data) return state;
  const db = getDb();
  if (id) {
    await db.service.update({ where: { id, categoryId }, data });
  } else {
    await db.service.create({ data: { ...data, categoryId } });
  }
  updateTag(TAGS.services);
  return { message: id ? "Строка сохранена" : "Строка добавлена" };
}

export async function deleteService(categoryId: number, id: number) {
  await requireUser();
  await getDb().service.deleteMany({ where: { id, categoryId } });
  updateTag(TAGS.services);
}

// ─── Статьи ───────────────────────────────────────────────────────────

const articleSchema = z.object({
  title: text("Заголовок"),
  slug: slug(),
  categoryId: optionalInteger("Раздел"),
  body: text("Текст"),
  sortOrder: integer("Порядок"),
  isPublished: checkbox(),
});

export async function saveArticle(id: number | null, _: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const { data, state } = parseForm(articleSchema, formData);
  if (!data) return state;
  const fields = { ...data, slug: data.slug || slugify(data.title) };

  let savedId: number;
  try {
    const db = getDb();
    const article = id
      ? await db.serviceArticle.update({ where: { id }, data: fields })
      : await db.serviceArticle.create({ data: fields });
    savedId = article.id;
  } catch (error) {
    return uniqueViolation(error, "slug", "Такой адрес статьи уже занят");
  }
  updateTag(TAGS.services);
  if (!id) redirect(`/admin/services/articles/${savedId}`);
  return { message: "Сохранено" };
}

export async function deleteArticle(id: number) {
  await requireUser();
  const article = await getDb().serviceArticle.delete({ where: { id } }).catch(() => null);
  updateTag(TAGS.services);
  redirect(article?.categoryId ? `/admin/services/categories/${article.categoryId}` : "/admin/services");
}
