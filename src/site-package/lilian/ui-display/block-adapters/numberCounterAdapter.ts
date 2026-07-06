import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface NumberCounterItem {
  value: number;
  suffix?: string;
  label: Translation;
}

export interface NumberCounterContent {
  stats: NumberCounterItem[];
}


import type { NumberCounterProps } from "../components/blocks/NumberCounter";
import { createTranslate } from "../utils/i18n";

export function toNumberCounterViewProps(content: NumberCounterContent, lang: Language): NumberCounterProps {
  const translate = createTranslate(lang);

  return {
    stats: content.stats.map((item) => ({
      value: item.value,
      suffix: item.suffix,
      label: translate(item.label),
    })),
  };
}
