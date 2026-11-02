import type { Metadata } from "next";
import { requireUser } from "@/lib/admin/session";
import { CategoryForm } from "@/components/admin/ServiceForms";
import { AdminCard, AdminHeader } from "@/components/admin/ui";
import { saveCategory } from "../../actions";

export const metadata: Metadata = { title: "Новый раздел" };

export default async function NewCategoryPage() {
  await requireUser();
  return (
    <>
      <AdminHeader title="Новый раздел" back={{ href: "/admin/services", label: "Услуги и цены" }} />
      <AdminCard>
        <CategoryForm action={saveCategory.bind(null, null)} />
      </AdminCard>
    </>
  );
}
