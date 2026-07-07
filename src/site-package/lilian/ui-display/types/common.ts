import type { Translation } from "@/cms/types";
import type { EmbeddedVideoAspect } from "@/runtime/components/EmbeddedVideo";

export interface LilianImageItem {
  image: string;
  imageAlt?: Translation;
  caption?: Translation;
}

export interface LilianExternalVideoItem {
  title?: Translation;
  description?: Translation;
  url: string;
  coverImage: string;
  coverImageAlt?: Translation;
  aspect?: EmbeddedVideoAspect;
}

export interface LilianTextItem {
  title: Translation;
  content?: Translation;
}
