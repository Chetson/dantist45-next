import type { Metadata } from "next";
import { ExternalLink, Globe, Landmark, Mail, MapPin, Phone, PhoneCall } from "lucide-react";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGridSkeleton } from "@/components/ui/Skeleton";
import { getOrganization, getRegulators } from "@/lib/data/site";
import { formatPhone } from "@/lib/format";

export const metadata: Metadata = {
  title: "Контролирующие органы",
  description:
    "Адреса и телефоны органов, контролирующих работу стоматологии «Дантист»: Росздравнадзор, Роспотребнадзор, Департамент здравоохранения Курганской области.",
};

async function Regulators() {
  const regulators = await getRegulators();
  return (
    <ul className="grid gap-6 lg:grid-cols-3">
      {regulators.map((r) => (
        <li key={r.id} className="flex flex-col rounded-3xl border border-line bg-white p-7">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <Landmark className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-2xl text-brand-deep">{r.shortName}</h2>
          <p className="mt-2 text-sm text-muted">{r.name}</p>
          {r.description && <p className="mt-4 rounded-xl bg-surface-muted px-4 py-3 text-sm">{r.description}</p>}
          <ul className="mt-5 space-y-3 text-[15px]">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              {r.address}
            </li>
            {r.phones.map((phone) => (
              <li key={phone} className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <a href={`tel:${phone}`} className="font-medium hover:text-brand">
                  {formatPhone(phone)}
                </a>
              </li>
            ))}
            {r.hotline && (
              <li className="flex gap-3">
                <PhoneCall className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <a href={`tel:${r.hotline}`} className="font-medium hover:text-brand">
                    {formatPhone(r.hotline)}
                  </a>
                  <span className="block text-sm text-muted">горячая линия, звонок бесплатный</span>
                </span>
              </li>
            )}
            {r.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <a href={`mailto:${r.email}`} className="hover:text-brand">
                  {r.email}
                </a>
              </li>
            )}
            {r.receptionHours && (
              <li className="text-sm text-muted">Приём граждан: {r.receptionHours}</li>
            )}
          </ul>
          {r.website && (
            <a
              href={r.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-brand hover:underline"
            >
              <Globe className="size-4" aria-hidden="true" />
              Официальный сайт
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

async function Director() {
  const organization = await getOrganization();
  if (!organization?.director) return null;
  return (
    <p>
      Заведующий медицинской организацией — <strong className="font-semibold">{organization.director}</strong>.
      Обратиться к нему можно через регистратуру любого филиала.
    </p>
  );
}

const steps = [
  {
    title: "Обратитесь в клинику",
    text: "Большинство вопросов решается на месте. Сообщите о проблеме администратору или попросите о встрече с заведующим.",
  },
  {
    title: "Напишите претензию",
    text: "Письменную претензию можно передать в регистратуру. Клиника обязана рассмотреть её в установленный законом срок.",
  },
  {
    title: "Обратитесь в контролирующий орган",
    text: "Если вопрос не решён, обратитесь в один из органов ниже — лично, по телефону или через официальный сайт.",
  },
];

export default function RegulatorsPage() {
  return (
    <>
      <PageHeader
        title="Контролирующие органы"
        current="Контролирующие органы"
        lead="Если вы считаете, что при оказании медицинской помощи были нарушены ваши права, вы можете обратиться в органы, контролирующие работу клиники."
      />
      <div className="container-page space-y-14 py-14">
        <section aria-labelledby="steps-title" className="rounded-[2rem] bg-brand-soft p-7 sm:p-10">
          <h2 id="steps-title" className="font-display text-2xl text-brand-deep sm:text-3xl">
            Как защитить свои права
          </h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand font-display text-lg text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-brand-deep">{step.title}</h3>
                  <p className="mt-1 text-sm text-foreground/75">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-sm text-foreground/80">
            <Suspense>
              <Director />
            </Suspense>
          </div>
        </section>

        <Suspense fallback={<CardGridSkeleton count={3} className="h-[28rem]" />}>
          <Regulators />
        </Suspense>
      </div>
    </>
  );
}
