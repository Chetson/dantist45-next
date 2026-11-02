"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { getAuth } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin/session";
import { authErrorMessage } from "@/lib/admin/auth-errors";
import { parseForm, text, type FormState } from "@/lib/admin/form";

// Управление пользователями — через API плагина admin: он сам проверяет права
// по сессии из headers, хэширует пароли и завершает сессии при блокировке.

const role = z.enum(["admin", "editor"]);
const password = z.string().min(10, "Не короче 10 символов").max(128, "Не длиннее 128 символов");

const createSchema = z.object({
  name: text("Имя"),
  email: z.email("Неверный email").transform((v) => v.toLowerCase()),
  password,
  role,
});

export async function createUser(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { data, state } = parseForm(createSchema, formData);
  if (!data) return state;
  try {
    await getAuth().api.createUser({ body: data, headers: await headers() });
  } catch (error) {
    return { error: authErrorMessage(error) };
  }
  revalidatePath("/admin/users");
  return { message: `Пользователь ${data.email} создан. Передайте ему пароль лично.` };
}

/** Действия над самим собой запрещены: так в системе всегда остаётся администратор. */
async function requireOtherUser(userId: string) {
  const me = await requireAdmin();
  if (me.id === userId) throw new Error("Нельзя менять собственную учётную запись здесь");
}

export async function setRole(userId: string, _: FormState, formData: FormData): Promise<FormState> {
  await requireOtherUser(userId);
  const parsed = role.safeParse(formData.get("role"));
  if (!parsed.success) return { error: "Неизвестная роль" };
  try {
    await getAuth().api.setRole({ body: { userId, role: parsed.data }, headers: await headers() });
  } catch (error) {
    return { error: authErrorMessage(error) };
  }
  revalidatePath("/admin/users");
  return { message: "Роль изменена" };
}

export async function setPassword(userId: string, _: FormState, formData: FormData): Promise<FormState> {
  await requireOtherUser(userId);
  const parsed = password.safeParse(formData.get("password"));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message, fieldErrors: { password: [parsed.error.issues[0]?.message ?? ""] } };
  try {
    const api = getAuth().api;
    const requestHeaders = await headers();
    await api.setUserPassword({ body: { userId, newPassword: parsed.data }, headers: requestHeaders });
    await api.revokeUserSessions({ body: { userId }, headers: requestHeaders });
  } catch (error) {
    return { error: authErrorMessage(error) };
  }
  return { message: "Пароль изменён, сеансы пользователя завершены" };
}

export async function banUser(userId: string) {
  await requireOtherUser(userId);
  await getAuth().api.banUser({ body: { userId, banReason: "Доступ отключён администратором" }, headers: await headers() });
  revalidatePath("/admin/users");
}

export async function unbanUser(userId: string) {
  await requireOtherUser(userId);
  await getAuth().api.unbanUser({ body: { userId }, headers: await headers() });
  revalidatePath("/admin/users");
}

export async function removeUser(userId: string) {
  await requireOtherUser(userId);
  await getAuth().api.removeUser({ body: { userId }, headers: await headers() });
  revalidatePath("/admin/users");
}
