import Link from "next/link";
import { getClinics } from "@/lib/data/site";
import { formatPhone } from "@/lib/format";
import { mainNav } from "./nav";

export async function Header() {
  const clinics = await getClinics();
  const phone = clinics.flatMap((c) => c.phones)[0];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-brand">Дантист</span>
          <span className="text-xs text-muted">стоматология в Кургане</span>
        </Link>

        <nav aria-label="Основное меню" className="hidden xl:block">
          <ul className="flex gap-5 text-sm font-medium whitespace-nowrap">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {phone && (
            <a
              href={`tel:${phone.number}`}
              className="hidden font-semibold whitespace-nowrap hover:text-brand sm:block"
            >
              {formatPhone(phone.number)}
            </a>
          )}

          {/* Мобильное меню на <details> — работает без JavaScript. */}
          <details className="group relative xl:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-line [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Открыть меню</span>
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </summary>
            <nav
              aria-label="Мобильное меню"
              className="absolute right-0 mt-2 w-64 rounded-xl border border-line bg-surface p-2 shadow-lg"
            >
              <ul>
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-2 hover:bg-brand-soft"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {phone && (
                  <li className="mt-1 border-t border-line pt-1">
                    <a
                      href={`tel:${phone.number}`}
                      className="block rounded-lg px-3 py-2 font-semibold"
                    >
                      {formatPhone(phone.number)}
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
