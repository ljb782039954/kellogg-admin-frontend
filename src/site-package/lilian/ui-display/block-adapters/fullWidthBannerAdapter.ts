import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface FullWidthBannerContent {
  image: string;
  imageAlt?: Translation;
  height?: "small" | "medium" | "large";
}


import type { FullWidthBannerProps } from "../components/blocks/FullWidthBanner";
import { createTranslate } from "../utils/i18n";

export function toFullWidthBannerViewProps(content: FullWidthBannerContent, lang: Language): FullWidthBannerProps {
  const translate = createTranslate(lang);

  return {
    image: content.image,
    imageAlt: translate(content.imageAlt),
    height: content.height,
  };
}
