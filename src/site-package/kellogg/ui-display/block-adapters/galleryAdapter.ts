import type { Language } from "@/cms/types";

// 迁移类型
import type { Translation } from "@/cms/types";
export interface GalleryItemContent {
  src: string;
  caption?: Translation;
}

export interface GalleryContent {
  title?: Translation;
  subtitle?: Translation;
  items?: GalleryItemContent[];
}
import type { GalleryProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toGalleryViewProps(
  content: GalleryContent,
  lang: Language,
): GalleryProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    items: (content.items ?? []).map((item) => ({
      src: item.src,
      captionText: item.caption ? translate(item.caption) : "",
    })),
    labels: {
      viewImage: lang === "zh" ? "查看图片" : "View image",
      imagePreview: lang === "zh" ? "图片预览" : "Image preview",
      closePreview: lang === "zh" ? "关闭图片预览" : "Close image preview",
      previousImage: lang === "zh" ? "上一张图片" : "Previous image",
      nextImage: lang === "zh" ? "下一张图片" : "Next image",
    },
  };
}
