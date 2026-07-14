export interface SectionHeaderProps {
  titleText: string;
  subtitleText?: string;
  theme?: "dark" | "light";
  className?: string;
}

export default function SectionHeader({
  titleText,
  subtitleText,
  theme = "dark",
  className,
}: SectionHeaderProps) {
  const titleClass = theme === "dark" ? "text-on-dark" : "text-ink-strong";
  const subtitleClass = theme === "dark" ? "text-on-dark-soft" : "text-body";

  return (
    <div className={["mx-auto mb-10 max-w-2xl text-center", className].filter(Boolean).join(" ")}>
      <h2 className={`font-luxury-heading text-3xl font-light leading-tight md:text-4xl ${titleClass}`}>{titleText}</h2>
      {subtitleText && <p className={`mx-auto mt-3 max-w-xl text-sm leading-6 md:text-base ${subtitleClass}`}>{subtitleText}</p>}
    </div>
  );
}
