import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface TextGridItem {
  title: Translation;
  text: Translation;
}

export interface TextGridContent {
  items: TextGridItem[];
}


import type { TextGridProps } from "../components/blocks/TextGrid";
import { createTranslate } from "../utils/i18n";

export function toTextGridViewProps(content: TextGridContent, lang: Language): TextGridProps {
  const translate = createTranslate(lang);

  return {
    items: content.items.map((item) => ({
      title: translate(item.title),
      text: translate(item.text),
    })),
  };
}
