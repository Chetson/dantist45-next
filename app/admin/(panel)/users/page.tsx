import type { Metadata } from "next";
import { headers } from "next/headers";
import { Ban, KeyRound, Trash2, Undo2 } from "lucide-react";
import { getAuth } from "@/lib/auth";
import { isRole, roleLabels, roles } from "@/lib/auth-permissions";
import { requireAdmin } from "@/lib/admin/session";
import { ActionForm, ConfirmButton, Field, SubmitButton } from "@/components/admin/form";
import { inputClass, linkButtonClass } from "@/components/admin/styles";
import { AdminCard, AdminHeader, AdminTable, Badge } from "@/components/admin/ui";
import { banUser, createUser, removeUser, setPassword, setRole, unbanUser } from "./actions";

export const metadata: Metadata = { title: "Пользователи" };

const roleOptions = Object.keys(roles).filter(isRole);

const dateFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", year: "numeric" });

export default async function UsersPage() {
  const me = await requireAdmin();
  const { users } = await getAuth().api.listUsers({
    query: { limit: 200, sortBy: "createdAt", sortDirection: "asc" },
    headers: await headers(),
  });

  return (
    <>
      <AdminHeader title="Пользователи">
        Администратор управляет пользователями и контентом, редактор — только контентом. Регистрации нет:
        учётные записи создаются здесь.
      </AdminHeader>

      <AdminTable head={["Пользователь", "Роль", "Создан", "Статус", "Действия"]}>
        {users.map((user) => {
          const self = user.id === me.id;
          const userRole = isRole(user.role) ? user.role : "editor";
          return (
            <tr key={user.id} className="align-top">
              <td>
                <p className="font-semibold text-brand-deep">{user.name}</p>
                <p className="text-sm text-muted">{user.email}</p>
              </td>
              <td>
                {self ? (
                  <span className="text-sm">{roleLabels[userRole]}</span>
                ) : (
                  <ActionForm action={setRole.bind(null, user.id)} className="flex items-center gap-2">
                    <select name="role" aria-label="Роль" defaultValue={userRole} className={`${inputClass} w-auto min-w-36 py-1.5 text-sm`}>
                      {roleOptions.map((r) => (
                        <option key={r} value={r}>
                          {roleLabels[r]}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className={linkButtonClass}>
                      OK
                    </button>
                  </ActionForm>
                )}
              </td>
              <td className="text-sm whitespace-nowrap text-muted">{dateFormat.format(user.createdAt)}</td>
              <td>
                {self ? <Badge tone="brand">Это вы</Badge> : user.banned ? <Badge tone="critical">Заблокирован</Badge> : <Badge tone="success">Активен</Badge>}
              </td>
              <td>
                {!self && (
                  <div className="grid gap-2">
                    <div className="flex flex-wrap gap-2">
                      {user.banned ? (
                        <form action={unbanUser.bind(null, user.id)}>
                          <button type="submit" className={linkButtonClass}>
                            <Undo2 className="size-4" aria-hidden="true" />
                            Разблокировать
                          </button>
                        </form>
                      ) : (
                        <form action={banUser.bind(null, user.id)}>
                          <ConfirmButton confirm={`Заблокировать ${user.email}? Пользователь сразу потеряет доступ.`}>
                            <Ban className="size-4" aria-hidden="true" />
                            Заблокировать
                          </ConfirmButton>
                        </form>
                      )}
                      <form action={removeUser.bind(null, user.id)}>
                        <ConfirmButton confirm={`Удалить пользователя ${user.email}?`}>
                          <Trash2 className="size-4" aria-hidden="true" />
                          Удалить
                        </ConfirmButton>
                      </form>
                    </div>
                    <details>
                      <summary className={`${linkButtonClass} w-fit cursor-pointer list-none`}>
                        <KeyRound className="size-4" aria-hidden="true" />
                        Новый пароль
                      </summary>
                      <ActionForm action={setPassword.bind(null, user.id)} resetOnSuccess className="mt-3 grid max-w-xs gap-2">
                        <input
                          name="password"
                          type="text"
                          aria-label="Новый пароль"
                          placeholder="Не короче 10 символов"
                          autoComplete="off"
                          required
                          minLength={10}
                          className={inputClass}
                        />
                        <div>
                          <SubmitButton size="sm">Установить</SubmitButton>
                        </div>
                      </ActionForm>
                    </details>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </AdminTable>

      <AdminCard title="Новый пользователь" className="mt-6">
        <ActionForm action={createUser} resetOnSuccess className="grid grid-cols-12 gap-4 sm:gap-6">
          <Field label="Имя" name="name" className="col-span-12 sm:col-span-6">
            <input id="name" name="name" required className={inputClass} />
          </Field>
          <Field label="Email (логин)" name="email" className="col-span-12 sm:col-span-6">
            <input id="email" name="email" type="email" required autoComplete="off" className={inputClass} />
          </Field>
          <Field label="Пароль" name="password" hint="Не короче 10 символов. Пользователь сменит его в профиле." className="col-span-12 sm:col-span-6">
            <input id="password" name="password" type="text" required minLength={10} autoComplete="off" className={inputClass} />
          </Field>
          <Field label="Роль" name="role" className="col-span-12 sm:col-span-6">
            <select id="role" name="role" defaultValue="editor" className={inputClass}>
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r]}
                </option>
              ))}
            </select>
          </Field>
          <div className="col-span-12">
            <SubmitButton>Создать пользователя</SubmitButton>
          </div>
        </ActionForm>
      </AdminCard>
    </>
  );
}
