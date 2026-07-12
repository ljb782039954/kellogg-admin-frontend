import type { Translation } from "@/cms/types";
// import type { EmbeddedVideoAspect } from "@/runtime/components/EmbeddedVideo";

export interface LilianImageItem {
  image: string;
  imageAlt?: Translation;
  caption?: Translation;
}

export interface LilianExternalVideoItem {
  url: string;
  title?: Translation;
  description?: Translation;
  coverImage: string;
  coverImageAlt?: Translation;
  aspect?: "auto" | "video" | "square" | "portrait";
}
