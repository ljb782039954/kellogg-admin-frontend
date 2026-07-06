import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";
import type { LilianExternalVideoItem } from "../types/common";


export interface VideoGridContent {
  items: LilianExternalVideoItem[];
}

export interface VideoPopupContent extends LilianExternalVideoItem {
  caption?: Translation;
}


import { getSafeVideoSource, type SafeVideoProvider } from "@/cms/lib/video";
import type { FullscreenVideoPopupProps } from "../components/blocks/FullscreenVideoPopup";
import type { VideoCardProps, VideoGridProps } from "../components/blocks/VideoGrid";
import { createTranslate } from "../utils/i18n";

const EXTERNAL_VIDEO_PROVIDERS: SafeVideoProvider[] = ["youtube", "vimeo", "facebook", "tiktok", "twitter"];

function toExternalVideoSource(url: string) {
  return getSafeVideoSource(url, {
    providers: EXTERNAL_VIDEO_PROVIDERS,
  });
}

function toVideoCards(items: VideoGridContent["items"], lang: Language): VideoCardProps[] {
  const translate = createTranslate(lang);

  return items.map((item) => ({
    title: translate(item.title),
    description: translate(item.description),
    coverImage: item.coverImage,
    coverImageAlt: translate(item.coverImageAlt),
    aspect: item.aspect,
    source: toExternalVideoSource(item.url),
  }));
}


export function toVideoGridViewProps(content: VideoGridContent, lang: Language): VideoGridProps {
  return {
    items: toVideoCards(content.items, lang),
  };
}

export function toVideoPopupViewProps(
  content: VideoPopupContent,
  lang: Language,
): FullscreenVideoPopupProps {
  const translate = createTranslate(lang);

  return {
    source: toExternalVideoSource(content.url),
    title: translate(content.title),
    coverImage: content.coverImage,
    coverImageAlt: translate(content.coverImageAlt),
    aspect: content.aspect,
    caption: translate(content.caption),
  };
}
