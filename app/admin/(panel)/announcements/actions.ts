"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AnnouncementLevel } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";
import { TAGS } from "@/lib/data/site";
import { requireUser } from "@/lib/admin/session";
import { checkbox, integer, optionalDateTime, parseForm, text, type FormState } from "@/lib/admin/form";

const schema = z
  .object({
    title: text("Заголовок"),
    body: text("Текст"),
    level: z.enum(AnnouncementLevel),
    isActive: checkbox(),
    startsAt: optionalDateTime(),
    endsAt: optionalDateTime(),
    sortOrder: integer("Порядок"),
  })
  .refine((v) => !v.startsAt || !v.endsAt || v.endsAt > v.startsAt, {
    path: ["endsAt"],
    message: "Окончание должно быть позже начала",
  });

export async function saveAnnouncement(id: number | null, _: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const { data, state } = parseForm(schema, formData);
  if (!data) return state;
  // Отмеченные филиалы; пусто — уведомление для всех.
  const clinics = formData.getAll("clinics").map((v) => ({ id: Number(v) }));

  const db = getDb();
  const announcement = id
    ? await db.announcement.update({ where: { id }, data: { ...data, clinics: { set: clinics } } })
    : await db.announcement.create({ data: { ...data, clinics: { connect: clinics } } });

  updateTag(TAGS.announcements);
  if (!id) redirect(`/admin/announcements/${announcement.id}`);
  return { message: "Сохранено" };
}

export async function deleteAnnouncement(id: number) {
  await requireUser();
  await getDb().announcement.deleteMany({ where: { id } });
  updateTag(TAGS.announcements);
  redirect("/admin/announcements");
}
