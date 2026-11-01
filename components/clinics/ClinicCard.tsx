import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { iconCircle } from "@/components/ui/button";
import type { getClinics } from "@/lib/data/site";
import { mapLinks } from "@/lib/data/site";
import { formatPhone, plural } from "@/lib/format";

type Clinic = Awaited<ReturnType<typeof getClinics>>[number];

export function ClinicSchedule({ schedule, inverted }: { schedule: Clinic["schedule"]; inverted?: boolean }) {
  if (schedule.length === 0) {
    return <p className={inverted ? "text-white/85" : "text-muted"}>Режим работы уточняйте по телефону</p>;
  }
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
      {schedule.map((row) => (
        <div key={row.id} className="contents">
          <dt className={inverted ? "text-white/80" : "text-muted"}>{row.days}</dt>
          <dd className="font-semibold">
            {row.opensAt && row.closesAt ? `${row.opensAt} — ${row.closesAt}` : "выходной"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Филиал в духе блока «можете найти нас по адресу»: адрес + карточки «контакты» и «график». */
export function ClinicCard({ clinic }: { clinic: Clinic }) {
  const maps = mapLinks(clinic.address);
  const staffCount = clinic._count.staff;

  return (
    <article className="flex h-full flex-col gap-5">
      <div>
        <h3 className="type-h3 text-brand-deep lowercase sm:text-[2rem]">
          <Link href={`/clinics/${clinic.slug}`} className="hover:text-brand">
            {clinic.name}
          </Link>
        </h3>
        <div className="mt-5 grid grid-cols-[2.75rem_1fr] items-start gap-x-4">
          <span className={`${iconCircle} size-11`}>
            <MapPin className="size-5" aria-hidden="true" />
          </span>
          <div className="pt-1">
            <p>{clinic.address}</p>
            <p className="mt-1 flex flex-wrap gap-x-4 text-sm leading-6">
              <a href={maps.yandex} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
                Яндекс Карты
              </a>
              <a href={maps.twoGis} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
                2ГИС
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="grid flex-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="card card-pad-sm">
          <Phone className="size-5 text-brand-deep" aria-hidden="true" />
          <p className="type-h4 mt-6 text-brand-deep">контакты</p>
          {clinic.phones.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {clinic.phones.map((phone) => (
                <li key={phone.id}>
                  <a href={`tel:${phone.number}`} className="hover:text-brand">
                    {formatPhone(phone.number)}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-muted">Телефон филиала уточняется</p>
          )}
        </div>
        <div className="bg-sky-panel card-pad-sm rounded-[var(--radius-panel)] text-white shadow-lg shadow-accent-strong/30">
          <Clock className="size-5" aria-hidden="true" />
          <p className="type-h4 mt-6">график</p>
          <div className="mt-3">
            <ClinicSchedule schedule={clinic.schedule} inverted />
          </div>
        </div>
      </div>

      <Link
        href={`/clinics/${clinic.slug}`}
        className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand hover:gap-2.5"
      >
        {staffCount > 0
          ? `${staffCount} ${plural(staffCount, ["специалист", "специалиста", "специалистов"])} и лицензия филиала`
          : "Подробнее о филиале"}
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
