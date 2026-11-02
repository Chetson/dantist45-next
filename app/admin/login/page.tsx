import type { Metadata } from "next";
import Link from "next/link";
import { ToothIcon } from "@/components/ui/icons";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Вход" };

export default function LoginPage() {
  return (
    <section className="container-page flex min-h-svh items-center justify-center py-12">
      <div className="card card-pad w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand text-white glow">
            <ToothIcon className="size-6" />
          </span>
          <div>
            <h1 className="type-h4 text-brand-deep normal-case">Вход в админку</h1>
            <p className="text-sm text-muted">Стоматология «Дантист»</p>
          </div>
        </div>
        <LoginForm />
        <p className="mt-6 text-sm text-muted">
          Нет доступа? Попросите администратора создать вам учётную запись.{" "}
          <Link href="/" className="text-brand underline underline-offset-2">
            На сайт
          </Link>
        </p>
      </div>
    </section>
  );
}
