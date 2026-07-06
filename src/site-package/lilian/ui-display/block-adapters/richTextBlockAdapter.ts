import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface RichTextBlockContent {
  title?: Translation;
  content: Translation;
  align?: "left" | "center";
  maxWidth?: "narrow" | "medium" | "wide";
}


import type { RichTextBlockProps } from "../components/blocks/RichTextBlock";
import { createTranslate } from "../utils/i18n";

export function toRichTextBlockViewProps(content: RichTextBlockContent, lang: Language): RichTextBlockProps {
  const translate = createTranslate(lang);

  return {
    titleText: translate(content.title),
    contentText: translate(content.content),
    align: content.align,
    maxWidth: content.maxWidth,
  };
}
