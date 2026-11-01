"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Обёртка шапки: выставляет data-scrolled, когда страница прокручена.
 * Вместо обработчика scroll — IntersectionObserver на «датчике» вверху
 * страницы: срабатывает один раз при пересечении порога и не нагружает
 * прокрутку. Сама анимация — CSS-переходы по group-data-[scrolled=true].
 */
export function StickyHeader({ children }: { children: ReactNode }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Датчик в самом верху body: пока он виден, шапка — «плавающая пилюля». */}
      <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-8" />
      {/* Высота шапки постоянная (отступ сверху + пилюля), поэтому контент
          страницы не прыгает, когда пилюля поднимается и растягивается. */}
      <header
        data-scrolled={scrolled}
        className="group/header pointer-events-none sticky top-0 z-40 h-[4.75rem] sm:h-[5.5rem]"
      >
        {children}
      </header>
    </>
  );
}
