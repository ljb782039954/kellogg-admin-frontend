import type { Language } from "@/cms/types";

// 迁移类型
import type { Translation } from "@/cms/types";
export interface VideoSectionValues {
  videoUrl?: string;
  posterImage?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export interface VideoSectionContent {
  title?: Translation;
  subtitle?: Translation;
  videoUrl?: string;
  values?: VideoSectionValues;
}
import type { VideoSectionProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";
import { toProductVideoSource } from "./productMediaAdapter";

export function toVideoSectionViewProps(
  content: VideoSectionContent,
  lang: Language,
): VideoSectionProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    videoSource: toProductVideoSource(
      content.videoUrl || content.values?.videoUrl,
      content.values?.posterImage,
    ),
  };
}
