"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getAuth } from "@/lib/auth";
import { requireUser } from "@/lib/admin/session";
import { authErrorMessage } from "@/lib/admin/auth-errors";
import { parseForm, type FormState } from "@/lib/admin/form";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Введите текущий пароль"),
    newPassword: z.string().min(10, "Не короче 10 символов").max(128),
    confirm: z.string(),
  })
  .refine((v) => v.newPassword === v.confirm, { path: ["confirm"], message: "Пароли не совпадают" });

export async function changePassword(_: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const { data, state } = parseForm(schema, formData);
  if (!data) return state;
  try {
    await getAuth().api.changePassword({
      body: { currentPassword: data.currentPassword, newPassword: data.newPassword, revokeOtherSessions: true },
      headers: await headers(),
    });
  } catch (error) {
    return { error: authErrorMessage(error) };
  }
  return { message: "Пароль изменён. Другие сеансы завершены." };
}
