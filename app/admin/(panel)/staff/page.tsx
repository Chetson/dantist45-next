import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DoctorsWidgetMode } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";
import { fullName } from "@/lib/format";
import { requireUser } from "@/lib/admin/session";
import { staffKindLabels, widgetModeLabels } from "@/lib/admin/labels";
import { buttonClass } from "@/components/ui/button";
import { ActionForm, Field, SubmitButton } from "@/components/admin/form";
import { inputClass, linkButtonClass } from "@/components/admin/styles";
import { AdminCard, AdminHeader, AdminTable, Badge, EmptyState } from "@/components/admin/ui";
import { saveWidgetSettings } from "./actions";

export const metadata: Metadata = { title: "Сотрудники" };

export default async function StaffListPage() {
  await requireUser();
  const db = getDb();
  const [staff, settings] = await Promise.all([
    db.staff.findMany({
      orderBy: [{ sortOrder: "asc" }, { lastName: "asc" }],
      include: { clinics: { include: { clinic: { select: { name: true } } } }, _count: { select: { documents: true } } },
    }),
    db.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  return (
    <>
      <AdminHeader
        title="Сотрудники"
        actions={
          <Link href="/admin/staff/new" className={buttonClass("primary", "sm")}>
            <Plus className="size-4" aria-hidden="true" />
            Добавить
          </Link>
        }
      >
        Врачи и медперсонал на страницах «Специалисты», филиалов и на главной.
      </AdminHeader>

      {staff.length === 0 ? (
        <EmptyState>Сотрудников пока нет.</EmptyState>
      ) : (
        <AdminTable head={["№", "ФИО", "Категория", "Филиалы", "Статус", ""]}>
          {staff.map((person) => (
            <tr key={person.id}>
              <td className="text-muted tabular-nums">{person.sortOrder}</td>
              <td>
                <Link href={`/admin/staff/${person.id}`} className="font-semibold text-brand-deep hover:text-brand">
                  {fullName(person)}
                </Link>
                {person.specialties && <p className="text-sm text-muted">{person.specialties}</p>}
              </td>
              <td className="text-sm">{staffKindLabels[person.kind]}</td>
              <td className="text-sm">{person.clinics.map((c) => c.clinic.name).join(", ") || "—"}</td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {person.isPublished ? <Badge tone="success">На сайте</Badge> : <Badge>Скрыт</Badge>}
                  {person.showOnHome && <Badge tone="brand">Главная</Badge>}
                  {person._count.documents === 0 && <Badge tone="warning">Нет документов</Badge>}
                </div>
              </td>
              <td className="text-right">
                <Link href={`/admin/staff/${person.id}`} className={linkButtonClass}>
                  Изменить
                </Link>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <AdminCard title="Врачи на главной" className="mt-6">
        <ActionForm action={saveWidgetSettings} className="grid items-end gap-4 sm:grid-cols-[1fr_8rem_auto] sm:gap-6">
          <Field label="Что показывать" name="doctorsWidgetMode">
            <select
              id="doctorsWidgetMode"
              name="doctorsWidgetMode"
              defaultValue={settings?.doctorsWidgetMode ?? "AUTO"}
              className={inputClass}
            >
              {Object.values(DoctorsWidgetMode).map((mode) => (
                <option key={mode} value={mode}>
                  {widgetModeLabels[mode]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Сколько" name="doctorsWidgetLimit">
            <input
              id="doctorsWidgetLimit"
              name="doctorsWidgetLimit"
              type="number"
              min={1}
              max={24}
              defaultValue={settings?.doctorsWidgetLimit ?? 6}
              className={inputClass}
            />
          </Field>
          <div>
            <SubmitButton>Сохранить</SubmitButton>
          </div>
        </ActionForm>
      </AdminCard>
    </>
  );
}
