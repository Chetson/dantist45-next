import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import { ClinicSchedule } from "@/components/clinics/ClinicCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { getClinic, mapLinks } from "@/lib/data/site";
import { formatDate, formatPhone, fullName, initials } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/clinics/[slug]">): Promise<Metadata> {
  const clinic = await getClinic((await params).slug);
  if (!clinic) notFound();
  return {
    title: clinic.name,
    description: `${clinic.name} стоматологии «Дантист»: ${clinic.address}. Телефоны, режим работы, специалисты.`,
  };
}

async function ClinicDetails({ slug }: { slug: string }) {
  const clinic = await getClinic(slug);
  if (!clinic) notFound();
  const maps = mapLinks(clinic.address);

  return (
    <>
      <PageHeader
        title={clinic.name}
        crumbs={[{ href: "/clinics", label: "Филиалы" }]}
        current={clinic.name}
        lead={clinic.address}
      />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[22rem_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-5 rounded-3xl bg-brand-deep p-7 text-white">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p>{clinic.address}</p>
                <p className="mt-2 flex gap-4 text-sm">
                  <a href={maps.yandex} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    Яндекс Карты
                  </a>
                  <a href={maps.twoGis} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    2ГИС
                  </a>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              {clinic.phones.length > 0 ? (
                <ul className="space-y-1">
                  {clinic.phones.map((phone) => (
                    <li key={phone.id}>
                      <a href={`tel:${phone.number}`} className="font-semibold hover:text-accent">
                        {formatPhone(phone.number)}
                      </a>
                      <span className="ml-2 text-sm text-white/60">{phone.label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/70">Телефон филиала уточняется</p>
              )}
            </div>
            <div className="flex gap-3 [&_dt]:text-white/60">
              <Clock className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <ClinicSchedule schedule={clinic.schedule} />
            </div>
          </div>
        </aside>

        <div className="space-y-14">
          {clinic.staff.length > 0 && (
            <section aria-labelledby="staff-title">
              <h2 id="staff-title" className="mb-6 font-display text-2xl text-brand-deep sm:text-3xl">
                Специалисты филиала
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {clinic.staff.map(({ staff, position }) => (
                  <li key={staff.id}>
                    <Link
                      href={`/specialists/${staff.slug}`}
                      className="flex items-center gap-4 rounded-2xl border border-line p-4 transition-colors hover:border-brand hover:bg-brand-soft/40"
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent font-display text-white"
                      >
                        {initials(staff)}
                      </span>
                      <span>
                        <span className="block font-medium">{fullName(staff)}</span>
                        <span className="block text-sm text-muted first-letter:uppercase">{position}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="license-title">
            <h2 id="license-title" className="mb-6 font-display text-2xl text-brand-deep sm:text-3xl">
              Лицензия по этому адресу
            </h2>
            {clinic.licenseAnnexes.length > 0 ? (
              clinic.licenseAnnexes.map((annex) => (
                <article key={annex.id} className="rounded-3xl border border-line p-7">
                  <p className="flex items-center gap-2 font-semibold text-brand">
                    <ShieldCheck className="size-5 text-accent" aria-hidden="true" />
                    {annex.number} к лицензии № {annex.license.number} от {formatDate(annex.license.issuedAt)}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">{annex.works}</p>
                  <Link
                    href="/licenses"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:gap-2.5"
                  >
                    Сканы лицензии и приложений
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </article>
              ))
            ) : (
              <p className="rounded-2xl bg-surface-muted p-5 text-muted">
                Приложение к лицензии для этого адреса будет опубликовано в ближайшее время.
                Все сведения о лицензии — в разделе{" "}
                <Link href="/licenses" className="text-brand underline">
                  «Лицензии»
                </Link>
                .
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default function ClinicPage({ params }: PageProps<"/clinics/[slug]">) {
  return (
    <Suspense
      fallback={
        <>
          <div className="h-56 bg-brand-deep" />
          <div className="container-page grid gap-10 py-14 lg:grid-cols-[22rem_1fr]">
            <Skeleton className="h-80" />
            <Skeleton className="h-96" />
          </div>
        </>
      }
    >
      {params.then(({ slug }) => (
        <ClinicDetails slug={slug} />
      ))}
    </Suspense>
  );
}
