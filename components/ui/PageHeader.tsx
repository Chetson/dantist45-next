import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type Crumb = { href: string; label: string };

type Props = {
  title: string;
  lead?: ReactNode;
  /** Промежуточные крошки между «Главная» и текущей страницей */
  crumbs?: Crumb[];
  current?: string;
  /** Имена людей и названия статей не переводим в строчные. */
  keepCase?: boolean;
};

export function PageHeader({ title, lead, crumbs = [], current, keepCase }: Props) {
  return (
    <section className="container-page pt-10 pb-12 sm:pt-14 sm:pb-16">
      <nav aria-label="Навигационная цепочка" className="mb-8 sm:mb-10">
        <ol className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-white/70 px-4 py-2 text-sm leading-6 text-muted">
          <li>
            <Link href="/" className="hover:text-brand-deep">
              Главная
            </Link>
          </li>
          {crumbs.map((crumb) => (
            <li key={crumb.href} className="flex items-center gap-2">
              <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
              <Link href={crumb.href} className="hover:text-brand-deep">
                {crumb.label}
              </Link>
            </li>
          ))}
          {current && (
            <li className="flex min-w-0 items-center gap-2 text-brand-deep">
              <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
              <span aria-current="page" className="truncate">
                {current}
              </span>
            </li>
          )}
        </ol>
      </nav>
      <div className="grid grid-cols-12 gap-x-4 gap-y-6 sm:gap-x-6">
        <h1
          className={`type-h1 col-span-12 text-balance text-brand-deep lg:col-span-10 ${keepCase ? "normal-case" : ""}`}
        >
          {title}
        </h1>
        {lead && (
          <div className="type-lead col-span-12 text-foreground/80 md:col-span-10 lg:col-span-7">{lead}</div>
        )}
      </div>
    </section>
  );
}
