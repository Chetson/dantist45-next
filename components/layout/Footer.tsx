import Link from "next/link";
import { getOrganization } from "@/lib/data/site";
import { Logo } from "./Header";
import { mainNav } from "./nav";

// Компактный футер: навигация и обязательный минимум. Филиалы, контролирующие
// органы и правовые оговорки — на своих страницах (/clinics, /regulators,
// /services), сюда не дублируются. Реквизиты берутся из БД — поэтому в layout
// футер обёрнут в <Suspense>.
export async function Footer() {
  const organization = await getOrganization();

  return (
    <footer className="mt-auto pt-16 pb-4 sm:pt-20 sm:pb-6">
      <div className="container-page">
        <div className="card rounded-[2rem] px-5 py-6 sm:px-8 sm:py-7 lg:px-10">
          <div className="grid grid-cols-12 items-center gap-x-6 gap-y-5">
            <div className="col-span-12 lg:col-span-3">
              <Logo />
            </div>
            <nav aria-label="Разделы сайта" className="col-span-12 lg:col-span-9">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[15px] leading-6 font-medium text-brand-deep sm:flex sm:flex-wrap lg:justify-end">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-brand">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 text-sm leading-6 text-muted lg:flex-row lg:items-start lg:justify-between lg:gap-10">
            <p className="font-semibold text-brand-deep lg:whitespace-nowrap">
              Имеются противопоказания. Необходима консультация специалиста.
            </p>
            {/* Каждый пункт неразрывный: строка переносится только между пунктами. */}
            <ul className="flex flex-wrap gap-x-5 gap-y-1 *:whitespace-nowrap lg:justify-end">
              <li>
                © 2003–{new Date().getFullYear()} {organization?.shortName ?? "ООО «Дантист»"}
              </li>
              {organization && (
                <>
                  <li>ОГРН {organization.ogrn}</li>
                  <li>ИНН {organization.inn}</li>
                </>
              )}
              <li>
                <Link href="/licenses" className="hover:text-brand">
                  Лицензия ЛО-45-01-001150
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand">
                  Персональные данные
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
