import Link from "next/link";
import { getClinics, getOrganization, getRegulators } from "@/lib/data/site";
import { formatPhone } from "@/lib/format";
import { mainNav } from "./nav";

export async function Footer() {
  // Кэшируем весь футер: иначе new Date() (год в копирайте) делает его динамическим.
  "use cache";
  const [organization, clinics, regulators] = await Promise.all([
    getOrganization(),
    getClinics(),
    getRegulators(),
  ]);

  return (
    <footer className="mt-auto border-t border-line bg-surface-muted text-sm">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <section>
          <h2 className="mb-3 font-semibold">Филиалы</h2>
          <ul className="space-y-5">
            {clinics.map((clinic) => (
              <li key={clinic.id} className="space-y-1">
                <p className="font-medium">{clinic.name}</p>
                <p className="text-muted">{clinic.address}</p>
                {clinic.phones.map((phone) => (
                  <a
                    key={phone.id}
                    href={`tel:${phone.number}`}
                    className="block hover:text-brand"
                  >
                    {formatPhone(phone.number)}
                  </a>
                ))}
                {clinic.schedule.length > 0 && (
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 text-muted">
                    {clinic.schedule.map((row) => (
                      <div key={row.id} className="contents">
                        <dt>{row.days}</dt>
                        <dd>
                          {row.opensAt && row.closesAt
                            ? `${row.opensAt} — ${row.closesAt}`
                            : "выходной"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">Контролирующие органы</h2>
          <ul className="space-y-4">
            {regulators.map((regulator) => (
              <li key={regulator.id} className="space-y-1">
                <p className="font-medium">{regulator.shortName}</p>
                <p className="text-muted">{regulator.address}</p>
                {regulator.phones.map((phone) => (
                  <a key={phone} href={`tel:${phone}`} className="block hover:text-brand">
                    {formatPhone(phone)}
                  </a>
                ))}
              </li>
            ))}
          </ul>
          <Link href="/regulators" className="mt-3 inline-block text-brand hover:underline">
            Подробнее
          </Link>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">Разделы</h2>
          <ul className="space-y-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="hover:text-brand">
                Политика обработки персональных данных
              </Link>
            </li>
          </ul>
        </section>

        {organization && (
          <section className="space-y-1">
            <h2 className="mb-3 font-semibold">{organization.shortName}</h2>
            {organization.legalAddress && (
              <p className="text-muted">{organization.legalAddress}</p>
            )}
            <p>ОГРН {organization.ogrn}</p>
            <p>ИНН {organization.inn}</p>
            <Link href="/licenses" className="inline-block text-brand hover:underline">
              Лицензии
            </Link>
          </section>
        )}
      </div>

      <div className="border-t border-line">
        <div className="container-page space-y-3 py-6 text-xs text-muted">
          <p className="text-sm font-semibold text-foreground">
            Имеются противопоказания. Необходима консультация специалиста.
          </p>
          <p>
            Информация на сайте носит ознакомительный характер и не является
            медицинской рекомендацией. Цены, размещённые на сайте, не являются
            публичной офертой (ст. 437 ГК РФ). Услуги оказываются на основании
            договора; актуальную стоимость уточняйте в регистратуре.
          </p>
          <p>© 2003–{new Date().getFullYear()} Стоматология «Дантист»</p>
        </div>
      </div>
    </footer>
  );
}
