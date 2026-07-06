import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface BeforeAfterSliderContent {
  eyebrow?: Translation;
  beforeImage: string;
  beforeImageAlt?: Translation;
  afterImage: string;
  afterImageAlt?: Translation;
}


import type { BeforeAfterSliderProps } from "../components/blocks/BeforeAfterSlider";
import { createTranslate } from "../utils/i18n";

export function toBeforeAfterSliderViewProps(content: BeforeAfterSliderContent, lang: Language): BeforeAfterSliderProps {
  const translate = createTranslate(lang);

  return {
    eyebrow: translate(content.eyebrow),
    beforeImage: content.beforeImage,
    beforeImageAlt: translate(content.beforeImageAlt),
    afterImage: content.afterImage,
    afterImageAlt: translate(content.afterImageAlt),
  };
}
