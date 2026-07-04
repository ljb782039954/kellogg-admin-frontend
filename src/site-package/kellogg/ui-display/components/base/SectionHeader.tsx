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
  const titleClass = theme === "dark" ? "text-white" : "text-gray-900";
  const subtitleClass = theme === "dark" ? "text-white/70" : "text-gray-600";

  return (
    <div className={["text-center mb-12 max-w-2xl mx-auto", className].filter(Boolean).join(" ")}>
      <h2 className={`text-2xl md:text-4xl font-bold mb-4 ${titleClass}`}>{titleText}</h2>
      {subtitleText && <p className={`text-lg md:text-xl max-w-2xl mx-auto ${subtitleClass}`}>{subtitleText}</p>}
    </div>
  );
}
