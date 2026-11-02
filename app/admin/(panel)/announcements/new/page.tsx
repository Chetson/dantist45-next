import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/admin/session";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { AdminCard, AdminHeader } from "@/components/admin/ui";
import { saveAnnouncement } from "../actions";

export const metadata: Metadata = { title: "Новое уведомление" };

export default async function NewAnnouncementPage() {
  await requireUser();
  const clinics = await getDb().clinic.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } });
  return (
    <>
      <AdminHeader title="Новое уведомление" back={{ href: "/admin/announcements", label: "Уведомления" }} />
      <AdminCard>
        <AnnouncementForm action={saveAnnouncement.bind(null, null)} clinics={clinics} />
      </AdminCard>
    </>
  );
}
