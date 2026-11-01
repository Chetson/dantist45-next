import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone, Users } from "lucide-react";
import type { getClinics } from "@/lib/data/site";
import { mapLinks } from "@/lib/data/site";
import { formatPhone, plural } from "@/lib/format";

type Clinic = Awaited<ReturnType<typeof getClinics>>[number];

export function ClinicSchedule({ schedule }: { schedule: Clinic["schedule"] }) {
  if (schedule.length === 0) {
    return <p className="text-muted">Режим работы уточняйте по телефону</p>;
  }
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
      {schedule.map((row) => (
        <div key={row.id} className="contents">
          <dt className="text-muted">{row.days}</dt>
          <dd className="font-medium">
            {row.opensAt && row.closesAt ? `${row.opensAt} — ${row.closesAt}` : "выходной"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ClinicCard({ clinic }: { clinic: Clinic }) {
  const maps = mapLinks(clinic.address);
  const staffCount = clinic._count.staff;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-white p-7">
      <h3 className="font-display text-2xl text-brand-deep">{clinic.name}</h3>

      <ul className="mt-5 space-y-4 text-[15px]">
        <li className="flex gap-3">
          <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p>{clinic.address}</p>
            <p className="mt-1 flex gap-3 text-sm">
              <a href={maps.yandex} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                Яндекс Карты
              </a>
              <a href={maps.twoGis} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                2ГИС
              </a>
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <Phone className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          {clinic.phones.length > 0 ? (
            <div className="flex flex-col gap-1">
              {clinic.phones.map((phone) => (
                <a key={phone.id} href={`tel:${phone.number}`} className="font-medium hover:text-brand">
                  {formatPhone(phone.number)}
                  <span className="ml-2 text-sm font-normal text-muted">{phone.label}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted">Телефон филиала уточняется</p>
          )}
        </li>
        <li className="flex gap-3">
          <Clock className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          <ClinicSchedule schedule={clinic.schedule} />
        </li>
        {staffCount > 0 && (
          <li className="flex gap-3">
            <Users className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
            <p>
              {staffCount} {plural(staffCount, ["специалист", "специалиста", "специалистов"])}
            </p>
          </li>
        )}
      </ul>

      <Link
        href={`/clinics/${clinic.slug}`}
        className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand hover:gap-2.5"
      >
        Подробнее о филиале
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
