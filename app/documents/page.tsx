import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink, FileText } from "lucide-react";
import { Suspense } from "react";
import type { DocumentGroup } from "@/generated/prisma/enums";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { getDocuments } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Пациентам",
  description:
    "Нормативные документы, образцы договоров и информация для пациентов стоматологии «Дантист».",
};

const groups: { key: DocumentGroup; title: string; lead: string }[] = [
  {
    key: "LAW",
    title: "Нормативные документы",
    lead: "Законы и постановления, на основании которых оказываются платные медицинские услуги.",
  },
  {
    key: "CONTRACT",
    title: "Образцы договоров",
    lead: "Медицинские услуги оказываются на основании договора, который заключается до начала лечения.",
  },
  {
    key: "PATIENT_INFO",
    title: "Информация для пациентов",
    lead: "Правила, порядок и условия предоставления медицинских услуг.",
  },
];

async function DocumentsList() {
  const documents = await getDocuments();

  return (
    <div className="space-y-14">
      {groups.map((group) => {
        const items = documents.filter((d) => d.group === group.key);
        if (items.length === 0) return null;
        return (
          <section key={group.key} aria-labelledby={`group-${group.key}`}>
            <h2 id={`group-${group.key}`} className="type-h3 text-brand-deep">
              {group.title}
            </h2>
            <p className="mt-2 text-muted">{group.lead}</p>
            <ul className="mt-6 grid gap-4 sm:gap-6 md:grid-cols-2">
              {items.map((doc) => {
                const href = doc.file ?? doc.url;
                return (
                  <li key={doc.id} className="flex gap-4 card rounded-[1.75rem] p-5">
                    <FileText className="mt-0.5 size-6 shrink-0 text-brand" aria-hidden="true" />
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      {href ? (
                        <a
                          href={href}
                          {...(doc.file ? { download: true } : { target: "_blank", rel: "noopener noreferrer" })}
                          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                        >
                          {doc.file ? (
                            <>
                              <Download className="size-4" aria-hidden="true" />
                              Скачать
                            </>
                          ) : (
                            <>
                              Открыть текст документа
                              <ExternalLink className="size-3.5" aria-hidden="true" />
                            </>
                          )}
                        </a>
                      ) : (
                        <p className="mt-2 text-sm text-muted">Можно ознакомиться в регистратуре клиники</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        title="Пациентам"
        current="Пациентам"
        lead="Документы, регулирующие оказание медицинских услуг, и информация о ваших правах."
      />
      <div className="container-page space-y-14 sm:space-y-20">
        <Suspense fallback={<Skeleton className="h-96" />}>
          <DocumentsList />
        </Suspense>

        <section className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="card card-pad">
            <h2 className="type-h4 text-brand-deep">Бесплатная медицинская помощь</h2>
            <p className="mt-3 text-foreground/80">
              Гражданам гарантируется бесплатная медицинская помощь в рамках Территориальной
              программы государственных гарантий Курганской области. Узнать, где и как её получить,
              можно в своей страховой медицинской организации и в Департаменте здравоохранения
              Курганской области.
            </p>
          </div>
          <div className="card card-pad">
            <h2 className="type-h4 text-brand-deep">Если права нарушены</h2>
            <p className="mt-3 text-foreground/80">
              Порядок обращения и контакты органов, контролирующих работу клиники, — на странице{" "}
              <Link href="/regulators" className="font-medium text-brand underline">
                «Контролирующие органы»
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
