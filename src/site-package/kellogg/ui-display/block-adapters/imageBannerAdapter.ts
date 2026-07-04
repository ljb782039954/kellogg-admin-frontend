import type { Language } from "@/cms/types";

// 迁移类型
import type { Translation } from "@/cms/types";
export interface ImageBannerContent {
  image?: string;
  title?: Translation;
  subtitle?: Translation;
  buttonText?: Translation;
  linkUrl?: string;
  height?: "small" | "medium" | "large" | "full";
  overlay?: boolean;
}
import type { ImageBannerProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toImageBannerViewProps(
  content: ImageBannerContent,
  lang: Language,
): ImageBannerProps {
  const translate = createTranslate(lang);
  const titleText = content.title ? translate(content.title) : "";

  return {
    image: content.image,
    imageAlt: titleText || "Banner",
    titleText,
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    buttonText: content.buttonText ? translate(content.buttonText) : "",
    linkUrl: content.linkUrl,
    height: content.height,
    overlay: content.overlay,
  };
}
