import type { CSSProperties } from "react";
import RichText from "@/runtime/components/RichText";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface TextSectionContent {
  title?: Translation;
  content?: Translation;
  alignment?: "left" | "center" | "right";
  paddingY?: "small" | "medium" | "large";
  backgroundColor?: string;
}
export interface TextSectionProps {
  content: TextSectionContent;
  lang: Language;
}

const alignmentClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const paddingClass = {
  small: "py-8",
  medium: "py-12",
  large: "py-20",
};

export default function TextSection({
  content: {
    title,
    content,
    alignment = "center",
    paddingY = "medium",
    backgroundColor,
  },
  lang,
}: TextSectionProps) {
  const translate = createTranslate(lang);
  const titleText = title ? translate(title) : "";
  const contentText = content ? translate(content) : "";
  const style: CSSProperties | undefined = backgroundColor ? { backgroundColor } : undefined;

  return (
    <section className={`${paddingClass[paddingY]} ${backgroundColor ? "" : "bg-gray-50"} ${alignmentClass[alignment]}`} style={style}>
      <div className="container mx-auto px-4">
        {titleText && <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">{titleText}</h1>}
        {contentText && <RichText value={contentText} className="text-sm content-rich-text" />}
      </div>
    </section>
  );
}
