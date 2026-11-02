import { isAPIError } from "better-auth/api";

// Коды ошибок Better Auth → сообщения для админки.
const messages: Record<string, string> = {
  INVALID_PASSWORD: "Неверный текущий пароль",
  PASSWORD_TOO_SHORT: "Пароль слишком короткий",
  PASSWORD_TOO_LONG: "Пароль слишком длинный",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Пользователь с таким email уже есть",
  USER_ALREADY_EXISTS: "Пользователь с таким email уже есть",
  INVALID_EMAIL: "Неверный email",
  YOU_CANNOT_BAN_YOURSELF: "Нельзя заблокировать себя",
  YOU_CANNOT_REMOVE_YOURSELF: "Нельзя удалить себя",
};

export function authErrorMessage(error: unknown) {
  if (isAPIError(error)) {
    const code = (error.body as { code?: string } | undefined)?.code;
    if (code && messages[code]) return messages[code];
    if (error.status === "FORBIDDEN") return "Недостаточно прав";
    return error.body?.message ?? error.message;
  }
  throw error;
}
