import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { StaffListItem } from "@/lib/data/content";
import { DoctorPortrait } from "@/components/ui/illustrations";
import { fullName } from "@/lib/format";

export function StaffAvatar({ className = "size-28" }: { className?: string }) {
  // Фото сотрудников появятся после получения согласий — пока условный портрет.
  return <DoctorPortrait className={`shrink-0 rounded-full shadow-lg shadow-accent-strong/30 ${className}`} />;
}

/**
 * Карточка специалиста. На телефоне — горизонтальная (аватар слева),
 * чтобы список не растягивался на несколько экранов; с 640px — вертикальная.
 */
export function StaffCard({ person }: { person: StaffListItem }) {
  const position = person.clinics[0]?.position ?? person.specialties;
  return (
    <article className="card group relative flex h-full gap-4 p-5 sm:flex-col sm:items-center sm:gap-0 sm:p-8 sm:text-center lg:p-10">
      <span className="absolute top-5 right-5 text-muted transition-colors group-hover:text-brand sm:top-6 sm:right-6">
        <ArrowUpRight className="size-5" aria-hidden="true" />
      </span>
      <StaffAvatar className="size-16 sm:size-28" />
      <div className="flex min-w-0 flex-1 flex-col pr-6 sm:w-full sm:pr-0">
        <h3 className="type-h4 text-balance text-brand-deep sm:mt-6">
          <Link href={`/specialists/${person.slug}`} className="after:absolute after:inset-0">
            {fullName(person)}
          </Link>
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted first-letter:uppercase sm:mt-2">{person.specialties}</p>
        {position !== person.specialties && (
          <p className="mt-1 text-sm leading-6 font-semibold text-brand-deep first-letter:uppercase sm:mt-2">
            {position}
          </p>
        )}
        <ul className="mt-3 flex flex-wrap gap-2 sm:mt-auto sm:justify-center sm:pt-6">
          {person.clinics.map(({ clinic }) => (
            <li
              key={clinic.slug}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs leading-4 text-brand-deep"
            >
              <MapPin className="size-3.5 text-brand" aria-hidden="true" />
              {clinic.name}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
