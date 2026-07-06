import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface CertificationBadgeItem {
  name: string;
  fullName?: Translation;
  description?: Translation;
}

export interface CertificationBadgesContent {
  eyebrow?: Translation;
  certifications: CertificationBadgeItem[];
}


import type { CertificationBadgesProps } from "../components/blocks/CertificationBadges";
import { createTranslate } from "../utils/i18n";

export function toCertificationBadgesViewProps(
  content: CertificationBadgesContent,
  lang: Language,
): CertificationBadgesProps {
  const translate = createTranslate(lang);

  return {
    eyebrow: translate(content.eyebrow),
    certifications: content.certifications.map((item) => ({
      name: item.name,
      fullName: translate(item.fullName),
      description: translate(item.description),
    })),
  };
}
