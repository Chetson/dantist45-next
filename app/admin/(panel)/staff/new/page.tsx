import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/admin/session";
import { StaffForm } from "@/components/admin/StaffForm";
import { AdminCard, AdminHeader } from "@/components/admin/ui";
import { saveStaff } from "../actions";

export const metadata: Metadata = { title: "Новый сотрудник" };

export default async function NewStaffPage() {
  await requireUser();
  const clinics = await getDb().clinic.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } });
  return (
    <>
      <AdminHeader title="Новый сотрудник" back={{ href: "/admin/staff", label: "Сотрудники" }} />
      <AdminCard>
        <StaffForm action={saveStaff.bind(null, null)} clinics={clinics} />
      </AdminCard>
    </>
  );
}
