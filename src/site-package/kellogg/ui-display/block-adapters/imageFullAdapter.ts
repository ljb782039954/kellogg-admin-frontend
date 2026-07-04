import type { Language } from "@/cms/types";

// 迁移类型
import type { Translation } from "@/cms/types";
export interface ImageFullContent {
  image?: string;
  description?: Translation;
  alt?: Translation;
  width?: "small" | "medium" | "large" | "full";
  height?: "small" | "medium" | "large" | "full";
  overlay?: boolean;
}
import type { ImageFullProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toImageFullViewProps(
  content: ImageFullContent,
  lang: Language,
): ImageFullProps {
  const translate = createTranslate(lang);

  return {
    image: content.image,
    descriptionText: content.description ? translate(content.description) : "",
    altText: content.alt ? translate(content.alt) : "",
    width: content.width,
    height: content.height,
    overlay: content.overlay,
    labels: {
      noImage: lang === "zh" ? "未选择图片" : "No image selected",
      openFullscreen: lang === "zh" ? "打开全屏图片" : "Open fullscreen image",
      fullscreenPreview: lang === "zh" ? "全屏图片预览" : "Fullscreen image preview",
      closeFullscreen: lang === "zh" ? "关闭全屏图片" : "Close fullscreen image",
    },
  };
}
