import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/admin/session";
import { ConfirmButton } from "@/components/admin/form";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { AdminCard, AdminHeader } from "@/components/admin/ui";
import { deleteAnnouncement, saveAnnouncement } from "../actions";

export const metadata: Metadata = { title: "Уведомление" };

export default async function EditAnnouncementPage({ params }: PageProps<"/admin/announcements/[id]">) {
  await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const db = getDb();
  const [announcement, clinics] = await Promise.all([
    db.announcement.findUnique({ where: { id }, include: { clinics: { select: { id: true } } } }),
    db.clinic.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!announcement) notFound();

  return (
    <>
      <AdminHeader
        title={announcement.title}
        back={{ href: "/admin/announcements", label: "Уведомления" }}
        actions={
          <form action={deleteAnnouncement.bind(null, announcement.id)}>
            <ConfirmButton confirm={`Удалить уведомление «${announcement.title}»?`}>
              <Trash2 className="size-4" aria-hidden="true" />
              Удалить
            </ConfirmButton>
          </form>
        }
      />
      <AdminCard>
        <AnnouncementForm action={saveAnnouncement.bind(null, announcement.id)} clinics={clinics} announcement={announcement} />
      </AdminCard>
    </>
  );
}
