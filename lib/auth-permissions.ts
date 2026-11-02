import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

// Роли админки. Общий файл для сервера (lib/auth.ts) и клиента (lib/auth-client.ts).
//   editor — правит контент сайта;
//   admin  — контент + управление пользователями админки.
const statements = {
  ...defaultStatements,
  content: ["manage"],
} as const;

export const ac = createAccessControl(statements);

export const editor = ac.newRole({ content: ["manage"] });

export const admin = ac.newRole({ ...adminAc.statements, content: ["manage"] });

export const roles = { admin, editor };

export type Role = keyof typeof roles;

export const roleLabels: Record<Role, string> = {
  admin: "Администратор",
  editor: "Редактор",
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && value in roles;
}
