"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { DoctorsWidgetMode, StaffDocType, StaffKind } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";
import { TAGS } from "@/lib/data/site";
import { slugify } from "@/lib/slugify";
import { removeUpload, saveImage } from "@/lib/uploads";
import { requireUser } from "@/lib/admin/session";
import {
  checkbox,
  integer,
  optionalDate,
  optionalText,
  parseForm,
  slug,
  text,
  uniqueViolation,
  type FormState,
} from "@/lib/admin/form";

const staffSchema = z.object({
  lastName: text("Фамилия"),
  firstName: text("Имя"),
  middleName: optionalText(),
  slug: slug(),
  kind: z.enum(StaffKind),
  specialties: optionalText(),
  bio: optionalText(),
  isPublished: checkbox(),
  showOnHome: checkbox(),
  sortOrder: integer("Порядок"),
});

/** Филиалы с должностями: поля clinic_<id> (чекбокс) и position_<id>. */
function clinicPositions(formData: FormData) {
  const result: { clinicId: number; position: string }[] = [];
  for (const [key, value] of formData) {
    const match = /^clinic_(\d+)$/.exec(key);
    if (!match || value !== "on") continue;
    const position = String(formData.get(`position_${match[1]}`) ?? "").trim();
    result.push({ clinicId: Number(match[1]), position });
  }
  return result;
}

export async function saveStaff(id: number | null, _: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const { data, state } = parseForm(staffSchema, formData);
  if (!data) return state;

  const clinics = clinicPositions(formData);
  if (clinics.some((c) => !c.position)) {
    return { error: "Укажите должность в каждом отмеченном филиале", fieldErrors: { clinics: ["Нужна должность"] } };
  }

  const db = getDb();
  const current = id ? await db.staff.findUnique({ where: { id }, select: { photo: true } }) : null;
  if (id && !current) return { error: "Сотрудник не найден" };

  let photo = current?.photo ?? null;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    const saved = await saveImage(file, "staff");
    if (!saved.ok) return { error: saved.error, fieldErrors: { photo: [saved.error] } };
    photo = saved.url;
  } else if (formData.get("removePhoto") === "on") {
    photo = null;
  }

  const fields = {
    ...data,
    slug: data.slug || slugify([data.lastName, data.firstName, data.middleName].filter(Boolean).join(" ")),
    photo,
  };

  let savedId: number;
  try {
    savedId = await db.$transaction(async (tx) => {
      const staff = id
        ? await tx.staff.update({ where: { id }, data: fields })
        : await tx.staff.create({ data: fields });
      await tx.staffClinic.deleteMany({ where: { staffId: staff.id } });
      await tx.staffClinic.createMany({ data: clinics.map((c) => ({ ...c, staffId: staff.id })) });
      return staff.id;
    });
  } catch (error) {
    if (photo !== current?.photo) await removeUpload(photo);
    return uniqueViolation(error, "slug", "Такой адрес страницы уже занят");
  }

  if (current?.photo && current.photo !== photo) await removeUpload(current.photo);
  updateTag(TAGS.staff);
  if (!id) redirect(`/admin/staff/${savedId}`);
  return { message: "Сохранено" };
}

export async function deleteStaff(id: number) {
  await requireUser();
  const staff = await getDb().staff.delete({ where: { id } }).catch(() => null);
  await removeUpload(staff?.photo);
  updateTag(TAGS.staff);
  redirect("/admin/staff");
}

// ─── Документы об образовании ─────────────────────────────────────────

const documentSchema = z.object({
  type: z.enum(StaffDocType),
  number: optionalText(),
  issuedAt: optionalDate(),
  organization: optionalText(),
  specialty: optionalText(),
  qualification: optionalText(),
  note: optionalText(),
  sortOrder: integer("Порядок"),
});

export async function saveDocument(
  staffId: number,
  docId: number | null,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();
  const { data, state } = parseForm(documentSchema, formData);
  if (!data) return state;
  const db = getDb();
  if (docId) {
    await db.staffDocument.update({ where: { id: docId, staffId }, data });
  } else {
    await db.staffDocument.create({ data: { ...data, staffId } });
  }
  updateTag(TAGS.staff);
  return { message: docId ? "Документ сохранён" : "Документ добавлен" };
}

export async function deleteDocument(staffId: number, docId: number) {
  await requireUser();
  await getDb().staffDocument.deleteMany({ where: { id: docId, staffId } });
  updateTag(TAGS.staff);
}

// ─── Виджет врачей на главной ─────────────────────────────────────────

const widgetSchema = z.object({
  doctorsWidgetMode: z.enum(DoctorsWidgetMode),
  doctorsWidgetLimit: integer("Количество").pipe(z.number().min(1, "От 1").max(24, "До 24")),
});

export async function saveWidgetSettings(_: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const { data, state } = parseForm(widgetSchema, formData);
  if (!data) return state;
  await getDb().siteSettings.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data });
  updateTag(TAGS.settings);
  return { message: "Настройки главной сохранены" };
}
