import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface MainHeadingContent {
  title: Translation;
  subtitle?: Translation;
  description?: Translation;
  align?: "left" | "center";
}


import type { MainHeadingProps } from "../components/blocks/MainHeading";
import { createTranslate } from "../utils/i18n";

export function toMainHeadingViewProps(content: MainHeadingContent, lang: Language): MainHeadingProps {
  const translate = createTranslate(lang);

  return {
    titleText: translate(content.title),
    subtitleText: translate(content.subtitle),
    descriptionText: translate(content.description),
    align: content.align,
  };
}
