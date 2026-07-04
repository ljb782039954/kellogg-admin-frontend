import type { Language } from "@/cms/types";
import type { BrandValuesProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

// 迁移类型
import type { Translation } from "@/cms/types";

export interface BrandValueContent {
  id: number;
  icon: string;
  title: Translation;
  description: Translation;
}

export interface BrandValuesContent {
  title?: Translation;
  subtitle?: Translation;
  items?: BrandValueContent[];
}


export function toBrandValuesViewProps(
  content: BrandValuesContent,
  lang: Language,
): BrandValuesProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    items: (content.items ?? []).map((item) => ({
      id: item.id,
      icon: item.icon,
      titleText: translate(item.title),
      descriptionText: translate(item.description),
    })),
  };
}

