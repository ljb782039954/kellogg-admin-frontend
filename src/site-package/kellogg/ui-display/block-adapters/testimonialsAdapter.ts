import type { Language } from "@/cms/types";

// 迁移类型
import type { Translation } from "@/cms/types";
export interface TestimonialContent {
  id: number;
  name: Translation;
  role?: Translation;
  content: Translation;
  avatar?: string;
}

export interface TestimonialsContent {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
  items?: TestimonialContent[];
}
import type { TestimonialsProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toTestimonialsViewProps(
  content: TestimonialsContent,
  lang: Language,
): TestimonialsProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    items: (content.items ?? [])
      .slice(0, content.maxItems)
      .map((item) => ({
      id: item.id,
      nameText: translate(item.name),
      roleText: item.role ? translate(item.role) : "",
      contentText: translate(item.content),
      avatar: item.avatar,
    })),
  };
}
