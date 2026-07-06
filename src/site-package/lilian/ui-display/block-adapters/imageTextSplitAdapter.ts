import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface ImageTextSplitContent {
  eyebrow?: Translation;
  title?: Translation;
  content?: Translation;
  image: string;
  imageAlt?: Translation;
  imagePosition?: "left" | "right";
}


import type { ImageTextSplitProps } from "../components/blocks/ImageTextSplit";
import { createTranslate } from "../utils/i18n";

export function toImageTextSplitViewProps(content: ImageTextSplitContent, lang: Language): ImageTextSplitProps {
  const translate = createTranslate(lang);
  const titleText = translate(content.title);

  return {
    eyebrow: translate(content.eyebrow),
    titleText,
    contentText: translate(content.content),
    image: content.image,
    imageAlt: translate(content.imageAlt, titleText),
    imagePosition: content.imagePosition,
  };
}
