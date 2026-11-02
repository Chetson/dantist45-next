"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { buttonClass } from "@/components/ui/button";
import { inputClass, labelClass } from "./styles";

// Вход через клиент Better Auth: запрос идёт в /api/auth/sign-in/email,
// где действует ограничение числа попыток (lib/auth.ts, rateLimit).
const errorMessages: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Неверный email или пароль",
  BANNED_USER: "Учётная запись заблокирована. Обратитесь к администратору.",
};

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // onSubmit, а не action: после action React сбрасывает форму и стирает email.
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const { error } = await authClient.signIn.email({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      if (error) {
        setError(
          error.status === 429
            ? "Слишком много попыток. Подождите минуту."
            : (errorMessages[error.code ?? ""] ?? "Не удалось войти. Попробуйте ещё раз."),
        );
        return;
      }
      router.replace("/admin");
      router.refresh();
    });
  }

  return (
    // method="post": если нажать «Войти» до загрузки JS, пароль не попадёт в URL.
    <form method="post" onSubmit={submit} className="grid gap-5">
      {error && (
        <p role="alert" className="rounded-xl bg-critical-soft px-4 py-3 text-sm font-medium text-critical">
          {error}
        </p>
      )}
      <div className="grid gap-1.5">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="password" className={labelClass}>
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      <button type="submit" disabled={pending} className={`${buttonClass("primary", "md")} disabled:opacity-60`}>
        {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
        Войти
      </button>
    </form>
  );
}
