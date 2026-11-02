import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

/** Заголовок страницы админки: ссылка «назад», название, действия справа. */
export function AdminHeader({
  title,
  back,
  actions,
  children,
}: {
  title: string;
  back?: { href: string; label: string };
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mb-6 grid gap-3 sm:mb-8">
      {back && (
        <Link href={back.href} className="inline-flex w-fit items-center gap-1 text-sm text-muted hover:text-brand-deep">
          <ChevronLeft className="size-4" aria-hidden="true" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="type-h2 text-brand-deep normal-case">{title}</h1>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children && <div className="text-muted">{children}</div>}
    </header>
  );
}

export function AdminCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card card-pad ${className ?? ""}`}>
      {title && <h2 className="type-h4 mb-5 text-brand-deep normal-case">{title}</h2>}
      {children}
    </section>
  );
}

const badgeTones = {
  neutral: "bg-surface-muted text-muted",
  success: "bg-accent-soft text-brand-deep",
  brand: "bg-brand-soft text-brand-deep",
  warning: "bg-warning-soft text-foreground",
  critical: "bg-critical-soft text-critical",
} as const;

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof badgeTones; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}

/** Таблица списка с горизонтальной прокруткой на узких экранах. */
export function AdminTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[40rem] text-left text-[15px]">
        <thead className="text-xs tracking-wide text-muted uppercase">
          <tr className="border-b border-line">
            {head.map((h, i) => (
              <th key={i} scope="col" className="px-4 py-3 font-semibold first:pl-6 last:pr-6">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70 [&_td]:px-4 [&_td]:py-3 [&_td:first-child]:pl-6 [&_td:last-child]:pr-6">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="card card-pad text-center text-muted">{children}</p>;
}

/** Ссылка на публичную страницу сайта — посмотреть результат правки. */
export function PublicLink({ href }: { href: string }) {
  return (
    <Link href={href} target="_blank" className="text-sm text-brand underline underline-offset-2">
      Открыть на сайте
    </Link>
  );
}
