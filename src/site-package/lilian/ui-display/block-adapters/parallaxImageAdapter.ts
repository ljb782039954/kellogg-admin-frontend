import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface ParallaxImageContent {
  image: string;
  imageAlt?: Translation;
  eyebrow?: Translation;
  title?: Translation;
  height?: "medium" | "large";
}


import type { ParallaxImageProps } from "../components/blocks/ParallaxImage";
import { createTranslate } from "../utils/i18n";

export function toParallaxImageViewProps(content: ParallaxImageContent, lang: Language): ParallaxImageProps {
  const translate = createTranslate(lang);

  return {
    image: content.image,
    imageAlt: translate(content.imageAlt),
    eyebrow: translate(content.eyebrow),
    titleText: translate(content.title),
    height: content.height,
  };
}
