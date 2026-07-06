import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface BrandManifestoContent {
  eyebrow?: Translation;
  quote: Translation;
  attribution?: Translation;
  backgroundColor?: string;
}


import type { BrandManifestoProps } from "../components/blocks/BrandManifesto";
import { createTranslate } from "../utils/i18n";

export function toBrandManifestoViewProps(content: BrandManifestoContent, lang: Language): BrandManifestoProps {
  const translate = createTranslate(lang);

  return {
    eyebrow: translate(content.eyebrow),
    quote: translate(content.quote),
    attribution: translate(content.attribution),
    backgroundColor: content.backgroundColor,
  };
}
