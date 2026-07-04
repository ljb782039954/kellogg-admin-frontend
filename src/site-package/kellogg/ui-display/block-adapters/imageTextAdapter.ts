import type { Language } from "@/cms/types";

// 迁移类型
import type { Translation } from "@/cms/types";
export interface ImageTextContent {
  title?: Translation;
  content?: Translation;
  image?: string;
  imagePosition?: "left" | "right";
  buttonText?: Translation;
  buttonLink?: string;
}
import type { ImageTextProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toImageTextViewProps(
  content: ImageTextContent,
  lang: Language,
): ImageTextProps {
  const translate = createTranslate(lang);
  const titleText = content.title ? translate(content.title) : "";

  return {
    titleText,
    contentText: content.content ? translate(content.content) : "",
    image: content.image,
    imageAlt: titleText || "Section Image",
    imagePosition: content.imagePosition,
    buttonText: content.buttonText ? translate(content.buttonText) : "",
    buttonLink: content.buttonLink,
  };
}
