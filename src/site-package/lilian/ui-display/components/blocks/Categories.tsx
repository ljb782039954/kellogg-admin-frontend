import OptimizedImage from "@/runtime/components/OptimizedImage";
import RichText from "@/runtime/components/RichText";
import type { Category, Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface CategoriesContent {
  title?: Translation;
  subtitle?: Translation;
  showAll?: boolean;
  maxItems?: number;
}

export interface CategoriesProps {
  content: CategoriesContent;
  categories: Category[];
  lang: Language;
}

export default function Categories({ 
  content,
  categories,
  lang,
}: CategoriesProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const displayCategories = content.showAll 
    ? (categories || []) 
    : (categories || []).slice(0, content.maxItems);

  if (displayCategories.length === 0) return null;

  const titleText = t(content.title);
  const subtitleText = t(content.subtitle);

  return (
    <section className="px-6 py-12 bg-surface">
      <div className="max-w-6xl mx-auto">
        {(titleText || subtitleText) && (
          <div className="text-center mb-10">
            {titleText && <h2 className="font-luxury-heading text-3xl md:text-4xl font-light">{titleText}</h2>}
            {subtitleText && <RichText value={subtitleText} className="mt-3 text-sm md:text-base text-body max-w-2xl mx-auto" />}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayCategories.map((category) => {
            const nameText = t(category.name);
            return (
              <a key={category.id} href={`/products?category=${category.id}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-media">
                  {category.image ? (
                    <OptimizedImage
                      src={category.image}
                      alt={nameText}
                      width={720}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-subtle">No Image</div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-5">
                    <h3 className="font-luxury-heading text-2xl text-on-dark">{nameText}</h3>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}



