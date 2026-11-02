import type { SVGProps } from "react";

/*
 * Векторные иллюстрации в стиле макета «Dental Clinic»: «стеклянные» предметы
 * с мягкими градиентами и тенями. Рисуются в SVG, чтобы не добавлять в сборку
 * растровые файлы; размер задаётся классами (`w-*`), цвета — внутри.
 */

type Props = SVGProps<SVGSVGElement>;

const common = { xmlns: "http://www.w3.org/2000/svg", fill: "none", "aria-hidden": true } as const;

/** Кассовый чек с прайсом — для блока «открытые цены». */
export function ReceiptIllustration(props: Props) {
  const rows = [58, 82, 106, 130];
  return (
    <svg {...common} viewBox="0 0 220 270" {...props}>
      <defs>
        <linearGradient id="rc-paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e9f1fb" />
        </linearGradient>
        <filter id="rc-shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="14" stdDeviation="10" floodColor="#3b495d" floodOpacity="0.28" />
        </filter>
      </defs>
      <g filter="url(#rc-shadow)">
        <path
          d="M18 10h184v228l-11.5-9-11.5 9-11.5-9-11.5 9-11.5-9-11.5 9-11.5-9-11.5 9-11.5-9-11.5 9-11.5-9-11.5 9-11.5-9-11.5 9-11.5-9L18 238V10Z"
          fill="url(#rc-paper)"
        />
      </g>
      <text x="110" y="34" textAnchor="middle" fontFamily="var(--font-manrope), sans-serif" fontSize="15" fontWeight="800" fill="#3b495d">
        прайс-лист
      </text>
      <path d="M36 44h148" stroke="#c9d6ea" strokeWidth="1.5" strokeDasharray="4 4" />
      {rows.map((y, i) => (
        <g key={y}>
          <rect x="36" y={y} width={[78, 64, 90, 56][i]} height="7" rx="3.5" fill="#c9d6ea" />
          <rect x="146" y={y} width="38" height="7" rx="3.5" fill="#8a95d2" opacity={0.75} />
        </g>
      ))}
      <path d="M36 156h148" stroke="#c9d6ea" strokeWidth="1.5" strokeDasharray="4 4" />
      <rect x="36" y="172" width="148" height="34" rx="17" fill="#7d88cb" />
      <rect x="52" y="185" width="52" height="8" rx="4" fill="#ffffff" opacity={0.9} />
      <circle cx="162" cy="189" r="9" fill="#ffffff" />
      <path d="m157.5 189 3 3 5-6" stroke="#7d88cb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Диплом с печатью — для блока «специалисты с подтверждённой квалификацией». */
export function DiplomaIllustration(props: Props) {
  return (
    <svg {...common} viewBox="0 0 260 220" {...props}>
      <defs>
        <linearGradient id="dp-paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6effa" />
        </linearGradient>
        <linearGradient id="dp-seal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a4aee6" />
          <stop offset="1" stopColor="#6b76bf" />
        </linearGradient>
        <filter id="dp-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="14" stdDeviation="10" floodColor="#3b495d" floodOpacity="0.28" />
        </filter>
      </defs>
      <g filter="url(#dp-shadow)" transform="rotate(-6 130 100)">
        <rect x="24" y="22" width="212" height="148" rx="14" fill="url(#dp-paper)" />
        <rect x="36" y="34" width="188" height="124" rx="8" stroke="#c9d6ea" strokeWidth="1.5" strokeDasharray="5 4" />
        <rect x="68" y="52" width="124" height="9" rx="4.5" fill="#3b495d" opacity={0.85} />
        <rect x="88" y="72" width="84" height="6" rx="3" fill="#c9d6ea" />
        <rect x="56" y="92" width="148" height="6" rx="3" fill="#dbe5f3" />
        <rect x="66" y="106" width="128" height="6" rx="3" fill="#dbe5f3" />
        <rect x="48" y="130" width="60" height="6" rx="3" fill="#c9d6ea" />
      </g>
      <g transform="translate(184 128) rotate(-6)">
        <path d="m-18 26-10 34 20-8 8 14 10-36Z" fill="#6b76bf" />
        <path d="m18 26 10 34-20-8-8 14-10-36Z" fill="#8a95d2" transform="translate(-4 0)" />
        <circle r="30" fill="url(#dp-seal)" />
        <circle r="23" stroke="#ffffff" strokeOpacity={0.7} strokeWidth="2" />
        <path d="m-10 0 7 7 14-15" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** Стоматологические инструменты: зеркало и зонд — декоративный элемент для панелей. */
export function InstrumentsIllustration(props: Props) {
  return (
    <svg {...common} viewBox="0 0 240 240" {...props}>
      <defs>
        <linearGradient id="in-steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#d3dff0" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <radialGradient id="in-glass" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#bcd6f2" />
        </radialGradient>
        <filter id="in-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="6" dy="10" stdDeviation="7" floodColor="#2f4a73" floodOpacity="0.32" />
        </filter>
      </defs>
      <g filter="url(#in-shadow)">
        {/* зеркало */}
        <g transform="rotate(32 120 120)">
          <rect x="114" y="62" width="12" height="164" rx="6" fill="url(#in-steel)" />
          <rect x="112" y="150" width="16" height="64" rx="8" fill="#f4f8fd" />
          <path d="M112 164h16M112 176h16M112 188h16" stroke="#c4d3e8" strokeWidth="2" />
          <circle cx="120" cy="46" r="34" fill="url(#in-steel)" />
          <circle cx="120" cy="46" r="27" fill="url(#in-glass)" />
          <path d="M104 36a20 20 0 0 1 16-10" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        </g>
        {/* зонд */}
        <g transform="rotate(-28 120 120)">
          <rect x="114" y="150" width="12" height="76" rx="6" fill="url(#in-steel)" />
          <rect x="112" y="160" width="16" height="54" rx="8" fill="#f4f8fd" />
          <path d="M120 152V40c0-14 2-22 12-24" stroke="#d3dff0" strokeWidth="5" strokeLinecap="round" />
          <path d="M120 152V44" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

/** Условный портрет врача на голубом диске — пока нет фотографий сотрудников. */
export function DoctorPortrait(props: Props) {
  return (
    <svg {...common} viewBox="0 0 120 120" {...props}>
      <defs>
        <linearGradient id="dr-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b9dcf6" />
          <stop offset="1" stopColor="#6f97cc" />
        </linearGradient>
        <linearGradient id="dr-coat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dce8f6" />
        </linearGradient>
        <clipPath id="dr-clip">
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="60" fill="url(#dr-bg)" />
      <g clipPath="url(#dr-clip)">
        <circle cx="34" cy="26" r="34" fill="#ffffff" opacity={0.22} />
        <path d="M14 124c0-26 20-40 46-40s46 14 46 40Z" fill="url(#dr-coat)" />
        <path d="M44 86 60 108 76 86" fill="#8cb9e6" />
        <path d="M44 86 60 108 76 86" stroke="#6f97cc" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="52" y="70" width="16" height="20" rx="7" fill="#f0c9b0" />
        <ellipse cx="60" cy="52" rx="19" ry="22" fill="#f6d7c1" />
        <path d="M40 50c-3-20 10-30 22-30s24 8 18 30c-3-9-8-13-14-14-8 3-16 5-26 14Z" fill="#4a5568" />
        <path d="M34 98c-6 4-8 12-8 20M86 98c6 4 8 12 8 20" stroke="#c4d3e8" strokeWidth="1.5" />
        <path d="M46 88c0 12 6 16 11 16" stroke="#7d88cb" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="59" cy="105" r="3.5" fill="#7d88cb" />
      </g>
    </svg>
  );
}

/** Глянцевый зуб с бликами — главная иллюстрация hero. */
export function ToothIllustration(props: Props) {
  return (
    <svg {...common} viewBox="0 0 260 280" {...props}>
      <defs>
        <linearGradient id="th-body" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#e9f2fc" />
          <stop offset="1" stopColor="#bcd3ee" />
        </linearGradient>
        <filter id="th-shadow" x="-30%" y="-20%" width="160%" height="150%">
          <feDropShadow dx="0" dy="22" stdDeviation="16" floodColor="#2f4a73" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#th-shadow)">
        <path
          d="M82 28c-34 0-58 24-58 62 0 30 12 48 20 74 8 27 10 84 36 84 22 0 24-42 32-64 4-11 11-15 18-15s14 4 18 15c8 22 10 64 32 64 26 0 28-57 36-84 8-26 20-44 20-74 0-38-24-62-58-62-22 0-34 12-48 12S104 28 82 28Z"
          fill="url(#th-body)"
        />
      </g>
      <path d="M58 70c4-16 16-24 30-24" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
      <path d="M52 100c0 8 1 14 3 20" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity={0.8} />
      <g fill="#ffffff">
        <path d="m214 30 4 12 12 4-12 4-4 12-4-12-12-4 12-4Z" />
        <path d="m34 190 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" opacity={0.8} />
      </g>
    </svg>
  );
}

/** Схема района с меткой — для карточек филиалов. */
export function MapIllustration(props: Props) {
  return (
    <svg {...common} viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" {...props}>
      <defs>
        <linearGradient id="mp-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e4f0fb" />
          <stop offset="1" stopColor="#cfe0f4" />
        </linearGradient>
        <linearGradient id="mp-pin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a4aee6" />
          <stop offset="1" stopColor="#6b76bf" />
        </linearGradient>
      </defs>
      <rect width="400" height="160" fill="url(#mp-bg)" />
      <path d="M-10 118c70-30 120 20 200-10s130-50 230-20" stroke="#bcd3ee" strokeWidth="16" strokeLinecap="round" />
      <g stroke="#ffffff" strokeWidth="9" strokeLinecap="round">
        <path d="M60-10 96 170M180-10l-20 180M290-10l40 180" />
        <path d="M-10 52h420M-10 138h420" opacity={0.8} />
      </g>
      <g fill="#ffffff" opacity={0.7}>
        <rect x="108" y="64" width="40" height="28" rx="6" />
        <rect x="204" y="62" width="64" height="30" rx="6" />
        <rect x="338" y="62" width="40" height="30" rx="6" />
        <rect x="20" y="8" width="36" height="32" rx="6" />
      </g>
      <ellipse cx="200" cy="112" rx="22" ry="7" fill="#3b495d" opacity={0.18} />
      <path d="M200 112c-22-26-30-36-30-52a30 30 0 0 1 60 0c0 16-8 26-30 52Z" fill="url(#mp-pin)" />
      <circle cx="200" cy="60" r="12" fill="#ffffff" />
    </svg>
  );
}
