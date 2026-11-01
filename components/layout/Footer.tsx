import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { iconCircle } from "@/components/ui/button";
import { getClinics, getOrganization, getRegulators } from "@/lib/data/site";
import { formatPhone } from "@/lib/format";
import { Logo } from "./Header";
import { mainNav } from "./nav";

function FooterTitle({ children }: { children: ReactNode }) {
  return <h2 className="type-eyebrow mb-5 text-muted">{children}</h2>;
}

/** Строка «иконка + текст» с одинаковым отступом и выравниванием по первой строке. */
function IconRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[1.25rem_1fr] gap-x-3">
      <span className="flex h-7 items-center text-brand">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

// Футер целиком зависит от данных БД, поэтому в layout обёрнут в <Suspense>.
// Структура — полосы на 12-колоночной сетке: о клинике и разделы → филиалы →
// контролирующие органы → правовая информация.
export async function Footer() {
  const [organization, clinics, regulators] = await Promise.all([
    getOrganization(),
    getClinics(),
    getRegulators(),
  ]);

  return (
    <footer className="mt-auto pt-16 pb-4 sm:pt-24 sm:pb-6">
      <div className="container-page">
        <div className="card card-pad text-[15px] leading-7">
          {/* ── О клинике и разделы ─────────────────────────────────── */}
          <div className="grid grid-cols-12 gap-x-4 gap-y-10 sm:gap-x-6">
            <section className="col-span-12 space-y-5 md:col-span-6 lg:col-span-4">
              <Logo />
              <p className="max-w-sm text-muted">
                Терапия, хирургия, ортопедия и гигиена полости рта. Работаем в Кургане с 2003 года.
              </p>
              <Link
                href="/clinics"
                className="inline-flex items-center gap-3 rounded-full bg-brand-soft py-1.5 pr-5 pl-1.5 font-semibold text-brand-deep transition-colors hover:bg-brand hover:text-white"
              >
                <span className={`${iconCircle} size-9`}>
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                Телефоны филиалов
              </Link>
            </section>

            <nav aria-labelledby="footer-nav" className="col-span-12 md:col-span-6 lg:col-span-4">
              <FooterTitle>
                <span id="footer-nav">Разделы</span>
              </FooterTitle>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-brand-deep">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-brand">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {organization && (
              <section className="col-span-12 lg:col-span-4">
                <FooterTitle>Сведения об организации</FooterTitle>
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                  <dt className="text-muted">Организация</dt>
                  <dd className="text-brand-deep">{organization.shortName}</dd>
                  <dt className="text-muted">ОГРН</dt>
                  <dd className="text-brand-deep">{organization.ogrn}</dd>
                  <dt className="text-muted">ИНН</dt>
                  <dd className="text-brand-deep">{organization.inn}</dd>
                  {organization.legalAddress && (
                    <>
                      <dt className="text-muted">Адрес</dt>
                      <dd className="text-brand-deep">{organization.legalAddress}</dd>
                    </>
                  )}
                  <dt className="text-muted">Лицензия</dt>
                  <dd>
                    <Link href="/licenses" className="font-medium text-brand hover:underline">
                      ЛО-45-01-001150
                    </Link>
                  </dd>
                </dl>
              </section>
            )}
          </div>

          {/* ── Филиалы ─────────────────────────────────────────────── */}
          <section className="mt-12 border-t border-line pt-10 sm:mt-14 sm:pt-12">
            <FooterTitle>Филиалы</FooterTitle>
            <ul className="grid grid-cols-12 gap-4 sm:gap-6">
              {clinics.map((clinic) => (
                <li
                  key={clinic.id}
                  className="col-span-12 space-y-4 rounded-[1.75rem] bg-surface-muted card-pad-sm md:col-span-6"
                >
                  <Link
                    href={`/clinics/${clinic.slug}`}
                    className="type-h4 inline-flex items-center gap-1.5 text-brand-deep hover:text-brand"
                  >
                    {clinic.name}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                  <IconRow icon={<MapPin className="size-4" aria-hidden="true" />}>
                    <p className="text-foreground/85">{clinic.address}</p>
                  </IconRow>
                  {clinic.phones.length > 0 && (
                    <IconRow icon={<Phone className="size-4" aria-hidden="true" />}>
                      <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                        {clinic.phones.map((phone) => (
                          <li key={phone.id}>
                            <a href={`tel:${phone.number}`} className="whitespace-nowrap text-brand-deep hover:text-brand">
                              {formatPhone(phone.number)}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </IconRow>
                  )}
                  <IconRow icon={<Clock className="size-4" aria-hidden="true" />}>
                    {clinic.schedule.length > 0 ? (
                      <dl className="grid grid-cols-[4.5rem_1fr] gap-y-1">
                        {clinic.schedule.map((row) => (
                          <div key={row.id} className="contents">
                            <dt className="text-muted">{row.days}</dt>
                            <dd className="text-brand-deep">
                              {row.opensAt && row.closesAt ? `${row.opensAt} — ${row.closesAt}` : "выходной"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="text-muted">Режим работы уточняйте по телефону</p>
                    )}
                  </IconRow>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Контролирующие органы ───────────────────────────────── */}
          <section className="mt-12 border-t border-line pt-10 sm:mt-14 sm:pt-12">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 className="type-eyebrow text-muted">Контролирующие органы</h2>
              <Link href="/regulators" className="inline-flex items-center gap-1.5 font-medium text-brand hover:underline">
                Порядок обращения
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="grid grid-cols-12 gap-x-4 gap-y-8 sm:gap-x-6">
              {regulators.map((regulator) => (
                <li key={regulator.id} className="col-span-12 space-y-1.5 md:col-span-4">
                  <p className="type-h4 text-brand-deep">{regulator.shortName}</p>
                  <p className="text-muted">{regulator.address}</p>
                  {regulator.phones.map((phone) => (
                    <a key={phone} href={`tel:${phone}`} className="block text-brand-deep hover:text-brand">
                      {formatPhone(phone)}
                    </a>
                  ))}
                </li>
              ))}
            </ul>
          </section>

          {/* ── Правовая информация ─────────────────────────────────── */}
          <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-5 border-t border-line pt-10 sm:mt-14 sm:gap-x-6 sm:pt-12">
            <p className="type-h4 col-span-12 text-brand-deep lg:col-span-4">
              Имеются противопоказания. Необходима консультация специалиста.
            </p>
            <p className="col-span-12 text-sm leading-6 text-muted lg:col-span-8">
              Информация на сайте носит ознакомительный характер и не является медицинской
              рекомендацией. Цены, размещённые на сайте, не являются публичной офертой
              (ст. 437 ГК РФ). Медицинские услуги оказываются на основании договора; актуальную
              стоимость уточняйте в регистратуре.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 text-sm leading-6 text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© 2003–{new Date().getFullYear()} Стоматология «Дантист»</p>
            <Link href="/privacy" className="underline underline-offset-4 hover:text-brand">
              Персональные данные
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
