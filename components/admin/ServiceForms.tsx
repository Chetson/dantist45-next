import type { Service, ServiceArticle, ServiceCategory } from "@/generated/prisma/client";
import type { FormState } from "@/lib/admin/form";
import { categoryIconLabels } from "@/lib/admin/labels";
import { categoryIconNames } from "@/components/ui/icons";
import { ActionForm, CheckboxField, Field, SubmitButton } from "./form";
import { inputClass } from "./styles";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

export function CategoryForm({ action, category }: { action: Action; category?: ServiceCategory }) {
  return (
    <ActionForm action={action} className="grid grid-cols-12 gap-4 sm:gap-6">
      <Field label="Название" name="name" className="col-span-12 sm:col-span-8">
        <input id="name" name="name" required defaultValue={category?.name} className={inputClass} />
      </Field>
      <Field label="Иконка" name="icon" className="col-span-12 sm:col-span-4">
        <select id="icon" name="icon" defaultValue={category?.icon ?? "tooth"} className={inputClass}>
          {categoryIconNames.map((name) => (
            <option key={name} value={name}>
              {categoryIconLabels[name] ?? name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Краткое описание" name="summary" className="col-span-12">
        <textarea id="summary" name="summary" rows={2} defaultValue={category?.summary ?? ""} className={inputClass} />
      </Field>
      <Field label="Адрес раздела" name="slug" hint="Пусто — из названия" className="col-span-12 sm:col-span-6">
        <input id="slug" name="slug" defaultValue={category?.slug ?? ""} className={inputClass} />
      </Field>
      <Field label="Порядок" name="sortOrder" className="col-span-6 sm:col-span-2">
        <input id="sortOrder" name="sortOrder" type="number" required defaultValue={category?.sortOrder ?? 0} className={inputClass} />
      </Field>
      <div className="col-span-12 flex flex-wrap gap-x-8 gap-y-3">
        <CheckboxField name="isPublished" label="Опубликован" defaultChecked={category?.isPublished ?? true} />
        <CheckboxField name="showOnHome" label="Показывать на главной" defaultChecked={category?.showOnHome} />
      </div>
      <div className="col-span-12">
        <SubmitButton>{category ? "Сохранить раздел" : "Добавить раздел"}</SubmitButton>
      </div>
    </ActionForm>
  );
}

/** Строка прайса. */
export function ServiceRowForm({ action, service }: { action: Action; service?: Service }) {
  const id = (name: string) => `${name}-${service?.id ?? "new"}`;
  return (
    <ActionForm action={action} resetOnSuccess={!service} className="grid grid-cols-12 gap-4">
      <Field label="Название услуги" name="name" id={id("name")} className="col-span-12 sm:col-span-9">
        <input id={id("name")} name="name" required defaultValue={service?.name} className={inputClass} />
      </Field>
      <Field label="Код (804н)" name="code" id={id("code")} className="col-span-12 sm:col-span-3">
        <input id={id("code")} name="code" placeholder="A16.07.002" defaultValue={service?.code ?? ""} className={inputClass} />
      </Field>
      <Field label="Цена от, ₽" name="priceFrom" id={id("priceFrom")} className="col-span-6 sm:col-span-3">
        <input id={id("priceFrom")} name="priceFrom" type="number" min={0} required defaultValue={service?.priceFrom} className={inputClass} />
      </Field>
      <Field label="Цена до, ₽" name="priceTo" id={id("priceTo")} hint="Для «от … до …»" className="col-span-6 sm:col-span-3">
        <input id={id("priceTo")} name="priceTo" type="number" min={0} defaultValue={service?.priceTo ?? ""} className={inputClass} />
      </Field>
      <Field label="Единица" name="unit" id={id("unit")} className="col-span-6 sm:col-span-3">
        <input id={id("unit")} name="unit" placeholder="за зуб" defaultValue={service?.unit ?? ""} className={inputClass} />
      </Field>
      <Field label="Порядок" name="sortOrder" id={id("sortOrder")} className="col-span-6 sm:col-span-3">
        <input id={id("sortOrder")} name="sortOrder" type="number" required defaultValue={service?.sortOrder ?? 0} className={inputClass} />
      </Field>
      <Field label="Примечание" name="note" id={id("note")} className="col-span-12">
        <input id={id("note")} name="note" defaultValue={service?.note ?? ""} className={inputClass} />
      </Field>
      <div className="col-span-12 flex flex-wrap items-center gap-6">
        <CheckboxField name="isPublished" label="Показывать в прайсе" defaultChecked={service?.isPublished ?? true} />
        <SubmitButton size="sm">{service ? "Сохранить строку" : "Добавить строку"}</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function ArticleForm({
  action,
  article,
  categories,
  defaultCategoryId,
}: {
  action: Action;
  article?: ServiceArticle;
  categories: Pick<ServiceCategory, "id" | "name">[];
  defaultCategoryId?: number;
}) {
  return (
    <ActionForm action={action} className="grid grid-cols-12 gap-4 sm:gap-6">
      <Field label="Заголовок" name="title" className="col-span-12 sm:col-span-8">
        <input id="title" name="title" required defaultValue={article?.title} className={inputClass} />
      </Field>
      <Field label="Раздел" name="categoryId" className="col-span-12 sm:col-span-4">
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={article?.categoryId ?? defaultCategoryId ?? ""}
          className={inputClass}
        >
          <option value="">— без раздела —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field
        label="Текст"
        name="body"
        hint="Markdown: «## Подзаголовок», **жирный**, списки через «- ». HTML не выводится."
        className="col-span-12"
      >
        <textarea id="body" name="body" rows={18} required defaultValue={article?.body} className={`${inputClass} font-mono text-sm`} />
      </Field>
      <Field label="Адрес статьи" name="slug" hint="Пусто — из заголовка" className="col-span-12 sm:col-span-6">
        <input id="slug" name="slug" defaultValue={article?.slug ?? ""} className={inputClass} />
      </Field>
      <Field label="Порядок" name="sortOrder" className="col-span-6 sm:col-span-2">
        <input id="sortOrder" name="sortOrder" type="number" required defaultValue={article?.sortOrder ?? 0} className={inputClass} />
      </Field>
      <div className="col-span-6 flex items-end pb-3 sm:col-span-4">
        <CheckboxField name="isPublished" label="Опубликована" defaultChecked={article?.isPublished ?? true} />
      </div>
      <div className="col-span-12">
        <SubmitButton>{article ? "Сохранить статью" : "Добавить статью"}</SubmitButton>
      </div>
    </ActionForm>
  );
}
