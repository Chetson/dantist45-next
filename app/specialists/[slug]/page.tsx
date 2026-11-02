import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BadgeCheck, GraduationCap, MapPin, ScrollText } from "lucide-react";
import { Suspense } from "react";
import type { StaffDocType } from "@/generated/prisma/enums";
import { StaffAvatar } from "@/components/staff/StaffCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { getStaffMember } from "@/lib/data/content";
import { formatDate, fullName } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/specialists/[slug]">): Promise<Metadata> {
  const person = await getStaffMember((await params).slug);
  if (!person) notFound();
  return {
    title: `${fullName(person)} — ${person.specialties}`,
    alternates: { canonical: `/specialists/${person.slug}` },
    description: `Образование, квалификация и аккредитация: ${fullName(person)}, ${person.specialties}.`,
  };
}

const docTypes: Record<StaffDocType, { title: string; icon: typeof Award }> = {
  DIPLOMA: { title: "Образование", icon: GraduationCap },
  RETRAINING: { title: "Профессиональная переподготовка", icon: ScrollText },
  QUALIFICATION: { title: "Повышение квалификации", icon: Award },
  CERTIFICATE: { title: "Сертификаты специалиста", icon: Award },
  ACCREDITATION: { title: "Аккредитация", icon: BadgeCheck },
};

const docOrder: StaffDocType[] = ["DIPLOMA", "RETRAINING", "QUALIFICATION", "CERTIFICATE", "ACCREDITATION"];

async function Profile({ slug }: { slug: string }) {
  const person = await getStaffMember(slug);
  if (!person) notFound();
  const name = fullName(person);

  return (
    <>
      <PageHeader
        title={name}
        crumbs={[{ href: "/specialists", label: "Специалисты" }]}
        current={name}
        keepCase
        lead={<span className="first-letter:uppercase">{person.specialties}</span>}
      />
      <div className="container-page grid grid-cols-12 gap-x-6 gap-y-10 *:col-span-12 *:min-w-0 lg:[&>*:first-child]:col-span-4 lg:[&>*:last-child]:col-span-8">
        <aside className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-6 lg:sticky lg:top-28 lg:grid-cols-1 lg:self-start">
          <StaffAvatar className="aspect-square w-32 sm:w-44 lg:w-full lg:max-w-72" />
          <ul className="space-y-3">
            {person.clinics.map(({ clinic, position }) => (
              <li key={clinic.slug} className="card card-pad-sm rounded-[1.75rem]">
                <Link href={`/clinics/${clinic.slug}`} className="flex items-center gap-2 font-medium text-brand hover:underline">
                  <MapPin className="size-4 text-brand" aria-hidden="true" />
                  {clinic.name}
                </Link>
                <p className="mt-1 text-sm text-muted first-letter:uppercase">{position}</p>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-10">
          {docOrder.map((type) => {
            const docs = person.documents.filter((d) => d.type === type);
            if (docs.length === 0) return null;
            const { title, icon: Icon } = docTypes[type];
            return (
              <section key={type} aria-labelledby={`docs-${type}`}>
                <h2 id={`docs-${type}`} className="type-h3 mb-5 flex items-center gap-3 text-brand-deep">
                  <Icon className="size-6 text-brand" aria-hidden="true" />
                  {title}
                </h2>
                <ul className="space-y-3">
                  {docs.map((doc) => (
                    <li key={doc.id} className="card card-pad-sm rounded-[1.75rem]">
                      {doc.organization && <p className="font-medium">{doc.organization}</p>}
                      <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
                        {doc.specialty && (
                          <>
                            <dt className="text-muted">Специальность</dt>
                            <dd>{doc.specialty}</dd>
                          </>
                        )}
                        {doc.qualification && (
                          <>
                            <dt className="text-muted">Квалификация</dt>
                            <dd>{doc.qualification}</dd>
                          </>
                        )}
                        {doc.number && (
                          <>
                            <dt className="text-muted">Номер</dt>
                            <dd>{doc.number}</dd>
                          </>
                        )}
                        {doc.issuedAt && (
                          <>
                            <dt className="text-muted">Дата</dt>
                            <dd>{formatDate(doc.issuedAt)}</dd>
                          </>
                        )}
                        {doc.note && (
                          <>
                            <dt className="text-muted">Примечание</dt>
                            <dd>{doc.note}</dd>
                          </>
                        )}
                      </dl>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function SpecialistPage({ params }: PageProps<"/specialists/[slug]">) {
  return (
    <Suspense
      fallback={
        <>
          <div className="container-page h-56 pt-12"><Skeleton className="h-24 max-w-2xl" /></div>
          <div className="container-page grid grid-cols-12 gap-x-6 gap-y-10 *:col-span-12 *:min-w-0 lg:[&>*:first-child]:col-span-4 lg:[&>*:last-child]:col-span-8">
            <Skeleton className="aspect-square" />
            <Skeleton className="h-96" />
          </div>
        </>
      }
    >
      {params.then(({ slug }) => (
        <Profile slug={slug} />
      ))}
    </Suspense>
  );
}
