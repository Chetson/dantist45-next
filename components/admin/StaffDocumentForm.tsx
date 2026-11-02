import type { StaffDocument } from "@/generated/prisma/client";
import { StaffDocType } from "@/generated/prisma/enums";
import { toDateInput, type FormState } from "@/lib/admin/form";
import { staffDocTypeLabels } from "@/lib/admin/labels";
import { ActionForm, Field, SubmitButton } from "./form";
import { inputClass } from "./styles";

/** Форма документа об образовании/квалификации сотрудника. */
export function StaffDocumentForm({
  action,
  doc,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  doc?: StaffDocument;
}) {
  const id = (name: string) => `${name}-${doc?.id ?? "new"}`;
  return (
    <ActionForm action={action} resetOnSuccess={!doc} className="grid grid-cols-12 gap-4">
      <Field label="Вид документа" name="type" id={id("type")} className="col-span-12 sm:col-span-6">
        <select id={id("type")} name="type" defaultValue={doc?.type ?? "DIPLOMA"} className={inputClass}>
          {Object.values(StaffDocType).map((type) => (
            <option key={type} value={type}>
              {staffDocTypeLabels[type]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Номер" name="number" id={id("number")} className="col-span-6 sm:col-span-3">
        <input id={id("number")} name="number" defaultValue={doc?.number ?? ""} className={inputClass} />
      </Field>
      <Field label="Дата выдачи" name="issuedAt" id={id("issuedAt")} className="col-span-6 sm:col-span-3">
        <input id={id("issuedAt")} name="issuedAt" type="date" defaultValue={toDateInput(doc?.issuedAt)} className={inputClass} />
      </Field>
      <Field label="Организация" name="organization" id={id("organization")} className="col-span-12">
        <input id={id("organization")} name="organization" defaultValue={doc?.organization ?? ""} className={inputClass} />
      </Field>
      <Field label="Специальность" name="specialty" id={id("specialty")} className="col-span-12 sm:col-span-6">
        <input id={id("specialty")} name="specialty" defaultValue={doc?.specialty ?? ""} className={inputClass} />
      </Field>
      <Field label="Квалификация" name="qualification" id={id("qualification")} className="col-span-12 sm:col-span-6">
        <input id={id("qualification")} name="qualification" defaultValue={doc?.qualification ?? ""} className={inputClass} />
      </Field>
      <Field label="Примечание" name="note" id={id("note")} className="col-span-12 sm:col-span-9">
        <input id={id("note")} name="note" defaultValue={doc?.note ?? ""} className={inputClass} />
      </Field>
      <Field label="Порядок" name="sortOrder" id={id("sortOrder")} className="col-span-12 sm:col-span-3">
        <input id={id("sortOrder")} name="sortOrder" type="number" required defaultValue={doc?.sortOrder ?? 0} className={inputClass} />
      </Field>
      <div className="col-span-12">
        <SubmitButton size="sm">{doc ? "Сохранить документ" : "Добавить документ"}</SubmitButton>
      </div>
    </ActionForm>
  );
}
