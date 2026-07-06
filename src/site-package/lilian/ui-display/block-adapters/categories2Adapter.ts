import type { Language } from "@/cms/types";
import type { LilianImageItem } from "../types/common";

// 迁移类型
export interface Categories2Content {
  items: LilianImageItem[];
}


import type { Categories2Props } from "../components/blocks/Categories2";
import { createTranslate } from "../utils/i18n";

export function toCategories2ViewProps(content: Categories2Content, lang: Language): Categories2Props {
  const translate = createTranslate(lang);

  return {
    items: content.items.map((item) => ({
      image: item.image,
      imageAlt: translate(item.imageAlt),
      caption: translate(item.caption),
    })),
  };
}
