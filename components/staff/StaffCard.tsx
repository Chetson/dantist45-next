import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { StaffListItem } from "@/lib/data/content";
import { fullName, initials } from "@/lib/format";

export function StaffAvatar({
  person,
  className = "size-28 text-3xl",
}: {
  person: Pick<StaffListItem, "firstName" | "lastName">;
  className?: string;
}) {
  // Фото сотрудников появятся после получения согласий — пока инициалы.
  return (
    <div
      aria-hidden="true"
      className={`bg-sky-panel flex shrink-0 items-center justify-center rounded-full font-display font-extrabold text-white shadow-lg shadow-accent-strong/30 ${className}`}
    >
      {initials(person)}
    </div>
  );
}

export function StaffCard({ person }: { person: StaffListItem }) {
  const position = person.clinics[0]?.position ?? person.specialties;
  return (
    <article className="card group relative flex h-full flex-col items-center p-7 text-center">
      <span className="absolute top-6 right-6 text-muted transition-colors group-hover:text-brand">
        <ArrowUpRight className="size-5" aria-hidden="true" />
      </span>
      <StaffAvatar person={person} />
      <h3 className="mt-6 font-display text-xl leading-tight font-extrabold tracking-tight text-brand-deep">
        <Link href={`/specialists/${person.slug}`} className="after:absolute after:inset-0">
          {fullName(person)}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-muted first-letter:uppercase">{person.specialties}</p>
      {position !== person.specialties && (
        <p className="mt-3 text-sm font-semibold text-brand-deep first-letter:uppercase">{position}</p>
      )}
      <ul className="mt-auto flex flex-wrap justify-center gap-2 pt-5">
        {person.clinics.map(({ clinic }) => (
          <li
            key={clinic.slug}
            className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-xs text-brand-deep"
          >
            <MapPin className="size-3.5 text-brand" aria-hidden="true" />
            {clinic.name}
          </li>
        ))}
      </ul>
    </article>
  );
}
