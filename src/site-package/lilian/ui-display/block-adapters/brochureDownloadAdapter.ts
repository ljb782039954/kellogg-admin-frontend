import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface BrochureDownloadContent {
  image: string;
  imageAlt?: Translation;
  eyebrow?: Translation;
  title?: Translation;
  description?: Translation;
  buttonText?: Translation;
  fileMeta?: Translation;
  href?: string;
}


import type { BrochureDownloadProps } from "../components/blocks/BrochureDownload";
import { createTranslate } from "../utils/i18n";

export function toBrochureDownloadViewProps(content: BrochureDownloadContent, lang: Language): BrochureDownloadProps {
  const translate = createTranslate(lang);

  return {
    image: content.image,
    imageAlt: translate(content.imageAlt),
    eyebrow: translate(content.eyebrow),
    titleText: translate(content.title),
    descriptionText: translate(content.description),
    buttonText: translate(content.buttonText),
    fileMeta: translate(content.fileMeta),
    href: content.href,
  };
}
