"use client";

import { ViewTransition, type ReactNode } from "react";

/**
 * Плавный переход между страницами через View Transitions API (React
 * <ViewTransition>). Переходы в Next.js — это React-транзишены, поэтому
 * анимация запускается сама при навигации; без поддержки в браузере
 * страницы просто сменяются как обычно.
 *
 * Используется в template.tsx: шаблон пересоздаётся при смене сегмента,
 * и старое содержимое «уходит» (page-exit), а новое «появляется» (page-enter).
 * default="none" — обновления внутри страницы (например, подгрузка данных
 * в Suspense) не анимируются. Анимации — в app/globals.css.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
