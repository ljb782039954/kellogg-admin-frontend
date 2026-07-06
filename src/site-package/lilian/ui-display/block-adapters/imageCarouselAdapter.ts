import type { Language } from "@/cms/types";
import type { LilianImageItem } from "../types/common";

// 迁移类型
export interface ImageCarouselContent {
  images: LilianImageItem[];
  autoplay?: boolean;
  interval?: number;
}


import type { ImageCarouselProps } from "../components/blocks/ImageCarousel";
import { createTranslate } from "../utils/i18n";

export function toImageCarouselViewProps(content: ImageCarouselContent, lang: Language): ImageCarouselProps {
  const translate = createTranslate(lang);

  return {
    images: content.images.map((item) => ({
      image: item.image,
      imageAlt: translate(item.imageAlt),
      caption: translate(item.caption),
    })),
    autoplay: content.autoplay,
    interval: content.interval,
  };
}
