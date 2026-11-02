import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getDb } from "@/lib/db";
import { formatDate, fullName } from "@/lib/format";
import { requireUser } from "@/lib/admin/session";
import { staffDocTypeLabels } from "@/lib/admin/labels";
import { ConfirmButton } from "@/components/admin/form";
import { StaffDocumentForm } from "@/components/admin/StaffDocumentForm";
import { StaffForm } from "@/components/admin/StaffForm";
import { AdminCard, AdminHeader, PublicLink } from "@/components/admin/ui";
import { deleteDocument, deleteStaff, saveDocument, saveStaff } from "../actions";

export const metadata: Metadata = { title: "Сотрудник" };

export default async function EditStaffPage({ params }: PageProps<"/admin/staff/[id]">) {
  await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const db = getDb();
  const [staff, clinics] = await Promise.all([
    db.staff.findUnique({
      where: { id },
      include: { clinics: true, documents: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } },
    }),
    db.clinic.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!staff) notFound();

  return (
    <>
      <AdminHeader
        title={fullName(staff)}
        back={{ href: "/admin/staff", label: "Сотрудники" }}
        actions={
          <form action={deleteStaff.bind(null, staff.id)}>
            <ConfirmButton confirm={`Удалить «${fullName(staff)}» вместе с документами?`}>
              <Trash2 className="size-4" aria-hidden="true" />
              Удалить
            </ConfirmButton>
          </form>
        }
      >
        {staff.isPublished && <PublicLink href={`/specialists/${staff.slug}`} />}
      </AdminHeader>

      <AdminCard>
        <StaffForm action={saveStaff.bind(null, staff.id)} clinics={clinics} staff={staff} />
      </AdminCard>

      <AdminCard title="Образование и квалификация" className="mt-6">
        <p className="-mt-3 mb-5 text-sm text-muted">
          Сведения обязательны для сайта медорганизации (ПП РФ № 736).
        </p>
        <div className="grid gap-3">
          {staff.documents.map((doc) => (
            <details key={doc.id} className="rounded-2xl bg-surface-muted/70 ring-1 ring-line">
              <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3.5">
                <span className="font-semibold text-brand-deep">{staffDocTypeLabels[doc.type]}</span>
                <span className="text-sm text-muted">
                  {[doc.specialty, doc.organization, doc.issuedAt && formatDate(doc.issuedAt)].filter(Boolean).join(" · ")}
                </span>
              </summary>
              <div className="grid gap-4 border-t border-line px-5 py-5">
                <StaffDocumentForm action={saveDocument.bind(null, staff.id, doc.id)} doc={doc} />
                <form action={deleteDocument.bind(null, staff.id, doc.id)}>
                  <ConfirmButton confirm="Удалить документ?">
                    <Trash2 className="size-4" aria-hidden="true" />
                    Удалить документ
                  </ConfirmButton>
                </form>
              </div>
            </details>
          ))}
          <details className="rounded-2xl border border-dashed border-brand/40" open={staff.documents.length === 0}>
            <summary className="cursor-pointer px-5 py-3.5 font-semibold text-brand">Добавить документ</summary>
            <div className="border-t border-line px-5 py-5">
              <StaffDocumentForm action={saveDocument.bind(null, staff.id, null)} />
            </div>
          </details>
        </div>
      </AdminCard>
    </>
  );
}
