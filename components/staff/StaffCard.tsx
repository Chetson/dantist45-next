import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { StaffListItem } from "@/lib/data/content";
import { fullName, initials } from "@/lib/format";

export function StaffAvatar({
  person,
  className = "size-20 text-2xl",
}: {
  person: StaffListItem;
  className?: string;
}) {
  // Фото сотрудников появятся после получения согласий — пока инициалы.
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent font-display text-white ${className}`}
    >
      {initials(person)}
    </div>
  );
}

export function StaffCard({ person }: { person: StaffListItem }) {
  const position = person.clinics[0]?.position ?? person.specialties;
  return (
    <article className="group relative flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition-shadow hover:shadow-xl hover:shadow-brand-deep/5">
      <div className="flex items-start gap-4">
        <StaffAvatar person={person} />
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-snug text-brand-deep">
            <Link href={`/specialists/${person.slug}`} className="after:absolute after:inset-0">
              {fullName(person)}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-muted first-letter:uppercase">{person.specialties}</p>
        </div>
      </div>

      {position !== person.specialties && (
        <p className="mt-4 rounded-xl bg-brand-soft px-3 py-2 text-sm text-brand first-letter:uppercase">
          {position}
        </p>
      )}

      <ul className="mt-4 flex flex-wrap gap-2">
        {person.clinics.map(({ clinic }) => (
          <li
            key={clinic.slug}
            className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-xs text-muted"
          >
            <MapPin className="size-3.5 text-accent" aria-hidden="true" />
            {clinic.name}
          </li>
        ))}
      </ul>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand">
        Образование и квалификация
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </article>
  );
}
