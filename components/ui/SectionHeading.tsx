type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
  /** Для тёмного фона */
  inverted?: boolean;
};

export function SectionHeading({ eyebrow, title, lead, align = "center", inverted }: Props) {
  const centered = align === "center";
  return (
    <div className={`max-w-2xl ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p
          className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
            inverted ? "bg-white/10 text-accent" : "bg-brand-soft text-brand"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-3xl leading-tight sm:text-4xl ${
          inverted ? "text-white" : "text-brand-deep"
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p className={`mt-4 text-base sm:text-lg ${inverted ? "text-white/75" : "text-muted"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}
