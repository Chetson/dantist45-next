"use client";

import { useEffect, useRef, useState } from "react";

type Item = { id: string; label: string };

/**
 * «Линия чтения»: не выше 120px под шапкой и не выше 35% высоты окна.
 * Запас нужен, чтобы небольшая прокрутка после перехода по якорю (раздел
 * встаёт ~45px под шапкой) не переключала подсветку на соседний раздел.
 */
const READING_LINE_OFFSET = 120;
const READING_LINE_RATIO = 0.35;
/** Нижняя зона прокрутки, где активен последний раздел (px). */
const BOTTOM_ZONE = 100;

/**
 * Вторая строка шапки: якорные ссылки на разделы страницы.
 *
 * Активный раздел — последний, чей верх уже поднялся выше «линии чтения»
 * сразу под шапкой. Так подсветка совпадает с тем, куда приводит клик
 * по якорю (раздел встаёт прямо под шапкой), и не зависит от высоты разделов.
 * После клика подсветка фиксируется на выбранном разделе, пока идёт плавная
 * прокрутка, — иначе она пробегала бы по всем промежуточным разделам.
 */
export function SubnavLinks({ items, label }: { items: Item[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const lockedRef = useRef(false);
  const updateRef = useRef<() => void>(() => {});

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (lockedRef.current) return;
      const headerBottom = navRef.current?.getBoundingClientRect().bottom ?? 0;
      const line = Math.max(headerBottom + READING_LINE_OFFSET, window.innerHeight * READING_LINE_RATIO);
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      // Последний раздел бывает слишком коротким, чтобы страница могла
      // прокрутиться до него. Тогда он активен в нижних ~100px прокрутки.
      const remaining =
        document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      const atBottom = remaining <= BOTTOM_ZONE;
      if (atBottom) current = sections[sections.length - 1].id;
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    updateRef.current = update;
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  // Прокручиваем по горизонтали только саму строку ссылок. scrollIntoView
  // здесь нельзя: он трогает и прокрутку страницы и обрывает плавный переход
  // к якорю, по которому только что кликнули.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !link) return;
    const left = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  function handleClick(id: string) {
    setActive(id);
    lockedRef.current = true;
    const unlock = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      window.removeEventListener("scrollend", unlock);
      updateRef.current();
    };
    // scrollend поддерживается не везде — подстраховка таймером.
    window.addEventListener("scrollend", unlock, { once: true });
    window.setTimeout(unlock, 1200);
  }

  return (
    <nav ref={navRef} aria-label={label} className="border-t border-line/80">
      <ul
        ref={listRef}
        className="-mx-3 flex gap-1.5 overflow-x-auto px-3 py-2.5 text-sm leading-5 [scrollbar-width:none] sm:py-3"
      >
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              data-id={item.id}
              aria-current={active === item.id ? "true" : undefined}
              onClick={() => handleClick(item.id)}
              className="block rounded-full px-4 py-2 whitespace-nowrap text-brand-deep/80 transition-colors hover:bg-brand-soft hover:text-brand-deep aria-[current=true]:bg-brand aria-[current=true]:text-white aria-[current=true]:glow"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
