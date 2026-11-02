import type { Metadata } from "next";
import { Manrope, Raleway } from "next/font/google";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// next/font скачивает шрифты при сборке и раздаёт их с нашего домена:
// браузер посетителя не обращается к Google (см. refactor-plan.md, 9.3).
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin", "cyrillic"],
});

// Заменяет Soyuz Grotesk из макета: его нет в Google Fonts.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Стоматология «Дантист» — Курган",
    template: "%s — стоматология «Дантист»",
  },
  description:
    "Стоматология «Дантист» в Кургане с 2003 года: терапия, хирургия, ортопедия, гигиена. Цены, специалисты, адреса филиалов.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Стоматология «Дантист»",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${raleway.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col font-sans">
        {/* Размытые пятна фона, как в макете. */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 size-[40rem] rounded-full bg-white/70 blur-3xl" />
          <div className="absolute top-1/3 -right-48 size-[36rem] rounded-full bg-accent-soft blur-3xl" />
          <div className="absolute -bottom-40 left-1/4 size-[34rem] rounded-full bg-brand-soft/70 blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  );
}
