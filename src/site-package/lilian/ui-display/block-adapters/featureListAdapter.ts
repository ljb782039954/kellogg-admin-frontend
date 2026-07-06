import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface FeatureListItemContent {
  icon: string;
  title: Translation;
  description: Translation;
}

export interface FeatureListContent {
  title?: Translation;
  subtitle?: Translation;
  items?: FeatureListItemContent[];
}


import type { FeatureListProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toFeatureListViewProps(content: FeatureListContent, lang: Language): FeatureListProps {
  const translate = createTranslate(lang);

  return {
    titleText: translate(content.title),
    subtitleText: translate(content.subtitle),
    items: (content.items ?? []).map((item) => ({
      icon: item.icon,
      titleText: translate(item.title),
      descriptionText: translate(item.description),
    })),
  };
}
