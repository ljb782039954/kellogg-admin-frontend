import type { Language } from "@/cms/types";

// 迁移类型
import type { Translation } from "@/cms/types";
export interface PartnerLogoContent {
  id?: string;
  logo: string;
  name: string;
  color?: string;
  link?: string;
}

export interface PartnerLogosContent {
  title?: Translation;
  subtitle?: Translation;
  items?: PartnerLogoContent[];
}
import type { PartnerLogosProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toPartnerLogosViewProps(
  content: PartnerLogosContent,
  lang: Language,
): PartnerLogosProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    moreText: translate({
      zh: "以及更多优质合作伙伴...",
      en: "And many more quality partners...",
    }),
    items: content.items ?? [],
  };
}
