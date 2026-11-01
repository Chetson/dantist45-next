import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { Suspense } from "react";
import { buttonClass, iconCircle } from "@/components/ui/button";
import { ToothIcon } from "@/components/ui/icons";
import { getClinics } from "@/lib/data/site";
import { formatPhone } from "@/lib/format";
import { mainNav } from "./nav";
import { StickyHeader } from "./StickyHeader";

// Каркас шапки статичен и попадает в пререндер; телефон берётся из БД
// во время запроса и подставляется через Suspense.
async function MainPhone({ className }: { className: string }) {
  const clinics = await getClinics();
  const phone = clinics.flatMap((c) => c.phones)[0];
  if (!phone) return null;

  return (
    <a href={`tel:${phone.number}`} className={className}>
      <span className={`${iconCircle} size-8`}>
        <Phone className="size-3.5" aria-hidden="true" />
      </span>
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
        <span className={`mt-1 text-xs leading-none ${inverted ? "text-white/70" : "text-muted"}`}>
          стоматология · Курган
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  return (
    <StickyHeader>
      {/* В покое шапка — «пилюля» на краях сетки страницы. При прокрутке обёртка
          теряет поля и ограничение ширины, а пилюля — скругление: шапка плавно
          растягивается на всю ширину экрана. Строка с содержимым всегда остаётся
          в границах сетки (76rem), поэтому логотип и телефон не смещаются.
          Поля строки равны отступу круга логотипа сверху и снизу. */}
      <div className="mx-auto max-w-[80rem] px-5 pt-3 transition-[max-width,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[scrolled=true]/header:max-w-full group-data-[scrolled=true]/header:px-0 group-data-[scrolled=true]/header:pt-0 motion-reduce:transition-none sm:px-8 sm:pt-4">
        <div className="pointer-events-auto rounded-[2rem] bg-white/90 shadow-[0_16px_40px_-24px_rgba(59,73,93,0.45)] ring-1 ring-white backdrop-blur transition-[border-radius,padding,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[scrolled=true]/header:rounded-none group-data-[scrolled=true]/header:bg-white/85 group-data-[scrolled=true]/header:px-5 group-data-[scrolled=true]/header:shadow-[0_1px_0_0_rgba(225,231,241,1),0_14px_32px_-24px_rgba(59,73,93,0.5)] group-data-[scrolled=true]/header:ring-0 motion-reduce:transition-none sm:rounded-[2.25rem] sm:group-data-[scrolled=true]/header:px-8">
          <div className="mx-auto flex h-16 max-w-[76rem] items-center justify-between gap-6 pr-2.5 pl-3 sm:h-[4.5rem] sm:px-4">
            <Logo />

            <nav aria-label="Основное меню" className="hidden xl:block">
              <ul className="flex gap-6 text-[15px] leading-6 font-medium whitespace-nowrap text-brand-deep 2xl:gap-8">
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
                  <MainPhone className="inline-flex h-10 items-center gap-2.5 rounded-full bg-brand-soft py-1 pr-4 pl-1 text-[15px] leading-none font-semibold whitespace-nowrap text-brand-deep transition-colors hover:bg-brand hover:text-white" />
                </Suspense>
              </div>

              {/* Мобильное меню на <details> — работает без JavaScript. */}
              <details className="relative size-11 shrink-0 sm:size-10 xl:hidden">
                <summary
                  className={`${iconCircle} size-11 cursor-pointer list-none sm:size-10 [&::-webkit-details-marker]:hidden`}
                >
                  <span className="sr-only">Открыть меню</span>
                  <Menu className="size-5" aria-hidden="true" />
                </summary>
                <nav
                  aria-label="Мобильное меню"
                  className="card absolute -right-2.5 mt-5 w-[min(20rem,calc(100vw-2.5rem))] rounded-[1.75rem] bg-white p-3"
                >
                  <ul>
                    {mainNav.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-2xl px-4 py-3 text-[17px] leading-6 font-medium hover:bg-brand-soft"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li className="mt-3 border-t border-line pt-3 empty:hidden">
                      <Suspense>
                        <MainPhone className={`${buttonClass("light", "md")} w-full`} />
                      </Suspense>
                    </li>
                  </ul>
                </nav>
              </details>
            </div>
          </div>
        </div>
      </div>
    </StickyHeader>
  );
}
