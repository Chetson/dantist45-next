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
};

/** Заголовок секции: крупный строчный текст слева, пояснение справа. */
export function SectionHeading({ title, note, noteIcon, inverted, as: Tag = "h2" }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
      <Tag
        className={`heading-xl text-4xl sm:text-5xl lg:text-6xl ${inverted ? "text-white" : "text-brand-deep"}`}
      >
        {title}
      </Tag>
      {note && (
        <div className="flex gap-4 lg:pt-3">
          {noteIcon}
          <p className={`max-w-sm text-[15px] leading-relaxed ${inverted ? "text-white/80" : "text-muted"}`}>
            {note}
          </p>
        </div>
      )}
    </div>
  );
}
