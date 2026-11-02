import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getAuth } from "@/lib/auth";
import { isRole, type Role } from "@/lib/auth-permissions";

// Слой доступа к сессии админки. Проверку вызывает каждая страница и каждый
// Server Action — proxy.ts лишь быстро отсекает запросы без cookie сессии.
// Вызывающие компоненты должны быть внутри <Suspense> (читаются headers()).

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

/** Текущий пользователь админки или null. Один запрос сессии на рендер. */
export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  // Сначала headers(): при пререндере на нём рендер останавливается,
  // и Better Auth с БД не инициализируются во время сборки.
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session || session.user.banned) return null;
  const { id, name, email, role } = session.user;
  return { id, name, email, role: isRole(role) ? role : "editor" };
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  return user;
}
