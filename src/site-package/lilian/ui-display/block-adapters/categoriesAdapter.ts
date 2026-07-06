import type { Category, Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface CategoriesContent {
  title?: Translation;
  subtitle?: Translation;
  showAll?: boolean;
  maxItems?: number;
}


import type { CategoriesProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

interface CategoriesAdapterOptions {
  categories: Category[];
  lang: Language;
}

export function toCategoriesViewProps(
  content: CategoriesContent,
  { categories, lang }: CategoriesAdapterOptions,
): CategoriesProps {
  const translate = createTranslate(lang);
  const displayCategories = content.showAll ? categories : categories.slice(0, content.maxItems);

  return {
    titleText: translate(content.title),
    subtitleText: translate(content.subtitle),
    items: displayCategories.map((category) => ({
      id: category.id,
      href: `/products?category=${category.id}`,
      image: category.image,
      nameText: translate(category.name),
    })),
  };
}
