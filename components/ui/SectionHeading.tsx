import type { ReactNode } from "react";

type Props = {
  title: string;
  /** Короткий поясняющий текст справа от заголовка (как в макете). */
  note?: ReactNode;
  /** Иконка-таблетка перед поясняющим текстом */
  noteIcon?: ReactNode;
  /** Для градиентной панели */
  inverted?: boolean;
  as?: "h1" | "h2";
  /** Заголовок не переводится в строчные (имена собственные) */
  keepCase?: boolean;
};

/**
 * Заголовок секции на 12-колоночной сетке: заголовок — 8 колонок,
 * пояснение — последние 4 (совпадает с правой карточкой ряда из трёх).
 */
export function SectionHeading({ title, note, noteIcon, inverted, as: Tag = "h2", keepCase }: Props) {
  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-5 sm:gap-x-6">
      <Tag
        className={`type-h2 col-span-12 text-balance lg:col-span-8 ${keepCase ? "normal-case" : ""} ${
          inverted ? "text-white" : "text-brand-deep"
        }`}
      >
        {title}
      </Tag>
      {note && (
        <div className="col-span-12 flex items-start gap-4 lg:col-span-4 lg:pt-2">
          {noteIcon}
          <p className={`max-w-md text-base leading-7 ${inverted ? "text-white/85" : "text-muted"}`}>{note}</p>
        </div>
      )}
    </div>
  );
}

/** Стандартный отступ между заголовком секции и её содержимым. */
export const headingGap = "mt-10 sm:mt-14";
