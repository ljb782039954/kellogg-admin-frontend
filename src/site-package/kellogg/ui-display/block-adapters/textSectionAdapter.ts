import type { Language } from "@/cms/types";

// 迁移类型
import type { Translation } from "@/cms/types";
export interface TextSectionContent {
  title?: Translation;
  content?: Translation;
  alignment?: "left" | "center" | "right";
  paddingY?: "small" | "medium" | "large";
  backgroundColor?: string;
}
import type { TextSectionProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toTextSectionViewProps(
  content: TextSectionContent,
  lang: Language,
): TextSectionProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    contentText: content.content ? translate(content.content) : "",
    alignment: content.alignment,
    paddingY: content.paddingY,
    backgroundColor: content.backgroundColor,
  };
}
