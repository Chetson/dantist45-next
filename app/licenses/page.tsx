import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { getLicenses } from "@/lib/data/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Лицензии",
  description: "Лицензия ООО «Дантист» на медицинскую деятельность и приложения к ней с перечнем работ и услуг.",
};

function Scan({ src, alt, pdf, eager }: { src: string; alt: string; pdf?: string | null; eager?: boolean }) {
  return (
    <figure className="space-y-3">
      <a
        href={src}
        target="_blank"
        rel="noopener"
        className="group relative block aspect-[1/1.41] overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-white"
      >
        <Image
          src={src}
          alt={alt}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1024px) 22rem, 90vw"
          className="object-contain transition-transform group-hover:scale-[1.02]"
        />
        <span className="absolute right-3 bottom-3 rounded-full bg-brand px-3 py-1 text-xs text-white">
          Открыть в полном размере
        </span>
      </a>
      {pdf && (
        <figcaption>
          <a href={pdf} download className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
            <Download className="size-4" aria-hidden="true" />
            Скачать PDF
          </a>
        </figcaption>
      )}
    </figure>
  );
}

async function LicensesList() {
  const licenses = await getLicenses();

  return (
    <div className="space-y-16">
      {licenses.map((license) => (
        <article key={license.id} className="space-y-10">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 *:col-span-12 *:min-w-0 lg:[&>*:first-child]:col-span-8 lg:[&>*:last-child]:col-span-4">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-brand uppercase">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Действующая лицензия
              </p>
              <h2 className="type-h2 text-brand-deep normal-case">
                Лицензия № {license.number}
              </h2>
              <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-[auto_1fr]">
                <dt className="text-muted">Дата выдачи</dt>
                <dd className="font-medium">{formatDate(license.issuedAt)}</dd>
                <dt className="text-muted">Выдана</dt>
                <dd className="font-medium">{license.issuer}</dd>
                <dt className="text-muted">Вид деятельности</dt>
                <dd>{license.activity}</dd>
                {license.blankNumber && (
                  <>
                    <dt className="text-muted">Бланк</dt>
                    <dd>{license.blankNumber}</dd>
                  </>
                )}
              </dl>
              <p className="mt-6 text-sm text-muted">
                Сведения о лицензии можно проверить в едином реестре лицензий Росздравнадзора.
                {license.registryUrl && (
                  <a
                    href={license.registryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center gap-1 text-brand hover:underline"
                  >
                    Запись в реестре
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                )}
              </p>
            </div>
            {license.scanImages[0] && (
              <Scan eager src={license.scanImages[0]} alt={`Скан лицензии № ${license.number}`} pdf={license.scanPdf} />
            )}
          </div>

          {license.annexes.map((annex) => (
            <section
              key={annex.id}
              aria-labelledby={`annex-${annex.id}`}
              className="card card-pad grid grid-cols-12 gap-x-6 gap-y-10 *:col-span-12 *:min-w-0 lg:[&>*:first-child]:col-span-8 lg:[&>*:last-child]:col-span-4"
            >
              <div>
                <h3 id={`annex-${annex.id}`} className="type-h3 text-brand-deep">
                  {annex.number}
                  {annex.blankNumber && <span className="ml-3 text-base font-sans text-muted">бланк {annex.blankNumber}</span>}
                </h3>
                <p className="mt-3 flex gap-2 font-medium">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                  {annex.clinic ? (
                    <Link href={`/clinics/${annex.clinic.slug}`} className="hover:text-brand">
                      {annex.address}
                    </Link>
                  ) : (
                    annex.address
                  )}
                </p>
                <h4 className="mt-6 mb-2 text-sm font-semibold tracking-wide text-muted uppercase">
                  Работы (услуги)
                </h4>
                <p className="leading-relaxed text-foreground/85">{annex.works}</p>
              </div>
              {annex.scanImages[0] && (
                <Scan src={annex.scanImages[0]} alt={`Скан: ${annex.number} к лицензии № ${license.number}`} pdf={annex.scanPdf} />
              )}
            </section>
          ))}
        </article>
      ))}
    </div>
  );
}

export default function LicensesPage() {
  return (
    <>
      <PageHeader
        title="Лицензии"
        current="Лицензии"
        lead="ООО «Дантист» осуществляет медицинскую деятельность на основании лицензии, выданной Департаментом здравоохранения Курганской области."
      />
      <div className="container-page">
        <Suspense fallback={<Skeleton className="h-[40rem]" />}>
          <LicensesList />
        </Suspense>
      </div>
    </>
  );
}
