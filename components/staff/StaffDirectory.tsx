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
    <div className="space-y-14">
      <div role="group" aria-label="Филиал" className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.slug ?? "all"}
            type="button"
            aria-pressed={clinic === tab.slug}
            onClick={() => setClinic(tab.slug)}
            className="rounded-full bg-white/70 ring-1 ring-white px-5 py-2 text-sm font-medium transition-colors hover:text-brand aria-pressed:bg-brand aria-pressed:text-white aria-pressed:glow"
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
            <h2 id={`group-${group.kind}`} className="mb-6 font-display text-2xl text-brand-deep sm:text-3xl font-extrabold tracking-tight">
              {group.title}
              <span className="ml-3 align-middle font-sans text-base font-medium text-muted">{people.length}</span>
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
