import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { Suspense } from "react";
import { buttonClass } from "@/components/ui/button";
import { ToothIcon } from "@/components/ui/icons";
import { getClinics } from "@/lib/data/site";
import { formatPhone } from "@/lib/format";
import { mainNav } from "./nav";

// Каркас шапки статичен и попадает в пререндер; телефон берётся из БД
// во время запроса и подставляется через Suspense.
async function MainPhone({ className, withIcon }: { className: string; withIcon?: boolean }) {
  const clinics = await getClinics();
  const phone = clinics.flatMap((c) => c.phones)[0];
  if (!phone) return null;

  return (
    <a href={`tel:${phone.number}`} className={className}>
      {withIcon && <Phone className="size-4" aria-hidden="true" />}
      {formatPhone(phone.number)}
    </a>
  );
}

export function Logo({ inverted }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Стоматология «Дантист», на главную">
      <span
        className={`flex size-10 items-center justify-center rounded-xl ${
          inverted ? "bg-white/10 text-accent" : "bg-brand text-white"
        }`}
      >
        <ToothIcon className="size-6" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-2xl ${inverted ? "text-white" : "text-brand-deep"}`}>
          Дантист
        </span>
        <span className={`mt-1 text-[11px] tracking-wide uppercase ${inverted ? "text-white/60" : "text-muted"}`}>
          стоматология · Курган
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-page flex h-18 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Основное меню" className="hidden xl:block">
          <ul className="flex gap-7 text-[15px] font-medium whitespace-nowrap text-foreground/80">
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
          {/* display задаётся обёрткой: в buttonClass уже есть inline-flex. */}
          <div className="hidden sm:block">
            <Suspense>
              <MainPhone withIcon className={buttonClass("primary", "sm")} />
            </Suspense>
          </div>

          {/* Мобильное меню на <details> — работает без JavaScript. */}
          <details className="relative size-10 shrink-0 xl:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-xl border border-line text-brand [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Открыть меню</span>
              <Menu className="size-5" aria-hidden="true" />
            </summary>
            <nav
              aria-label="Мобильное меню"
              className="absolute right-0 mt-3 w-72 rounded-2xl border border-line bg-white p-2 shadow-xl shadow-brand-deep/10"
            >
              <ul>
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-xl px-4 py-2.5 font-medium hover:bg-brand-soft hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-2 border-t border-line pt-2 empty:hidden">
                  <Suspense>
                    <MainPhone withIcon className={`${buttonClass("primary", "md")} w-full`} />
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
