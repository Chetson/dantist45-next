import Link from "next/link";
import { ArrowUpRight, Phone, Plus } from "lucide-react";
import { Suspense } from "react";
import { buttonClass, iconCircle } from "@/components/ui/button";
import { ToothIcon } from "@/components/ui/icons";
import { getStaff } from "@/lib/data/content";
import { getClinics } from "@/lib/data/site";
import { plural } from "@/lib/format";

function StatCard({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  return (
    <div className={`relative w-64 rounded-[1.75rem] bg-white/90 card-pad-sm shadow-xl shadow-brand-deep/10 ${className}`}>
      <p className="font-display text-3xl leading-none font-extrabold tracking-tight text-brand-deep">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{label}</p>
      <span className={`${iconCircle} absolute -bottom-4 left-8 size-8 ring-4 ring-white/60`}>
        <Plus className="size-4" aria-hidden="true" />
      </span>
    </div>
  );
}

/** Цифры клиники одной строкой — для экранов, где карточки справа не помещаются. */
async function StatsInline() {
  const [clinics, staff] = await Promise.all([getClinics(), getStaff()]);
  const doctors = staff.filter((s) => s.kind === "DOCTOR").length;
  const items = [
    { value: "2003", label: "год основания" },
    { value: `${doctors}`, label: plural(doctors, ["врач", "врача", "врачей"]) },
    { value: `${clinics.length}`, label: plural(clinics.length, ["филиал", "филиала", "филиалов"]) },
  ];
  return (
    <dl className="mt-10 grid grid-cols-3 gap-3 border-t border-white/25 pt-6 lg:hidden">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="sr-only">{item.label}</dt>
          <dd className="font-display text-2xl leading-none font-extrabold tracking-tight sm:text-3xl">{item.value}</dd>
          <dd className="mt-1.5 text-sm leading-5 text-white/85">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}

async function Stats() {
  const [clinics, staff] = await Promise.all([getClinics(), getStaff()]);
  const doctors = staff.filter((s) => s.kind === "DOCTOR").length;

  return (
    <div className="col-span-5 hidden flex-col justify-center gap-8 lg:flex">
      <StatCard value="с 2003" label="года заботимся о здоровье зубов жителей Кургана" className="self-start" />
      <StatCard
        value={`${doctors}`}
        label={`${plural(doctors, ["врач", "врача", "врачей"])} и зубных врачей ведут приём`}
        className="self-end"
      />
      <StatCard
        value={`${clinics.length}`}
        label={`${plural(clinics.length, ["филиал", "филиала", "филиалов"])} клиники в Кургане`}
        className="ml-12 self-start"
      />
    </div>
  );
}

export function Hero() {
  return (
    <section className="container-page pt-4 sm:pt-6">
      <div className="bg-sky-panel relative overflow-hidden rounded-[2.5rem] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-1/4 size-96 rounded-full bg-white/20 blur-3xl" />
          <ToothIcon className="absolute -right-16 -bottom-24 size-[34rem] stroke-[0.6] text-white/25" />
        </div>

        <div className="panel-pad relative grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <h1 className="type-display text-balance">
              бережное лечение зубов для всей семьи
            </h1>
            <p className="type-lead mt-6 max-w-xl text-white/90 sm:mt-8">
              Терапия, хирургия, ортопедия и профессиональная гигиена.{" "}
              <strong className="font-bold">Консультация, лечение и протезирование</strong> — у специалистов
              одной клиники.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/services" className={buttonClass("primary", "lg")}>
                Услуги и цены
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/clinics"
                className="inline-flex items-center gap-3 rounded-full bg-white/90 py-2 pr-6 pl-2 text-sm leading-tight text-muted transition-colors hover:bg-white"
              >
                <span className={`${iconCircle} size-10`}>
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                <span>
                  Запись на приём
                  <br />
                  по телефону филиала
                </span>
              </Link>
            </div>
            <Suspense>
              <StatsInline />
            </Suspense>
          </div>

          <Suspense>
            <Stats />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
