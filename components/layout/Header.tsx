import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { Suspense } from "react";
import { buttonClass, iconCircle } from "@/components/ui/button";
import { ToothIcon } from "@/components/ui/icons";
import { getClinics } from "@/lib/data/site";
import { formatPhone } from "@/lib/format";
import { mainNav } from "./nav";

// Каркас шапки статичен и попадает в пререндер; телефон берётся из БД
// во время запроса и подставляется через Suspense.
async function MainPhone({ className }: { className: string }) {
  const clinics = await getClinics();
  const phone = clinics.flatMap((c) => c.phones)[0];
  if (!phone) return null;

  return (
    <a href={`tel:${phone.number}`} className={className}>
      <Phone className="size-4 text-brand" aria-hidden="true" />
      {formatPhone(phone.number)}
    </a>
  );
}

export function Logo({ inverted }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Стоматология «Дантист», на главную">
      <span className={`${iconCircle} size-10`}>
        <ToothIcon className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[22px] font-extrabold tracking-tight lowercase ${
            inverted ? "text-white" : "text-brand-deep"
          }`}
        >
          дантист
        </span>
        <span className={`mt-0.5 text-[11px] ${inverted ? "text-white/70" : "text-muted"}`}>
          стоматология · Курган
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-3 z-40 px-3 pt-3 sm:px-4">
      <div className="mx-auto flex h-16 max-w-[82rem] items-center justify-between gap-6 rounded-full bg-white/90 pr-3 pl-4 shadow-[0_16px_40px_-24px_rgba(59,73,93,0.45)] ring-1 ring-white backdrop-blur sm:pr-4 sm:pl-6">
        <Logo />

        <nav aria-label="Основное меню" className="hidden xl:block">
          <ul className="flex gap-7 text-[15px] font-medium whitespace-nowrap text-brand-deep">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {/* display задаётся обёрткой, чтобы не спорить с классами ссылки. */}
          <div className="hidden sm:block">
            <Suspense>
              <MainPhone className="inline-flex items-center gap-2 font-semibold whitespace-nowrap text-brand-deep hover:text-brand" />
            </Suspense>
          </div>

          {/* Мобильное меню на <details> — работает без JavaScript. */}
          <details className="relative size-11 shrink-0 xl:hidden">
            <summary
              className={`${iconCircle} size-11 cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
            >
              <span className="sr-only">Открыть меню</span>
              <Menu className="size-5" aria-hidden="true" />
            </summary>
            <nav
              aria-label="Мобильное меню"
              className="card absolute right-0 mt-4 w-72 rounded-[1.75rem] bg-white p-2"
            >
              <ul>
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-2xl px-4 py-2.5 font-medium hover:bg-brand-soft"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-2 border-t border-line pt-2 empty:hidden">
                  <Suspense>
                    <MainPhone className={`${buttonClass("light", "md")} w-full`} />
                  </Suspense>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
