import RichText from "@/runtime/components/RichText";

export interface MainHeadingProps {
  titleText: string;
  subtitleText?: string;
  descriptionText?: string;
  align?: "left" | "center";
}

export default function MainHeading({
  titleText,
  subtitleText,
  descriptionText,
  align = "center",
}: MainHeadingProps) {
  return (
    <section className={`max-w-4xl mx-auto px-6 py-10 space-y-6 ${align === "center" ? "text-center" : ""}`}>
      <h2
        className="text-3xl sm:text-4xl font-bold leading-tight"
        style={{ fontFamily: "Georgia, serif", color: "var(--color-ink)" }}
      >
        {titleText}
      </h2>
      {subtitleText && (
        <p className="text-sm uppercase text-subtle" >{subtitleText}</p>
      )}
      {descriptionText && (
          <RichText value={descriptionText} className="text-sm md:text-base leading-[1.9] text-body" />
      )}
    </section>
  );
}



