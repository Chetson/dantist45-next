import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  FileText,
  Landmark,
  ScanLine,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { ClinicCard } from "@/components/clinics/ClinicCard";
import { StaffCard } from "@/components/staff/StaffCard";
import { buttonClass } from "@/components/ui/button";
import { CategoryIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getHomeDoctors, getServiceCatalog } from "@/lib/data/content";
import { getClinics } from "@/lib/data/site";
import { formatPhone, formatRub } from "@/lib/format";

// ─── Преимущества ──────────────────────────────────────────────────────

const features = [
  {
    icon: Stethoscope,
    title: "Все направления",
    text: "Терапевт, хирург и ортопед в одной клинике",
  },
  {
    icon: ScanLine,
    title: "Рентген-диагностика",
    text: "Снимки делают в клинике перед лечением",
  },
  {
    icon: BadgeCheck,
    title: "Аккредитованные специалисты",
    text: "Сведения об образовании — на сайте",
  },
  {
    icon: ShieldCheck,
    title: "Медицинская лицензия",
    text: "ЛО-45-01-001150 от 28.01.2014",
  },
];

export function Features() {
  return (
    <section aria-label="Преимущества" className="py-14">
      <ul className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold text-brand-deep">{title}</h3>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Направления ───────────────────────────────────────────────────────

export async function ServicesGrid() {
  const catalog = await getServiceCatalog();
  const categories = catalog.filter((c) => c.showOnHome);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => {
        const minPrice = Math.min(...category.services.map((s) => s.priceFrom));
        return (
          <article
            key={category.id}
            className="group relative flex flex-col rounded-3xl border border-line bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-deep/5"
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
              <CategoryIcon name={category.icon} className="size-7" />
            </span>
            <h3 className="mt-6 font-display text-xl text-brand-deep">
              <Link href={`/services#${category.slug}`} className="after:absolute after:inset-0">
                {category.name}
              </Link>
            </h3>
            <p className="mt-3 text-sm text-muted">{category.summary}</p>
            {category.articles.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-sm">
                {category.articles.map((article) => (
                  <li key={article.slug} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                    {article.title}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-auto flex items-end justify-between pt-6">
              {Number.isFinite(minPrice) ? (
                <p className="text-sm text-muted">
                  от <span className="font-display text-2xl text-brand-deep">{formatRub(minPrice)}</span>
                </p>
              ) : (
                <span />
              )}
              <ArrowRight className="size-5 text-brand transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ServicesSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Направления"
          title="Стоматологическая помощь"
          lead="Работы и услуги, которые клиника оказывает по лицензии на медицинскую деятельность."
        />
        <div className="mt-12">{children}</div>
        <div className="mt-10 text-center">
          <Link href="/services" className={buttonClass("primary", "lg")}>
            Все услуги и цены
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── О клинике ─────────────────────────────────────────────────────────

const aboutPoints = [
  "Консультация, лечение, удаление и протезирование — в одной клинике",
  "Врачи регулярно проходят повышение квалификации и аккредитацию",
  "План лечения и его стоимость обсуждаются до начала работ",
  "Услуги оказываются по договору, документы — в разделе «Пациентам»",
];

export function About() {
  return (
    <section className="bg-brand-soft py-20">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="rounded-[2rem] bg-brand-deep p-10 text-white">
            <p className="font-display text-7xl text-accent">2003</p>
            <p className="mt-2 text-lg text-white/80">год, с которого мы заботимся о здоровье зубов жителей Кургана</p>
            <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
              <Link
                href="/licenses"
                className="rounded-2xl bg-white/10 p-4 transition-colors hover:bg-white/15"
              >
                <ShieldCheck className="mb-3 size-6 text-accent" aria-hidden="true" />
                Лицензия на медицинскую деятельность
              </Link>
              <Link
                href="/specialists"
                className="rounded-2xl bg-white/10 p-4 transition-colors hover:bg-white/15"
              >
                <Users className="mb-3 size-6 text-accent" aria-hidden="true" />
                Специалисты и их квалификация
              </Link>
            </div>
          </div>
        </div>
        <div>
          <SectionHeading
            align="left"
            eyebrow="О клинике"
            title="Стоматология «Дантист»"
            lead="Клиника работает в Кургане с 2003 года. Мы оказываем терапевтическую, хирургическую и ортопедическую стоматологическую помощь и проводим профессиональную гигиену полости рта."
          />
          <ul className="mt-8 space-y-3">
            {aboutPoints.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-white">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── Врачи ─────────────────────────────────────────────────────────────

/** Виджет врачей: режим и состав задаются в настройках сайта (SiteSettings). */
export async function DoctorsWidget() {
  const doctors = await getHomeDoctors();
  if (!doctors || doctors.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Специалисты"
          title="Наши врачи"
          lead="Сведения об образовании, квалификации и аккредитации каждого специалиста опубликованы на сайте."
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((person) => (
            <li key={person.id}>
              <StaffCard person={person} />
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Link href="/specialists" className={buttonClass("outline", "lg")}>
            Все специалисты
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Филиалы ───────────────────────────────────────────────────────────

export async function ClinicsGrid() {
  const clinics = await getClinics();
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {clinics.map((clinic) => (
        <li key={clinic.id}>
          <ClinicCard clinic={clinic} />
        </li>
      ))}
    </ul>
  );
}

export function ClinicsSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-surface-muted py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Филиалы"
          title="Адреса и режим работы"
          lead="Запись на приём — по телефону филиала. Мы не принимаем заявки через сайт."
        />
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

// ─── Пациентам ─────────────────────────────────────────────────────────

const patientLinks = [
  {
    href: "/licenses",
    icon: ShieldCheck,
    title: "Лицензии",
    text: "Лицензия на медицинскую деятельность и приложения к ней",
  },
  {
    href: "/regulators",
    icon: Landmark,
    title: "Контролирующие органы",
    text: "Куда обратиться, если ваши права пациента нарушены",
  },
  {
    href: "/documents",
    icon: FileText,
    title: "Документы",
    text: "Нормативные акты, договоры и правила для пациентов",
  },
];

export function PatientInfo() {
  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Пациентам" title="Информация для пациентов" />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {patientLinks.map(({ href, icon: Icon, title, text }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full gap-5 rounded-3xl border border-line p-7 transition-colors hover:border-brand hover:bg-brand-soft/40"
              >
                <Icon className="size-8 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-xl text-brand-deep">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{text}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Призыв позвонить ──────────────────────────────────────────────────

export async function CallPhones() {
  const clinics = await getClinics();
  return (
    <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {clinics
        .filter((c) => c.phones.length > 0)
        .map((clinic) => (
          <li key={clinic.id}>
            <a href={`tel:${clinic.phones[0].number}`} className={buttonClass("light", "lg")}>
              {formatPhone(clinic.phones[0].number)}
              <span className="font-normal text-muted">· {clinic.name}</span>
            </a>
          </li>
        ))}
    </ul>
  );
}

export function CallToAction({ children }: { children: React.ReactNode }) {
  return (
    <section className="pb-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand px-8 py-14 text-white sm:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-accent/30 blur-3xl"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Запишитесь на консультацию</h2>
              <p className="mt-4 max-w-xl text-white/75">
                Врач проведёт осмотр, при необходимости назначит снимок и предложит план лечения
                с ориентировочной стоимостью.
              </p>
            </div>
            <div className="lg:justify-self-end">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
