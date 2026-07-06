import type { Language } from "@/cms/types";
import type { LilianImageItem } from "../types/common";

// 迁移类型
export interface MasonryGalleryImageItem extends LilianImageItem {
  heightClass?: string;
}

export interface MasonryGalleryContent {
  images: MasonryGalleryImageItem[];
}


import type { MasonryGalleryProps } from "../components/blocks/MasonryGallery";
import { createTranslate } from "../utils/i18n";

export function toMasonryGalleryViewProps(content: MasonryGalleryContent, lang: Language): MasonryGalleryProps {
  const translate = createTranslate(lang);

  return {
    images: content.images.map((item) => ({
      image: item.image,
      imageAlt: translate(item.imageAlt),
      caption: translate(item.caption),
      heightClass: item.heightClass,
    })),
  };
}
