const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-colors";

const variants = {
  primary: "bg-brand text-white hover:bg-brand-strong",
  accent: "bg-accent text-white hover:bg-accent-strong",
  outline: "border border-line bg-white text-brand hover:border-brand",
  light: "bg-white text-brand-deep hover:bg-brand-soft",
  ghostLight: "border border-white/30 text-white hover:bg-white/10",
} as const;

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-base",
} as const;

export function buttonClass(
  variant: keyof typeof variants = "primary",
  size: keyof typeof sizes = "md",
) {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}
