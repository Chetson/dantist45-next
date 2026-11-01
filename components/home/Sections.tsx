import Link from "next/link";
import { ArrowUpRight, Check, FileText, Heart, Landmark, ShieldCheck, Users } from "lucide-react";
import type { ReactNode } from "react";
import { ClinicCard } from "@/components/clinics/ClinicCard";
import { StaffCard } from "@/components/staff/StaffCard";
import { buttonClass, iconCircle } from "@/components/ui/button";
import { CategoryIcon, ToothIcon } from "@/components/ui/icons";
import { SectionHeading, headingGap } from "@/components/ui/SectionHeading";
import { getHomeDoctors, getServiceCatalog } from "@/lib/data/content";
import { getClinics } from "@/lib/data/site";
import { formatPhone, formatRub } from "@/lib/format";

function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`container-page section-y ${className}`}>{children}</section>;
}

// ─── Направления ───────────────────────────────────────────────────────

export async function ServicesGrid() {
  const catalog = await getServiceCatalog();
  const categories = catalog.filter((c) => c.showOnHome);

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4">
      {categories.map((category) => {
        const minPrice = Math.min(...category.services.map((s) => s.priceFrom));
        return (
          <li key={category.id} className="group relative flex flex-col items-center text-center">
            <div className="flex aspect-square w-full max-w-60 items-center justify-center rounded-full bg-white/60 shadow-[0_30px_60px_-40px_rgba(59,73,93,0.45)] ring-1 ring-white transition-transform group-hover:-translate-y-1">
              <span className="bg-sky-panel flex size-1/2 items-center justify-center rounded-full text-white shadow-lg shadow-accent-strong/40">
                <CategoryIcon name={category.icon} className="size-1/2 stroke-[1.5]" />
              </span>
            </div>
            <h3 className="type-h4 mt-5 text-balance text-brand-deep lowercase sm:mt-7">
              <Link href={`/services#${category.slug}`} className="after:absolute after:inset-0">
                {category.name}
              </Link>
            </h3>
            <p className="mt-2 hidden max-w-60 text-sm leading-6 text-muted sm:block">{category.summary}</p>
            {Number.isFinite(minPrice) && (
              <p className="mt-2 text-sm leading-6 font-semibold text-brand sm:mt-3">от {formatRub(minPrice)}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function ServicesSection({ children }: { children: ReactNode }) {
  return (
    <Section>
      <SectionHeading
        title="стоматологическая помощь для всей семьи"
        note="От профилактики и гигиены до лечения каналов, удаления зубов и протезирования — в рамках лицензии на медицинскую деятельность."
      />
      <div className={headingGap}>{children}</div>
      <div className="mt-14 grid grid-cols-12 gap-4 sm:mt-20 sm:gap-6">
        <div className="card card-pad col-span-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between lg:col-span-8">
          <div>
            <p className="type-h4 flex items-center gap-3 text-brand-deep">
              <span className={`${iconCircle} size-7`}>
                <Check className="size-4" aria-hidden="true" />
              </span>
              всё это — в одной клинике,
            </p>
            <p className="mt-3 max-w-md text-muted">
              что позволяет <strong className="font-semibold text-brand-deep">сэкономить время</strong> и пройти
              лечение у специалистов, которые знают вашу историю.
            </p>
          </div>
          <Link href="/services" className={`${buttonClass("primary", "lg")} shrink-0`}>
            Смотреть прайс
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="bg-sky-panel card-pad col-span-12 rounded-[var(--radius-panel)] text-white shadow-lg shadow-accent-strong/30 lg:col-span-4">
          <ToothIcon className="size-7" />
          <p className="type-h3 mt-6 text-balance">
            заботимся о здоровье зубов жителей Кургана с 2003 года
          </p>
        </div>
      </div>
    </Section>
  );
}

// ─── Почему выбирают нас ───────────────────────────────────────────────

const reasons = [
  {
    title: "все направления в одной клинике",
    text: "Терапевт, хирург и ортопед работают вместе: консультация, лечение, удаление и протезирование — без поиска других клиник.",
  },
  {
    title: "открытые цены",
    text: "Прайс опубликован на сайте. План лечения и его стоимость обсуждаются с пациентом до начала работ.",
  },
  {
    title: "специалисты с подтверждённой квалификацией",
    text: "Сведения об образовании, повышении квалификации и аккредитации каждого специалиста — на сайте.",
  },
  {
    title: "всё по закону",
    text: "Медицинская лицензия, договор на оказание услуг и контакты контролирующих органов — в открытом доступе.",
  },
];

export function WhyUs() {
  return (
    <section className="container-page">
      <div className="bg-sky-panel panel-pad relative overflow-hidden rounded-[2.5rem]">
        <ToothIcon aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 size-[30rem] stroke-[0.5] text-white/20" />
        <div className="relative">
          <SectionHeading inverted title="почему пациенты выбирают нас" />
          <ol className={`${headingGap} grid gap-4 sm:gap-6 md:grid-cols-2`}>
            {reasons.map((reason, i) => {
              const solid = i === 0 || i === 3;
              return (
                <li
                  key={reason.title}
                  className={`card-pad flex flex-col sm:min-h-72 ${solid ? "card text-foreground" : "card-glass text-white"}`}
                >
                  <span className={`text-sm leading-6 font-semibold ${solid ? "text-muted" : "text-white/80"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className={`type-h3 mt-auto pt-6 text-balance sm:pt-10 ${
                      solid ? "text-brand-deep" : "text-white"
                    }`}
                  >
                    {reason.title}
                  </h3>
                  <p className={`mt-3 max-w-md ${solid ? "text-foreground/80" : "text-white/90"}`}>
                    {reason.text}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ─── О клинике ─────────────────────────────────────────────────────────

const aboutPoints = [
  "Консультация, лечение, удаление и протезирование — в одной клинике",
  "Врачи регулярно проходят повышение квалификации и аккредитацию",
  "Рентгенологическое обследование — в клинике",
  "Услуги оказываются по договору, документы — в разделе «Пациентам»",
];

export function About() {
  return (
    <Section>
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <div className="card card-pad col-span-12 lg:col-span-8">
          <h2 className="type-h2 text-brand-deep normal-case">о клинике «Дантист»</h2>
          <p className="type-lead mt-6 max-w-2xl text-foreground/85">
            Клиника работает в Кургане с 2003 года. Мы оказываем{" "}
            <strong className="font-semibold text-brand-deep">терапевтическую, хирургическую и ортопедическую</strong>{" "}
            стоматологическую помощь и проводим профессиональную гигиену полости рта.
          </p>
          <ul className="mt-8 grid gap-x-6 gap-y-4 md:grid-cols-2">
            {aboutPoints.map((point) => (
              <li key={point} className="grid grid-cols-[1.5rem_1fr] gap-x-3">
                <span className={`${iconCircle} mt-0.5 size-6`}>
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:col-span-4 lg:grid-cols-1">
          <Link href="/licenses" className="card card-pad group flex flex-col transition-transform hover:-translate-y-0.5">
            <span className={`${iconCircle} size-12`}>
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <p className="type-h3 mt-8 text-brand-deep">лицензия</p>
            <p className="mt-2 text-sm leading-6 text-muted">№ ЛО-45-01-001150 от 28 января 2014 года</p>
          </Link>
          <Link
            href="/specialists"
            className="bg-sky-panel card-pad group flex flex-col rounded-[var(--radius-panel)] text-white shadow-lg shadow-accent-strong/30 transition-transform hover:-translate-y-0.5"
          >
            <Users className="size-6" aria-hidden="true" />
            <p className="type-h3 mt-8">специалисты</p>
            <p className="mt-2 text-sm leading-6 text-white/85">Образование, квалификация и аккредитация</p>
          </Link>
        </div>
      </div>
    </Section>
  );
}

// ─── Врачи ─────────────────────────────────────────────────────────────

/** Виджет врачей: режим и состав задаются в настройках сайта (SiteSettings). */
export async function DoctorsWidget() {
  const doctors = await getHomeDoctors();
  if (!doctors || doctors.length === 0) return null;

  return (
    <Section className="pt-0 sm:pt-0">
      <SectionHeading
        title="познакомьтесь с нашей командой"
        noteIcon={
          <span className={`${iconCircle} size-11`}>
            <Heart className="size-5" aria-hidden="true" />
          </span>
        }
        note="Сведения об образовании, квалификации и аккредитации каждого специалиста опубликованы в его карточке."
      />
      <ul className={`${headingGap} grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3`}>
        {doctors.map((person) => (
          <li key={person.id}>
            <StaffCard person={person} />
          </li>
        ))}
      </ul>
      <div className="mt-10 flex justify-center sm:mt-14">
        <Link href="/specialists" className={buttonClass("primary", "lg")}>
          Все специалисты
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}

// ─── Филиалы ───────────────────────────────────────────────────────────

export async function ClinicsGrid() {
  const clinics = await getClinics();
  return (
    <ul className="grid gap-x-6 gap-y-14 lg:grid-cols-2">
      {clinics.map((clinic) => (
        <li key={clinic.id}>
          <ClinicCard clinic={clinic} />
        </li>
      ))}
    </ul>
  );
}

export function ClinicsSection({ children }: { children: ReactNode }) {
  return (
    <Section>
      <SectionHeading
        title="можете найти нас по адресу"
        note="Запись на приём — по телефону филиала. Сайт не принимает заявки и не собирает персональные данные."
      />
      <div className={headingGap}>{children}</div>
    </Section>
  );
}

// ─── Пациентам ─────────────────────────────────────────────────────────

const patientLinks = [
  {
    href: "/licenses",
    icon: ShieldCheck,
    title: "лицензии",
    text: "Лицензия на медицинскую деятельность и приложения к ней",
  },
  {
    href: "/regulators",
    icon: Landmark,
    title: "контролирующие органы",
    text: "Куда обратиться, если ваши права пациента нарушены",
  },
  {
    href: "/documents",
    icon: FileText,
    title: "документы",
    text: "Нормативные акты, договоры и правила для пациентов",
  },
];

export function PatientInfo() {
  return (
    <Section className="pt-0 sm:pt-0">
      <SectionHeading title="информация для пациентов" />
      <ul className={`${headingGap} grid gap-4 sm:gap-6 md:grid-cols-3`}>
        {patientLinks.map(({ href, icon: Icon, title, text }) => (
          <li key={href}>
            <Link href={href} className="card card-pad group flex h-full flex-col transition-transform hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <span className={`${iconCircle} size-12`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <ArrowUpRight className="size-5 text-muted group-hover:text-brand" aria-hidden="true" />
              </div>
              <h3 className="type-h3 mt-8 text-brand-deep sm:mt-10">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ─── Призыв позвонить ──────────────────────────────────────────────────

export async function CallPhones() {
  const clinics = await getClinics();
  return (
    <ul className="flex flex-col gap-3">
      {clinics
        .filter((c) => c.phones.length > 0)
        .map((clinic) => (
          <li key={clinic.id}>
            <a
              href={`tel:${clinic.phones[0].number}`}
              className="flex w-full items-center gap-3 rounded-full bg-white/90 py-2 pr-6 pl-2 text-brand-deep shadow-lg shadow-brand-deep/10 transition-colors hover:bg-white"
            >
              <span className={`${iconCircle} size-10`}>
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block font-semibold">{formatPhone(clinic.phones[0].number)}</span>
                <span className="text-xs leading-5 text-muted">{clinic.name}</span>
              </span>
            </a>
          </li>
        ))}
      <li className="pt-1 pl-2">
        <Link href="/clinics" className="text-sm font-semibold text-white underline underline-offset-4">
          Все филиалы и телефоны
        </Link>
      </li>
    </ul>
  );
}

export function CallToAction({ children }: { children: ReactNode }) {
  return (
    <section className="container-page">
      <div className="bg-sky-panel panel-pad relative overflow-hidden rounded-[2.5rem] text-white">
        <ToothIcon aria-hidden="true" className="pointer-events-none absolute -right-10 -bottom-24 size-[26rem] stroke-[0.5] text-white/25" />
        <div className="relative grid grid-cols-12 items-center gap-x-6 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="type-h2 text-balance">начните путь к здоровой улыбке с консультации</h2>
            <p className="type-lead mt-6 max-w-xl text-white/90">
              Врач проведёт <strong className="font-bold">осмотр</strong>, при необходимости назначит снимок и
              предложит <strong className="font-bold">план лечения</strong> с ориентировочной стоимостью.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">{children}</div>
        </div>
      </div>
    </section>
  );
}
