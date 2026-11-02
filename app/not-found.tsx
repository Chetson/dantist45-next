import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { ToothIcon } from "@/components/ui/icons";
import { mainNav } from "@/components/layout/nav";
import { SiteShell } from "@/components/layout/SiteShell";

// Корневая 404 рендерится вне группы (site), поэтому оболочку сайта добавляем сами.
export default function NotFound() {
  return (
    <SiteShell>
    <section className="container-page flex flex-col items-center py-24 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-brand text-white glow">
        <ToothIcon className="size-10" />
      </span>
      <p className="mt-8 font-display text-7xl leading-none font-extrabold tracking-tight text-brand">404</p>
      <h1 className="mt-3 type-h2 text-brand-deep normal-case">Страница не найдена</h1>
      <p className="mt-4 max-w-md text-muted">
        Возможно, страница была перемещена или вы ошиблись в адресе. Воспользуйтесь разделами сайта:
      </p>
      <ul className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
        {mainNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-full bg-white/70 ring-1 ring-white px-4 py-2 text-sm hover:text-brand"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/" className={`${buttonClass("primary", "lg")} mt-10`}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        На главную
      </Link>
    </section>
    </SiteShell>
  );
}
