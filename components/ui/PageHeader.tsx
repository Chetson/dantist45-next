import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type Crumb = { href: string; label: string };

type Props = {
  title: ReactNode;
  lead?: ReactNode;
  /** Промежуточные крошки между «Главная» и текущей страницей */
  crumbs?: Crumb[];
  current?: string;
};

export function PageHeader({ title, lead, crumbs = [], current }: Props) {
  return (
    <section className="relative overflow-hidden bg-brand-deep text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="container-page relative py-12 sm:py-16">
        <nav aria-label="Навигационная цепочка" className="mb-5 text-sm text-white/60">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-white">
                Главная
              </Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden="true" />
                <Link href={crumb.href} className="hover:text-white">
                  {crumb.label}
                </Link>
              </li>
            ))}
            {current && (
              <li className="flex items-center gap-1.5 text-white/90">
                <ChevronRight className="size-3.5" aria-hidden="true" />
                <span aria-current="page">{current}</span>
              </li>
            )}
          </ol>
        </nav>
        <h1 className="max-w-3xl font-display text-3xl leading-tight sm:text-5xl">{title}</h1>
        {lead && <div className="mt-4 max-w-2xl text-base text-white/75 sm:text-lg">{lead}</div>}
      </div>
    </section>
  );
}
