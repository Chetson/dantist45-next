import { Suspense } from "react";
import { AdminNav, AdminNavSkeleton } from "@/components/admin/AdminNav";

// Страницы админки за входом. Сессию проверяют и меню (AdminNav), и каждая
// страница, и каждый Server Action (lib/admin/session.ts).
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page grid grid-cols-12 gap-4 py-6 sm:gap-6 sm:py-10">
      <aside className="col-span-12 lg:col-span-3">
        <div className="lg:sticky lg:top-6">
          <Suspense fallback={<AdminNavSkeleton />}>
            <AdminNav />
          </Suspense>
        </div>
      </aside>
      <div className="col-span-12 min-w-0 lg:col-span-9">{children}</div>
    </div>
  );
}
