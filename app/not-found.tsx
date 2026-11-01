import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { ToothIcon } from "@/components/ui/icons";
import { mainNav } from "@/components/layout/nav";

export default function NotFound() {
  return (
    <section className="container-page flex flex-col items-center py-24 text-center">
      <span className="flex size-20 items-center justify-center rounded-3xl bg-brand-soft text-brand">
        <ToothIcon className="size-10" />
      </span>
      <p className="mt-8 font-display text-6xl text-accent">404</p>
      <h1 className="mt-3 font-display text-3xl text-brand-deep">Страница не найдена</h1>
      <p className="mt-4 max-w-md text-muted">
        Возможно, страница была перемещена или вы ошиблись в адресе. Воспользуйтесь разделами сайта:
      </p>
      <ul className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
        {mainNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-full border border-line px-4 py-2 text-sm hover:border-brand hover:text-brand"
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
  );
}
