import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, roles } from "@/lib/auth-permissions";

// Клиент Better Auth для браузера: нужен только форме входа и кнопке выхода.
// Остальные операции выполняются на сервере через getAuth().api.
export const authClient = createAuthClient({
  plugins: [adminClient({ ac, roles })],
});
