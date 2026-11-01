const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all";

const variants = {
  /** Лавандовая «пилюля» со свечением — основное действие. */
  primary: "bg-brand text-white glow hover:bg-brand-strong hover:-translate-y-0.5",
  /** Белая «пилюля» — второстепенное действие. */
  light: "bg-white/90 text-brand-deep shadow-sm hover:bg-white",
  outline: "bg-white/60 text-brand-deep ring-1 ring-line hover:bg-white hover:ring-brand",
  /** Прозрачная кнопка на градиентной панели. */
  ghostLight: "bg-white/15 text-white ring-1 ring-white/50 hover:bg-white/25",
} as const;

const sizes = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-6 py-3 text-[15px]",
  lg: "px-8 py-4 text-base",
} as const;

export function buttonClass(
  variant: keyof typeof variants = "primary",
  size: keyof typeof sizes = "md",
) {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

/** Круглая иконка-«таблетка» из UI-кита макета. */
export const iconCircle =
  "flex shrink-0 items-center justify-center rounded-full bg-brand text-white glow";
