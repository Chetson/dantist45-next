import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { getDb } from "@/lib/db";
import { ac, roles } from "@/lib/auth-permissions";

// Авторизация админки — Better Auth: вход по email и паролю, сессии в БД
// (таблицы user/session/account/verification), роли через плагин admin.
// Регистрация закрыта: пользователей создаёт администратор (/admin/users)
// или скрипт scripts/create-admin.ts.
//
// Экземпляр создаётся лениво, как PrismaClient в lib/db.ts: `next build`
// загружает модули без DATABASE_URL и BETTER_AUTH_SECRET.

function createAuth() {
  return betterAuth({
    appName: "Дантист — админка",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    // В разработке dev-сервер может работать на любом порту localhost.
    trustedOrigins: process.env.NODE_ENV === "production" ? [] : ["http://localhost:*"],
    database: prismaAdapter(getDb(), { provider: "postgresql" }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 10,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    rateLimit: {
      enabled: true,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
      },
    },
    plugins: [
      admin({ ac, roles, defaultRole: "editor", adminRoles: ["admin"] }),
      // Должен быть последним: ставит cookies из ответов в Server Actions.
      nextCookies(),
    ],
  });
}

const globalForAuth = globalThis as unknown as { auth?: ReturnType<typeof createAuth> };

export function getAuth() {
  globalForAuth.auth ??= createAuth();
  return globalForAuth.auth;
}

export type AuthSession = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getAuth>["api"]["getSession"]>>
>;
