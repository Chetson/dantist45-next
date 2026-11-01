import { Info, OctagonAlert, TriangleAlert } from "lucide-react";
import type { AnnouncementLevel } from "@/generated/prisma/enums";
import { Markdown } from "@/components/ui/Markdown";
import { getActiveAnnouncements } from "@/lib/data/content";

const levels: Record<AnnouncementLevel, { icon: typeof Info; circle: string; ring: string; label: string }> = {
  INFO: { icon: Info, circle: "bg-brand glow", ring: "", label: "Информация" },
  WARNING: {
    icon: TriangleAlert,
    circle: "bg-warning",
    ring: "ring-2 ring-warning/30",
    label: "Важно",
  },
  CRITICAL: {
    icon: OctagonAlert,
    circle: "bg-critical",
    ring: "ring-2 ring-critical/40",
    label: "Срочно",
  },
};

/** Блок важных уведомлений под Hero. Ничего не выводит, если уведомлений нет. */
export async function Announcements() {
  const announcements = await getActiveAnnouncements();
  if (announcements.length === 0) return null;

  return (
    <section aria-labelledby="announcements-title" className="container-page pt-4 sm:pt-6">
      <h2 id="announcements-title" className="sr-only">
        Важные уведомления
      </h2>
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {announcements.map((a) => {
          const level = levels[a.level];
          const Icon = level.icon;
          return (
            <article
              key={a.id}
              className={`card card-pad flex flex-col gap-4 sm:flex-row sm:gap-5 ${level.ring} ${announcements.length === 1 ? "lg:col-span-2" : ""}`}
            >
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-full text-white ${level.circle}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 text-foreground/85">
                <p className="type-eyebrow text-muted">
                  {level.label}
                  {a.clinics.length > 0 && ` · ${a.clinics.map((c) => c.name).join(", ")}`}
                </p>
                <h3 className="type-h4 mt-2 mb-3 text-brand-deep">
                  {a.title}
                </h3>
                <Markdown compact>{a.body}</Markdown>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
