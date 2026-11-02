import type { Metadata } from "next";
import { roleLabels } from "@/lib/auth-permissions";
import { requireUser } from "@/lib/admin/session";
import { ActionForm, Field, SubmitButton } from "@/components/admin/form";
import { inputClass } from "@/components/admin/styles";
import { AdminCard, AdminHeader } from "@/components/admin/ui";
import { changePassword } from "./actions";

export const metadata: Metadata = { title: "Профиль" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <AdminHeader title="Профиль">
        {user.name} · {user.email} · {roleLabels[user.role]}
      </AdminHeader>
      <AdminCard title="Смена пароля" className="max-w-xl">
        <ActionForm action={changePassword} resetOnSuccess>
          <Field label="Текущий пароль" name="currentPassword">
            <input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required className={inputClass} />
          </Field>
          <Field label="Новый пароль" name="newPassword" hint="Не короче 10 символов">
            <input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required minLength={10} className={inputClass} />
          </Field>
          <Field label="Повторите новый пароль" name="confirm">
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" required className={inputClass} />
          </Field>
          <div>
            <SubmitButton>Сменить пароль</SubmitButton>
          </div>
        </ActionForm>
      </AdminCard>
    </>
  );
}
