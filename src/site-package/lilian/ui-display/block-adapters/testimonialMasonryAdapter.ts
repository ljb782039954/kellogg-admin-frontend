import type { Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface TestimonialMasonryItem {
  name: string;
  company?: string;
  avatar?: string;
  text: Translation;
  rating?: number;
}

export interface TestimonialMasonryContent {
  reviews: TestimonialMasonryItem[];
}

// 
import type { TestimonialMasonryProps } from "../components/blocks/TestimonialMasonry";
import { createTranslate } from "../utils/i18n";

export function toTestimonialMasonryViewProps(
  content: TestimonialMasonryContent,
  lang: Language,
): TestimonialMasonryProps {
  const translate = createTranslate(lang);

  return {
    reviews: content.reviews.map((item) => ({
      name: item.name,
      company: item.company,
      avatar: item.avatar,
      text: translate(item.text),
      rating: item.rating,
    })),
  };
}
