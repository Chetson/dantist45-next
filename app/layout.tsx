import type { Metadata } from "next";
import { Golos_Text, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// next/font скачивает шрифты при сборке и раздаёт их с нашего домена:
// браузер посетителя не обращается к Google (см. refactor-plan.md, 9.3).
const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${golos.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Перейти к содержимому
        </a>
        <Header />
        <main id="content" className="flex-1">
          {children}
        </main>
        <Suspense>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
