import type { Language } from "@/cms/types";
import type { LilianImageItem } from "../types/common";

// 迁移类型
export interface ImagePairGridContent {
  images: [LilianImageItem, LilianImageItem];
}


import type { ImageGridItemProps, ImagePairGridProps } from "../components/blocks/ImagePairGrid";
import { createTranslate } from "../utils/i18n";


function toImageGridItems(
  images: ImagePairGridContent["images"] ,
  lang: Language,
): ImageGridItemProps[] {
  const translate = createTranslate(lang);

  return images.map((item) => ({
    image: item.image,
    imageAlt: translate(item.imageAlt),
    caption: translate(item.caption),
  }));
}

export function toImagePairGridViewProps(content: ImagePairGridContent, lang: Language): ImagePairGridProps {
  return {
    images: toImageGridItems(content.images, lang) as ImagePairGridProps["images"],
  };
}
