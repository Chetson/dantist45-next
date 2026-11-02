import type { Announcement, Clinic } from "@/generated/prisma/client";
import { AnnouncementLevel } from "@/generated/prisma/enums";
import { toDateTimeInput, type FormState } from "@/lib/admin/form";
import { announcementLevelLabels } from "@/lib/admin/labels";
import { ActionForm, CheckboxField, Field, SubmitButton } from "./form";
import { checkboxClass, inputClass, labelClass } from "./styles";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  clinics: Pick<Clinic, "id" | "name">[];
  announcement?: Announcement & { clinics: Pick<Clinic, "id">[] };
};

export function AnnouncementForm({ action, clinics, announcement }: Props) {
  const selected = new Set(announcement?.clinics.map((c) => c.id));
  return (
    <ActionForm action={action} className="grid grid-cols-12 gap-4 sm:gap-6">
      <Field label="Заголовок" name="title" className="col-span-12 sm:col-span-8">
        <input id="title" name="title" required defaultValue={announcement?.title} className={inputClass} />
      </Field>
      <Field label="Уровень" name="level" className="col-span-12 sm:col-span-4">
        <select id="level" name="level" defaultValue={announcement?.level ?? "INFO"} className={inputClass}>
          {Object.values(AnnouncementLevel).map((level) => (
            <option key={level} value={level}>
              {announcementLevelLabels[level]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Текст" name="body" hint="Markdown: **жирный**, [ссылка](https://…), списки через «- »" className="col-span-12">
        <textarea id="body" name="body" rows={5} required defaultValue={announcement?.body} className={inputClass} />
      </Field>
      <Field label="Показывать с" name="startsAt" hint="Время Кургана. Пусто — сразу" className="col-span-12 sm:col-span-4">
        <input id="startsAt" name="startsAt" type="datetime-local" defaultValue={toDateTimeInput(announcement?.startsAt)} className={inputClass} />
      </Field>
      <Field label="Показывать до" name="endsAt" hint="Пусто — без срока" className="col-span-12 sm:col-span-4">
        <input id="endsAt" name="endsAt" type="datetime-local" defaultValue={toDateTimeInput(announcement?.endsAt)} className={inputClass} />
      </Field>
      <Field label="Порядок" name="sortOrder" className="col-span-12 sm:col-span-4">
        <input id="sortOrder" name="sortOrder" type="number" required defaultValue={announcement?.sortOrder ?? 0} className={inputClass} />
      </Field>
      <fieldset className="col-span-12">
        <legend className={`${labelClass} mb-2`}>Филиалы</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {clinics.map((clinic) => (
            <label key={clinic.id} className="flex items-center gap-2.5 text-[15px]">
              <input type="checkbox" name="clinics" value={clinic.id} defaultChecked={selected.has(clinic.id)} className={checkboxClass} />
              {clinic.name}
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted">Ни один не отмечен — уведомление для всех филиалов.</p>
      </fieldset>
      <div className="col-span-12 flex flex-wrap items-center gap-6">
        <CheckboxField name="isActive" label="Включено" defaultChecked={announcement?.isActive ?? true} />
        <SubmitButton>{announcement ? "Сохранить" : "Добавить уведомление"}</SubmitButton>
      </div>
    </ActionForm>
  );
}
