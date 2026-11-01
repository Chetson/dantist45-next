import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

// next/font скачивает шрифт при сборке и раздаёт его с нашего домена:
// браузер посетителя не обращается к Google (см. refactor-plan.md, 9.3).
const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "Стоматология «Дантист» — Курган",
    template: "%s — стоматология «Дантист»",
  },
  description:
    "Стоматология «Дантист» в Кургане: терапия, хирургия, ортопедия, гигиена. Цены, специалисты, адреса филиалов.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${golos.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Suspense>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
