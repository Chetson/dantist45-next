import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";

// Общие помощники Server Actions админки: состояние формы для useActionState,
// разбор FormData через zod и перевод ошибок БД в ошибки полей.

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  /** Сообщение об успехе для форм, которые не уходят со страницы. */
  message?: string;
} | null;

// ─── Поля FormData ────────────────────────────────────────────────────

const trimmed = z.string().transform((v) => v.trim());

/** Обязательная строка. */
export const text = (label = "Поле") => trimmed.pipe(z.string().min(1, `${label}: обязательно`));

/** Необязательная строка: пустая → null. */
export const optionalText = () =>
  z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : null));

/** Целое число из input type=number. */
export const integer = (label = "Число") =>
  trimmed
    .refine((v) => v !== "" && Number.isInteger(Number(v)), `${label}: целое число`)
    .transform(Number);

export const optionalInteger = (label = "Число") =>
  z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? Number(v) : null))
    .refine((v) => v === null || Number.isInteger(v), `${label}: целое число`);

/** Чекбокс: отмеченный приходит как "on", неотмеченный — отсутствует. */
export const checkbox = () => z.string().optional().transform((v) => v === "on");

export const slug = () =>
  trimmed.pipe(
    z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Только латиница, цифры и дефис")
      .or(z.literal("")),
  );

// Время на сайте — уральское (Курган, UTC+5, без перехода на летнее).
const TZ_OFFSET = "+05:00";
const TZ_OFFSET_MS = 5 * 60 * 60 * 1000;

/** input type=datetime-local («2026-11-02T09:00», время Кургана) → Date | null. */
export const optionalDateTime = () =>
  z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? new Date(`${v.trim()}${TZ_OFFSET}`) : null))
    .refine((d) => d === null || !Number.isNaN(d.getTime()), "Неверная дата");

/** input type=date → Date (полночь UTC, как @db.Date в seed). */
export const optionalDate = () =>
  z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? new Date(`${v.trim()}T00:00:00Z`) : null))
    .refine((d) => d === null || !Number.isNaN(d.getTime()), "Неверная дата");

/** Date → значение для input type=datetime-local во времени Кургана. */
export function toDateTimeInput(date: Date | null | undefined) {
  return date ? new Date(date.getTime() + TZ_OFFSET_MS).toISOString().slice(0, 16) : "";
}

export function toDateInput(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : "";
}

// ─── Разбор ───────────────────────────────────────────────────────────

/** Строковые поля FormData как объект; повторяющиеся ключи — последнее значение. */
function formFields(formData: FormData) {
  const fields: Record<string, string> = {};
  for (const [key, value] of formData) {
    if (typeof value === "string") fields[key] = value;
  }
  return fields;
}

export function parseForm<T extends z.ZodType>(schema: T, formData: FormData) {
  const result = schema.safeParse(formFields(formData));
  if (result.success) return { data: result.data as z.output<T>, state: null };
  const state: FormState = {
    error: "Проверьте поля формы",
    fieldErrors: z.flattenError(result.error).fieldErrors as Record<string, string[]>,
  };
  return { data: null, state };
}

/** Ошибка уникальности (P2002) → ошибка поля; остальные ошибки пробрасываются. */
export function uniqueViolation(error: unknown, field: string, message: string): FormState {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { error: message, fieldErrors: { [field]: [message] } };
  }
  throw error;
}
