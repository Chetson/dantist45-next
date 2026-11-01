"use client";

import { useEffect, useRef, useState } from "react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";

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
 * Строку листает Swiper: свайпом на телефоне, перетаскиванием мышью и
 * горизонтальной прокруткой тачпада на компьютере (вертикальное колесо
 * остаётся за страницей). После перетаскивания клик по ссылке не срабатывает.
 *
 * Активный раздел — последний, чей верх уже поднялся выше «линии чтения»
 * под шапкой. После клика подсветка фиксируется на выбранном разделе, пока
 * идёт плавная прокрутка, — иначе она пробегала бы по промежуточным разделам.
 */
export function SubnavLinks({ items, label }: { items: Item[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);
  const swiperRef = useRef<SwiperRef>(null);
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
      if (remaining <= BOTTOM_ZONE) current = sections[sections.length - 1].id;
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

  // Активная ссылка должна быть видна целиком: если она за краем строки,
  // листаем Swiper так, чтобы слева от неё оставалась предыдущая.
  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    const index = items.findIndex((item) => item.id === active);
    if (!swiper || index < 0) return;
    const slide = swiper.slides[index];
    const box = swiper.el.getBoundingClientRect();
    const rect = slide.getBoundingClientRect();
    if (rect.left < box.left || rect.right > box.right) {
      swiper.slideTo(Math.max(0, index - 1), 400);
    }
  }, [active, items]);

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
      <Swiper
        ref={swiperRef}
        modules={[FreeMode, Mousewheel]}
        slidesPerView="auto"
        spaceBetween={6}
        freeMode={{ enabled: true, momentum: true }}
        mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
        grabCursor
        watchOverflow
        // Swiper не обрезает слайды сам: ссылки уходят за край сетки до контура
        // шапки, а обрезает их обёртка сабхедера по скруглению (Header.tsx).
        // Так тени ссылок не срезаются по прямой линии. Вертикальные поля
        // вмещают свечение активной ссылки.
        className="cursor-grab overflow-visible! py-2.5! text-sm leading-5 active:cursor-grabbing sm:py-3!"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="w-auto!">
            <a
              href={`#${item.id}`}
              data-id={item.id}
              aria-current={active === item.id ? "true" : undefined}
              onClick={() => handleClick(item.id)}
              draggable={false}
              className="block rounded-full px-4 py-2 whitespace-nowrap text-brand-deep/80 transition-colors select-none hover:bg-brand-soft hover:text-brand-deep aria-[current=true]:bg-brand aria-[current=true]:text-white aria-[current=true]:shadow-[0_4px_12px_-4px_rgb(125_136_203/0.8)]"
            >
              {item.label}
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </nav>
  );
}
