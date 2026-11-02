import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { roleLabels } from "@/lib/auth-permissions";
import { requireUser } from "@/lib/admin/session";
import { ToothIcon } from "@/components/ui/icons";
import { AdminNavLinks } from "./AdminNavLinks";

/** Боковое меню админки. Читает сессию — рендерится внутри <Suspense>. */
export async function AdminNav() {
  const user = await requireUser();
  return (
    <nav aria-label="Разделы админки" className="card card-pad-sm grid gap-4">
      <Link href="/" target="_blank" className="flex items-center gap-2.5 px-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-brand text-white glow">
          <ToothIcon className="size-5" />
        </span>
        <span className="font-display font-extrabold text-brand-deep">Дантист</span>
      </Link>
      <AdminNavLinks isAdmin={user.role === "admin"} />
      <div className="flex items-center justify-between gap-3 border-t border-line px-2 pt-4">
        <div className="min-w-0 text-sm">
          <p className="truncate font-semibold text-brand-deep">{user.name}</p>
          <p className="truncate text-muted">{roleLabels[user.role]}</p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            title="Выйти"
            className="flex size-9 items-center justify-center rounded-full text-muted ring-1 ring-line hover:text-brand-deep hover:ring-brand"
          >
            <LogOut className="size-4" aria-hidden="true" />
            <span className="sr-only">Выйти</span>
          </button>
        </form>
      </div>
    </nav>
  );
}

export function AdminNavSkeleton() {
  return <div className="card card-pad-sm h-24 animate-pulse lg:h-96" />;
}
