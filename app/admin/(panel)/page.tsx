import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Stethoscope, UserRound, Users } from "lucide-react";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/admin/session";
import { AdminHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Обзор" };

export default async function AdminHome() {
  const user = await requireUser();
  const db = getDb();
  const [staff, categories, services, announcements, users] = await Promise.all([
    db.staff.count(),
    db.serviceCategory.count(),
    db.service.count(),
    db.announcement.count({ where: { isActive: true } }),
    user.role === "admin" ? db.user.count() : Promise.resolve(null),
  ]);

  const tiles = [
    { href: "/admin/staff", label: "Сотрудники", value: staff, icon: UserRound },
    { href: "/admin/services", label: "Услуги", value: `${categories} разд. · ${services} поз.`, icon: Stethoscope },
    { href: "/admin/announcements", label: "Активные уведомления", value: announcements, icon: Bell },
    ...(users === null ? [] : [{ href: "/admin/users", label: "Пользователи", value: users, icon: Users }]),
  ];

  return (
    <>
      <AdminHeader title={`Здравствуйте, ${user.name}`}>
        Изменения сразу появляются на сайте.
      </AdminHeader>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {tiles.map(({ href, label, value, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="card card-pad flex items-center gap-4 transition hover:-translate-y-0.5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-white glow">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-muted">{label}</span>
                <span className="type-h4 text-brand-deep">{value}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
