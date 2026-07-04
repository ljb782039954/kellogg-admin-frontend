import type { Language } from "@/cms/types";

// 迁移类型
import type { Translation } from "@/cms/types";
export interface StatisticContent {
  id: number;
  value: string;
  label: Translation;
}

export interface StatisticsContent {
  title?: Translation;
  subtitle?: Translation;
  items?: StatisticContent[];
}
import type { StatisticsProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toStatisticsViewProps(
  content: StatisticsContent,
  lang: Language,
): StatisticsProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    items: (content.items ?? []).map((item) => ({
      id: item.id,
      value: item.value,
      labelText: translate(item.label),
    })),
  };
}
