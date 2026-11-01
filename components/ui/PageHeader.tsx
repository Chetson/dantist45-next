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
  /** Имена людей и адреса не переводим в строчные. */
  keepCase?: boolean;
};

export function PageHeader({ title, lead, crumbs = [], current, keepCase }: Props) {
  return (
    <section className="container-page pt-8 pb-10 sm:pt-12 sm:pb-14">
      <nav aria-label="Навигационная цепочка" className="mb-8">
        <ol className="inline-flex flex-wrap items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm text-muted">
          <li>
            <Link href="/" className="hover:text-brand-deep">
              Главная
            </Link>
          </li>
          {crumbs.map((crumb) => (
            <li key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <Link href={crumb.href} className="hover:text-brand-deep">
                {crumb.label}
              </Link>
            </li>
          ))}
          {current && (
            <li className="flex items-center gap-1.5 text-brand-deep">
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <span aria-current="page">{current}</span>
            </li>
          )}
        </ol>
      </nav>
      <h1
        className={`heading-xl max-w-4xl text-4xl text-brand-deep sm:text-6xl ${keepCase ? "normal-case" : ""}`}
      >
        {title}
      </h1>
      {lead && <div className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">{lead}</div>}
    </section>
  );
}
