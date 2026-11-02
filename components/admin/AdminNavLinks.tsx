"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutDashboard, Stethoscope, UserCog, UserRound, Users } from "lucide-react";

const items = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard, exact: true },
  { href: "/admin/staff", label: "Сотрудники", icon: UserRound },
  { href: "/admin/services", label: "Услуги и цены", icon: Stethoscope },
  { href: "/admin/announcements", label: "Уведомления", icon: Bell },
  { href: "/admin/users", label: "Пользователи", icon: Users, adminOnly: true },
  { href: "/admin/account", label: "Профиль", icon: UserCog },
];

export function AdminNavLinks({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  return (
    <ul className="flex gap-1 overflow-x-auto lg:flex-col">
      {items
        .filter((item) => isAdmin || !item.adminOnly)
        .map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[15px] font-semibold transition ${
                  active ? "bg-brand text-white glow" : "text-brand-deep hover:bg-white/80"
                }`}
              >
                <Icon className="size-4.5" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
    </ul>
  );
}
