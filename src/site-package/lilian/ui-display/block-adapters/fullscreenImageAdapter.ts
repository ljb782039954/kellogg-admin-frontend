import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface FullscreenImageBackgroundContent {
  image: string;
  imageAlt?: Translation;
  eyebrow?: Translation;
  title?: Translation;
  overlay?: boolean;
}


import type { FullscreenImageBackgroundProps } from "../components/blocks/FullscreenImageBackground";
import { createTranslate } from "../utils/i18n";

export function toFullscreenImageBackgroundViewProps(
  content: FullscreenImageBackgroundContent,
  lang: Language,
): FullscreenImageBackgroundProps {
  const translate = createTranslate(lang);

  return {
    image: content.image,
    imageAlt: translate(content.imageAlt),
    eyebrow: translate(content.eyebrow),
    titleText: translate(content.title),
    overlay: content.overlay,
  };
}
