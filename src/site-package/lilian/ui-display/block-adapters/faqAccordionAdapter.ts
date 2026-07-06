import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface FaqAccordionItem {
  question: Translation;
  answer: Translation;
}

export interface FaqAccordionContent {
  title?: Translation;
  items: FaqAccordionItem[];
}


import type { FaqAccordionProps } from "../components/blocks/FaqAccordion";
import { createTranslate } from "../utils/i18n";

export function toFaqAccordionViewProps(content: FaqAccordionContent, lang: Language): FaqAccordionProps {
  const translate = createTranslate(lang);

  return {
    title: translate(content.title),
    items: content.items.map((item) => ({
      question: translate(item.question),
      answer: translate(item.answer),
    })),
  };
}
