"use client";

import { createContext, startTransition, use, useActionState, useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import type { FormState } from "@/lib/admin/form";
import { buttonClass } from "@/components/ui/button";
import { checkboxClass, dangerButtonClass, labelClass } from "./styles";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

const FormStateContext = createContext<FormState>(null);
const FormPendingContext = createContext(false);

/** Форма с Server Action: ошибки полей и общее сообщение — из возвращённого состояния. */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess,
}: {
  action: Action;
  children: ReactNode;
  className?: string;
  /** Очистить поля после успешной отправки (формы добавления в списках). */
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && state?.message) formRef.current?.reset();
  }, [resetOnSuccess, state]);

  return (
    <FormStateContext value={state}>
      <FormPendingContext value={pending}>
        {/* action — отправка до гидратации; после неё onSubmit отправляет сам:
            иначе React сбросит поля, и при ошибке валидации введённое пропадёт. */}
        <form
          ref={formRef}
          action={formAction}
          aria-busy={pending}
          className={className ?? "grid gap-5"}
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget, (event.nativeEvent as SubmitEvent).submitter);
            startTransition(() => formAction(formData));
          }}
        >
          {state?.error && (
            <p role="alert" className="rounded-xl bg-critical-soft px-4 py-3 text-sm font-medium text-critical">
              {state.error}
            </p>
          )}
          {state?.message && (
            <p role="status" className="rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-brand-deep">
              {state.message}
            </p>
          )}
          {children}
        </form>
      </FormPendingContext>
    </FormStateContext>
  );
}

/** Подпись, поле и его ошибки. */
export function Field({
  label,
  name,
  id = name,
  hint,
  children,
  className,
}: {
  label: string;
  name: string;
  /** id поля, если отличается от name (несколько форм на странице). */
  id?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const errors = use(FormStateContext)?.fieldErrors?.[name];
  return (
    <div className={`grid content-start gap-1.5 ${className ?? ""}`}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && !errors && <p className="text-xs text-muted">{hint}</p>}
      {errors?.map((error) => (
        <p key={error} className="text-xs font-medium text-critical">
          {error}
        </p>
      ))}
    </div>
  );
}

export function CheckboxField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2.5 text-[15px]">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className={checkboxClass} />
      {label}
    </label>
  );
}

export function SubmitButton({ children, size = "md" }: { children: ReactNode; size?: "sm" | "md" }) {
  // Внутри ActionForm — его состояние; в обычной <form action> — useFormStatus.
  const status = useFormStatus();
  const pending = use(FormPendingContext) || status.pending;
  return (
    <button type="submit" disabled={pending} className={`${buttonClass("primary", size)} disabled:opacity-60`}>
      {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

/** Кнопка отправки с подтверждением — для удаления и других необратимых действий. */
export function ConfirmButton({
  children,
  confirm: question,
  className,
}: {
  children: ReactNode;
  confirm: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className ?? dangerButtonClass} disabled:opacity-60`}
      onClick={(event) => {
        if (!window.confirm(question)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
