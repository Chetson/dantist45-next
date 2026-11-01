import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { Suspense } from "react";
import { buttonClass } from "@/components/ui/button";
import { ToothIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { getStaff } from "@/lib/data/content";
import { getClinics } from "@/lib/data/site";
import { formatPhone, plural } from "@/lib/format";

async function Facts() {
  const [clinics, staff] = await Promise.all([getClinics(), getStaff()]);
  const doctors = staff.filter((s) => s.kind === "DOCTOR").length;
  const facts = [
    { value: "2003", label: "год основания клиники" },
    {
      value: String(clinics.length),
      label: `${plural(clinics.length, ["филиал", "филиала", "филиалов"])} в Кургане`,
    },
    {
      value: String(doctors),
      label: `${plural(doctors, ["врач", "врача", "врачей"])} и зубных врачей`,
    },
  ];

  return (
    <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt className="sr-only">{fact.label}</dt>
          <dd className="font-display text-3xl text-accent sm:text-4xl">{fact.value}</dd>
          <dd className="mt-1 text-sm text-white/65">{fact.label}</dd>
        </div>
      ))}
    </dl>
  );
}

async function ClinicsPanel() {
  const clinics = await getClinics();
  return (
    <ul className="space-y-4">
      {clinics.map((clinic) => {
        const phone = clinic.phones[0];
        const weekdays = clinic.schedule[0];
        return (
          <li key={clinic.id} className="rounded-2xl bg-white p-5 text-foreground shadow-lg shadow-brand-deep/20">
            <Link href={`/clinics/${clinic.slug}`} className="font-display text-lg text-brand-deep hover:text-brand">
              {clinic.name}
            </Link>
            <p className="mt-2 flex gap-2 text-sm text-muted">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              {clinic.address.replace(/^\d{6},\s*/, "")}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {phone && (
                <a href={`tel:${phone.number}`} className="flex items-center gap-2 font-semibold text-brand">
                  <Phone className="size-4" aria-hidden="true" />
                  {formatPhone(phone.number)}
                </a>
              )}
              {weekdays?.opensAt && (
                <span className="flex items-center gap-2 text-muted">
                  <Clock className="size-4 text-accent" aria-hidden="true" />
                  {weekdays.days}: {weekdays.opensAt}–{weekdays.closesAt}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-deep pb-24 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 size-[32rem] rounded-full bg-brand/60 blur-3xl" />
        <div className="absolute right-0 -bottom-40 size-[28rem] rounded-full bg-accent/20 blur-3xl" />
        <ToothIcon className="absolute top-10 right-[8%] size-[26rem] text-white/[0.04]" />
      </div>

      <div className="container-page relative grid items-center gap-12 pt-16 sm:pt-24 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent uppercase">
            <span className="size-1.5 rounded-full bg-accent" />
            Стоматология в Кургане с 2003 года
          </p>
          <h1 className="font-display text-4xl leading-[1.1] sm:text-6xl">
            Бережное лечение зубов для всей семьи
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">
            Терапия, хирургия, ортопедия и профессиональная гигиена. Консультация,
            лечение и протезирование — у специалистов одной клиники.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/services" className={buttonClass("accent", "lg")}>
              Услуги и цены
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/specialists" className={buttonClass("ghostLight", "lg")}>
              Наши специалисты
            </Link>
          </div>
          <Suspense fallback={<div className="mt-12 h-24 max-w-lg" />}>
            <Facts />
          </Suspense>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
          <p className="mb-4 px-1 text-sm font-semibold tracking-wide text-white/70 uppercase">
            Запись по телефону
          </p>
          <Suspense
            fallback={
              <div className="space-y-4">
                <Skeleton className="h-36 bg-white/10" />
                <Skeleton className="h-36 bg-white/10" />
              </div>
            }
          >
            <ClinicsPanel />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
