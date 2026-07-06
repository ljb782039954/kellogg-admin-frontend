import RichText from "@/runtime/components/RichText";

export interface RichTextBlockProps {
  titleText?: string;
  contentText: string;
  align?: "left" | "center";
  maxWidth?: "narrow" | "medium" | "wide";
}

const widthClass = {
  narrow: "max-w-2xl",
  medium: "max-w-3xl",
  wide: "max-w-5xl",
};

export default function RichTextBlock({
  titleText = "",
  contentText,
  align = "left",
  maxWidth = "medium",
}: RichTextBlockProps) {
  return (
    <section className="px-6 py-12">
      <div className={`${widthClass[maxWidth]} mx-auto ${align === "center" ? "text-center" : ""}`}>
        {titleText && <h2 className="font-luxury-heading text-3xl md:text-4xl mb-5">{titleText}</h2>}
        <RichText value={contentText} className="text-sm md:text-base text-body leading-7 space-y-4" />
      </div>
    </section>
  );
}



