import type { Language } from "@/cms/types";

// 迁移类型
export interface CategoriesContent {
  showAll?: boolean;
  maxItems?: number;
}
import type { CategoriesProps } from "../components/blocks";
import type { Category } from "@/cms/types";
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
  const displayCategories = content.showAll
    ? categories
    : categories.slice(0, content.maxItems);

  return {
    items: displayCategories.map((category) => ({
      id: category.id,
      image: category.image,
      nameText: translate(category.name),
    })),
  };
}
