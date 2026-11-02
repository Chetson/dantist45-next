import { Suspense, type ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

/** Оболочка публичного сайта: шапка, основное содержимое, футер. */
export function SiteShell({ children, subnav }: { children: ReactNode; subnav?: ReactNode }) {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Перейти к содержимому
      </a>
      <Header subnav={subnav} />
      <main id="content" className="flex-1">
        {children}
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
