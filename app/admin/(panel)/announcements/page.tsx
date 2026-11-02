import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Announcement } from "@/generated/prisma/client";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/admin/session";
import { announcementLevelLabels } from "@/lib/admin/labels";
import { buttonClass } from "@/components/ui/button";
import { linkButtonClass } from "@/components/admin/styles";
import { AdminHeader, AdminTable, Badge, EmptyState, PublicLink } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Уведомления" };

const dateTime = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Yekaterinburg",
});

function status(a: Announcement) {
  const now = Date.now();
  if (!a.isActive) return <Badge>Выключено</Badge>;
  if (a.startsAt && a.startsAt.getTime() > now) return <Badge tone="brand">Запланировано</Badge>;
  if (a.endsAt && a.endsAt.getTime() <= now) return <Badge tone="warning">Истекло</Badge>;
  return <Badge tone="success">На сайте</Badge>;
}

const levelTones = { INFO: "neutral", WARNING: "warning", CRITICAL: "critical" } as const;

export default async function AnnouncementsPage() {
  await requireUser();
  const announcements = await getDb().announcement.findMany({
    orderBy: [{ isActive: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    include: { clinics: { select: { name: true } } },
  });
  return (
    <>
      <AdminHeader
        title="Уведомления"
        actions={
          <Link href="/admin/announcements/new" className={buttonClass("primary", "sm")}>
            <Plus className="size-4" aria-hidden="true" />
            Добавить
          </Link>
        }
      >
        Блок важных сообщений под первым экраном главной. <PublicLink href="/" />
      </AdminHeader>

      {announcements.length === 0 ? (
        <EmptyState>Уведомлений нет — блок на главной не выводится.</EmptyState>
      ) : (
        <AdminTable head={["Заголовок", "Уровень", "Период", "Филиалы", "Статус", ""]}>
          {announcements.map((a) => (
            <tr key={a.id}>
              <td>
                <Link href={`/admin/announcements/${a.id}`} className="font-semibold text-brand-deep hover:text-brand">
                  {a.title}
                </Link>
              </td>
              <td>
                <Badge tone={levelTones[a.level]}>{announcementLevelLabels[a.level]}</Badge>
              </td>
              <td className="text-sm whitespace-nowrap text-muted">
                {a.startsAt || a.endsAt
                  ? `${a.startsAt ? dateTime.format(a.startsAt) : "…"} — ${a.endsAt ? dateTime.format(a.endsAt) : "…"}`
                  : "Без срока"}
              </td>
              <td className="text-sm">{a.clinics.map((c) => c.name).join(", ") || "Все"}</td>
              <td>{status(a)}</td>
              <td className="text-right">
                <Link href={`/admin/announcements/${a.id}`} className={linkButtonClass}>
                  Изменить
                </Link>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  );
}
