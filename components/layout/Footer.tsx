import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { getClinics, getOrganization, getRegulators } from "@/lib/data/site";
import { formatPhone } from "@/lib/format";
import { Logo } from "./Header";
import { mainNav } from "./nav";

function FooterTitle({ children }: { children: string }) {
  return <h2 className="mb-4 font-display text-lg font-extrabold tracking-tight text-brand-deep lowercase">{children}</h2>;
}

// Футер целиком зависит от данных БД, поэтому в layout обёрнут в <Suspense>.
export async function Footer() {
  const [organization, clinics, regulators] = await Promise.all([
    getOrganization(),
    getClinics(),
    getRegulators(),
  ]);

  return (
    <footer className="mt-auto px-3 pt-16 pb-4 text-sm sm:px-4">
      <div className="card mx-auto max-w-[82rem] px-6 py-10 sm:px-12 sm:py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_0.8fr]">
          <section className="space-y-5">
            <Logo />
            <p className="max-w-xs text-muted">
              Терапия, хирургия, ортопедия и гигиена полости рта. Работаем в Кургане с 2003 года.
            </p>
            {organization && (
              <div className="space-y-1 text-muted">
                <p className="text-brand-deep">{organization.fullName}</p>
                {organization.legalAddress && <p>{organization.legalAddress}</p>}
                <p>ОГРН {organization.ogrn}</p>
                <p>ИНН {organization.inn}</p>
                <Link href="/licenses" className="inline-block font-medium text-brand hover:underline">
                  Лицензия ЛО-45-01-001150
                </Link>
              </div>
            )}
          </section>

          <section>
            <FooterTitle>Филиалы</FooterTitle>
            <ul className="space-y-6 text-muted">
              {clinics.map((clinic) => (
                <li key={clinic.id} className="space-y-2">
                  <Link href={`/clinics/${clinic.slug}`} className="font-semibold text-brand-deep hover:text-brand">
                    {clinic.name}
                  </Link>
                  <p className="flex gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                    {clinic.address}
                  </p>
                  {clinic.phones.map((phone) => (
                    <a key={phone.id} href={`tel:${phone.number}`} className="flex gap-2 hover:text-brand-deep">
                      <Phone className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                      {formatPhone(phone.number)}
                    </a>
                  ))}
                  {clinic.schedule.length > 0 && (
                    <div className="flex gap-2">
                      <Clock className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                      <dl className="grid grid-cols-[auto_1fr] gap-x-3">
                        {clinic.schedule.map((row) => (
                          <div key={row.id} className="contents">
                            <dt>{row.days}</dt>
                            <dd>
                              {row.opensAt && row.closesAt ? `${row.opensAt} — ${row.closesAt}` : "выходной"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <FooterTitle>Контролирующие органы</FooterTitle>
            <ul className="space-y-4 text-muted">
              {regulators.map((regulator) => (
                <li key={regulator.id} className="space-y-1">
                  <p className="font-semibold text-brand-deep">{regulator.shortName}</p>
                  <p>{regulator.address}</p>
                  {regulator.phones.map((phone) => (
                    <a key={phone} href={`tel:${phone}`} className="block hover:text-brand-deep">
                      {formatPhone(phone)}
                    </a>
                  ))}
                </li>
              ))}
            </ul>
            <Link href="/regulators" className="mt-4 inline-block font-medium text-brand hover:underline">
              Все контакты и порядок обращения
            </Link>
          </section>

          <section>
            <FooterTitle>Разделы</FooterTitle>
            <ul className="space-y-2.5 text-brand-deep">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy" className="text-muted underline underline-offset-4 hover:text-brand">
                  Персональные данные
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-10 space-y-3 border-t border-line pt-6 text-xs text-muted">
          <p className="font-display text-base font-extrabold tracking-tight text-brand-deep">
            Имеются противопоказания. Необходима консультация специалиста.
          </p>
          <p className="max-w-4xl">
            Информация на сайте носит ознакомительный характер и не является медицинской
            рекомендацией. Цены, размещённые на сайте, не являются публичной офертой (ст. 437 ГК РФ).
            Медицинские услуги оказываются на основании договора; актуальную стоимость уточняйте
            в регистратуре.
          </p>
          <p>© 2003–{new Date().getFullYear()} Стоматология «Дантист»</p>
        </div>
      </div>
    </footer>
  );
}
