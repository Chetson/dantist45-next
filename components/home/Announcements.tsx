import { Info, OctagonAlert, TriangleAlert } from "lucide-react";
import type { AnnouncementLevel } from "@/generated/prisma/enums";
import { Markdown } from "@/components/ui/Markdown";
import { getActiveAnnouncements } from "@/lib/data/content";

const levels: Record<
  AnnouncementLevel,
  { icon: typeof Info; card: string; icon_: string; label: string }
> = {
  INFO: { icon: Info, card: "border-brand/15 bg-white", icon_: "bg-brand-soft text-brand", label: "Информация" },
  WARNING: {
    icon: TriangleAlert,
    card: "border-warning/25 bg-warning-soft",
    icon_: "bg-white text-warning",
    label: "Важно",
  },
  CRITICAL: {
    icon: OctagonAlert,
    card: "border-critical/30 bg-critical-soft",
    icon_: "bg-white text-critical",
    label: "Срочно",
  },
};

/** Блок важных уведомлений под Hero. Ничего не выводит, если уведомлений нет. */
export async function Announcements() {
  const announcements = await getActiveAnnouncements();
  if (announcements.length === 0) return null;

  return (
    <section aria-labelledby="announcements-title" className="relative z-10 -mt-10 pb-4">
      <h2 id="announcements-title" className="sr-only">
        Важные уведомления
      </h2>
      <div className="container-page grid gap-4 lg:grid-cols-2">
        {announcements.map((a) => {
          const level = levels[a.level];
          const Icon = level.icon;
          return (
            <article
              key={a.id}
              className={`flex gap-4 rounded-3xl border p-6 shadow-lg shadow-brand-deep/5 ${level.card} ${
                announcements.length === 1 ? "lg:col-span-2" : ""
              }`}
            >
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${level.icon_}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 text-[15px] text-foreground/85">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  {level.label}
                  {a.clinics.length > 0 && ` · ${a.clinics.map((c) => c.name).join(", ")}`}
                </p>
                <h3 className="mt-1 mb-2 text-lg font-semibold text-brand-deep">{a.title}</h3>
                <Markdown compact>{a.body}</Markdown>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
