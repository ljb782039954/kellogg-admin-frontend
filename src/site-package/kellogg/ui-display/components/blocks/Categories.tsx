import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Category } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface CategoriesContent{
  showAll?: boolean;
  maxItems?: number;
}
export interface CategoriesProps {
  content: CategoriesContent;
  categories: Category[];
  lang: Language;
}

export default function Categories({ content:{ showAll, maxItems, }, categories = [], lang }: CategoriesProps) {
  const t = createTranslate(lang);
  const displayCategories = showAll
    ? categories
    : categories.slice(0, maxItems);

  if (displayCategories.length === 0) return null;

  return (
    <section className="py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {displayCategories.map((category) => (
            <div key={category.id} className="text-center group cursor-pointer">
              <div className="w-full aspect-[1/1.5] max-w-[60px] mx-auto bg-white rounded-full overflow-hidden flex items-center justify-center shadow-sm mb-2 group-hover:shadow-md group-hover:scale-105 transition-all">
                {category.image ? (
                  <OptimizedImage src={category.image} alt={t(category.name)} width={120} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-300">No Image</span>
                )}
              </div>
              <span className="text-sm font-medium group-hover:text-primary transition-colors">{t(category.name)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
