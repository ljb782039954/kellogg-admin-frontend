import type { Language } from "@/cms/types";
import type { LilianImageItem } from "../types/common";

// 迁移类型
export interface LightboxGalleryContent {
  images: LilianImageItem[];
}


import type { LightboxGalleryProps } from "../components/blocks/LightboxGallery";
import { createTranslate } from "../utils/i18n";

export function toLightboxGalleryViewProps(content: LightboxGalleryContent, lang: Language): LightboxGalleryProps {
  const translate = createTranslate(lang);

  return {
    images: content.images.map((item) => ({
      image: item.image,
      imageAlt: translate(item.imageAlt),
      caption: translate(item.caption),
    })),
  };
}
