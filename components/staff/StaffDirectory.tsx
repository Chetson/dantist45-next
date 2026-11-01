"use client";

import { useState } from "react";
import type { StaffListItem } from "@/lib/data/content";
import { StaffCard } from "./StaffCard";

type Props = {
  staff: StaffListItem[];
  clinics: { slug: string; name: string }[];
};

const groups = [
  { kind: "DOCTOR", title: "Врачи и зубные врачи" },
  { kind: "NURSE", title: "Средний медицинский персонал" },
  { kind: "OTHER", title: "Другие специалисты" },
] as const;

/** Список специалистов с фильтром по филиалу (фильтрация на клиенте — список небольшой). */
export function StaffDirectory({ staff, clinics }: Props) {
  const [clinic, setClinic] = useState<string | null>(null);
  const visible = clinic ? staff.filter((s) => s.clinics.some((c) => c.clinic.slug === clinic)) : staff;

  const tabs = [{ slug: null, name: "Все филиалы" }, ...clinics];

  return (
    <div className="space-y-14 sm:space-y-20">
      <div role="group" aria-label="Филиал" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {tabs.map((tab) => (
          <button
            key={tab.slug ?? "all"}
            type="button"
            aria-pressed={clinic === tab.slug}
            onClick={() => setClinic(tab.slug)}
            className="shrink-0 rounded-full bg-white/80 px-5 py-2.5 text-sm leading-6 font-medium whitespace-nowrap ring-1 ring-white transition-colors hover:text-brand aria-pressed:bg-brand aria-pressed:text-white aria-pressed:glow"
          >
            {tab.name}
          </button>
        ))}
      </div>

      {groups.map((group) => {
        const people = visible.filter((s) => s.kind === group.kind);
        if (people.length === 0) return null;
        return (
          <section key={group.kind} aria-labelledby={`group-${group.kind}`}>
            <h2 id={`group-${group.kind}`} className="type-h3 mb-6 flex items-baseline gap-3 text-brand-deep sm:mb-8">
              {group.title}
              <span className="font-sans text-base font-semibold text-muted">{people.length}</span>
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {people.map((person) => (
                <li key={person.id}>
                  <StaffCard person={person} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
