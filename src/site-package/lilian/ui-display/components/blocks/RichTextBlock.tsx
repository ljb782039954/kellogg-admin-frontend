import RichText from "@/runtime/components/RichText";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface RichTextBlockContent {
  title?: Translation;
  content: Translation;
  align?: "left" | "center";
  maxWidth?: "narrow" | "medium" | "wide";
}

export interface RichTextBlockProps {
  content: RichTextBlockContent;
  lang: Language;
}

const widthClass = {
  narrow: "max-w-2xl",
  medium: "max-w-3xl",
  wide: "max-w-5xl",
};

export default function RichTextBlock({
  content,
  lang = "en",
}: RichTextBlockProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedTitle = t(content.title);
  const resolvedContent = t(content.content) || "";
  const resolvedAlign = content.align || "left";
  const resolvedMaxWidth = content.maxWidth || "medium";

  return (
    <section className="px-6 py-12">
      <div className={`${widthClass[resolvedMaxWidth]} mx-auto ${resolvedAlign === "center" ? "text-center" : ""}`}>
        {resolvedTitle && <h2 className="font-luxury-heading text-3xl md:text-4xl mb-5">{resolvedTitle}</h2>}
        <RichText value={resolvedContent} className="text-sm md:text-base text-body leading-7 space-y-4" />
      </div>
    </section>
  );
}


