import type { Language } from "@/cms/types";

// 迁移类型
import type { Translation } from "@/cms/types";
export interface ImageBannerTagContent {
  image?: string;
  tag?: Translation;
  title?: Translation;
  subtitle?: Translation;
}
import type { ImageBannerTagProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

interface ImageBannerTagAdapterContext {
  lang: Language;
  getImageUrl: (src: string, width: number) => string;
}

export function toImageBannerTagViewProps(
  content: ImageBannerTagContent,
  { lang, getImageUrl }: ImageBannerTagAdapterContext,
): ImageBannerTagProps {
  const translate = createTranslate(lang);

  return {
    tagText: content.tag ? translate(content.tag) : "",
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    imageUrl: content.image ? getImageUrl(content.image, 1920) : "",
  };
}
