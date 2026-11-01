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
    <div className={`relative w-60 rounded-[1.75rem] bg-white/90 p-5 shadow-xl shadow-brand-deep/10 ${className}`}>
      <p className="font-display text-3xl font-bold tracking-tight text-brand-deep">{value}</p>
      <p className="mt-1 text-sm leading-snug text-muted">{label}</p>
      <span className={`${iconCircle} absolute -bottom-4 left-8 size-8 ring-4 ring-white/60`}>
        <Plus className="size-4" aria-hidden="true" />
      </span>
    </div>
  );
}

async function Stats() {
  const [clinics, staff] = await Promise.all([getClinics(), getStaff()]);
  const doctors = staff.filter((s) => s.kind === "DOCTOR").length;

  return (
    <div className="hidden flex-col justify-center gap-8 lg:flex">
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
    <section className="px-3 pt-4 sm:px-4">
      <div className="bg-sky-panel relative mx-auto max-w-[82rem] overflow-hidden rounded-[2.5rem] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-1/4 size-96 rounded-full bg-white/20 blur-3xl" />
          <ToothIcon className="absolute -right-16 -bottom-24 size-[34rem] stroke-[0.6] text-white/25" />
        </div>

        <div className="relative grid gap-10 px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:px-16">
          <div>
            <h1 className="heading-xl text-5xl sm:text-7xl">
              бережное лечение зубов для всей семьи
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/90">
              Терапия, хирургия, ортопедия и профессиональная гигиена.{" "}
              <strong className="font-bold">Консультация, лечение и протезирование</strong> — у специалистов
              одной клиники.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
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
          </div>

          <Suspense>
            <Stats />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
