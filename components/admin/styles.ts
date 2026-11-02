// Классы полей админки. Отдельный модуль без "use client": строки нужны
// и серверным, и клиентским компонентам.

export const inputClass =
  "block w-full rounded-xl bg-white/90 px-3.5 py-2.5 text-[15px] text-foreground ring-1 ring-line outline-none transition placeholder:text-muted/70 focus:ring-2 focus:ring-brand aria-invalid:ring-critical";

export const labelClass = "text-sm font-semibold text-brand-deep";

export const checkboxClass = "size-4.5 shrink-0 rounded accent-brand";

/** Компактная кнопка-ссылка в строках таблиц. */
export const linkButtonClass =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-brand-deep ring-1 ring-line transition hover:bg-white hover:ring-brand";

export const dangerButtonClass =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-critical ring-1 ring-critical/30 transition hover:bg-critical-soft";
