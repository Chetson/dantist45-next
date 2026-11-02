import type { Clinic, Staff, StaffClinic } from "@/generated/prisma/client";
import { StaffKind } from "@/generated/prisma/enums";
import type { FormState } from "@/lib/admin/form";
import { staffKindLabels } from "@/lib/admin/labels";
import { ActionForm, CheckboxField, Field, SubmitButton } from "./form";
import { checkboxClass, inputClass, labelClass } from "./styles";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  clinics: Pick<Clinic, "id" | "name">[];
  staff?: Staff & { clinics: StaffClinic[] };
};

export function StaffForm({ action, clinics, staff }: Props) {
  const positions = new Map(staff?.clinics.map((c) => [c.clinicId, c.position]));
  return (
    <ActionForm action={action} className="grid grid-cols-12 gap-4 sm:gap-6">
      <div className="col-span-12 grid gap-4 sm:grid-cols-3 sm:gap-6">
        <Field label="Фамилия" name="lastName">
          <input id="lastName" name="lastName" required defaultValue={staff?.lastName} className={inputClass} />
        </Field>
        <Field label="Имя" name="firstName">
          <input id="firstName" name="firstName" required defaultValue={staff?.firstName} className={inputClass} />
        </Field>
        <Field label="Отчество" name="middleName">
          <input id="middleName" name="middleName" defaultValue={staff?.middleName ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="Категория" name="kind" className="col-span-12 sm:col-span-4">
        <select id="kind" name="kind" defaultValue={staff?.kind ?? "DOCTOR"} className={inputClass}>
          {Object.values(StaffKind).map((kind) => (
            <option key={kind} value={kind}>
              {staffKindLabels[kind]}
            </option>
          ))}
        </select>
      </Field>
      <Field
        label="Специализации"
        name="specialties"
        hint="Для карточки: «стоматолог-ортопед, стоматолог-хирург»"
        className="col-span-12 sm:col-span-8"
      >
        <input id="specialties" name="specialties" defaultValue={staff?.specialties ?? ""} className={inputClass} />
      </Field>

      <fieldset className="col-span-12 grid gap-3">
        <legend className={`${labelClass} mb-1.5`}>Филиалы и должности</legend>
        {clinics.map((clinic) => (
          <div key={clinic.id} className="grid items-center gap-2 sm:grid-cols-[14rem_1fr] sm:gap-4">
            <label className="flex items-center gap-2.5 text-[15px]">
              <input
                type="checkbox"
                name={`clinic_${clinic.id}`}
                defaultChecked={positions.has(clinic.id)}
                className={checkboxClass}
              />
              {clinic.name}
            </label>
            <input
              name={`position_${clinic.id}`}
              aria-label={`Должность — ${clinic.name}`}
              placeholder="Должность, например «врач-стоматолог-терапевт»"
              defaultValue={positions.get(clinic.id) ?? ""}
              className={inputClass}
            />
          </div>
        ))}
      </fieldset>

      <Field label="О специалисте" name="bio" hint="Markdown: **жирный**, списки через «- »" className="col-span-12">
        <textarea id="bio" name="bio" rows={6} defaultValue={staff?.bio ?? ""} className={inputClass} />
      </Field>

      <Field
        label="Фото"
        name="photo"
        hint="JPEG, PNG или WebP до 5 МБ, лучше квадратное. Публикуется только с письменного согласия сотрудника (ст. 10.1 152-ФЗ)."
        className="col-span-12 sm:col-span-8"
      >
        <div className="flex items-center gap-4">
          {staff?.photo && (
            // eslint-disable-next-line @next/next/no-img-element -- превью загруженного файла
            <img src={staff.photo} alt="" className="size-16 shrink-0 rounded-full object-cover" />
          )}
          <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" />
        </div>
        {staff?.photo && <CheckboxField name="removePhoto" label="Удалить фото" />}
      </Field>

      <Field
        label="Адрес страницы"
        name="slug"
        hint="Пусто — из ФИО. Смена адреса ломает старые ссылки."
        className="col-span-12 sm:col-span-4"
      >
        <input id="slug" name="slug" defaultValue={staff?.slug ?? ""} className={inputClass} />
      </Field>

      <div className="col-span-12 flex flex-wrap items-end gap-x-8 gap-y-4">
        <CheckboxField name="isPublished" label="Опубликован" defaultChecked={staff?.isPublished ?? true} />
        <CheckboxField name="showOnHome" label="Показывать на главной" defaultChecked={staff?.showOnHome} />
        <Field label="Порядок" name="sortOrder" className="w-28">
          <input id="sortOrder" name="sortOrder" type="number" required defaultValue={staff?.sortOrder ?? 0} className={inputClass} />
        </Field>
      </div>

      <div className="col-span-12">
        <SubmitButton>{staff ? "Сохранить" : "Добавить сотрудника"}</SubmitButton>
      </div>
    </ActionForm>
  );
}
