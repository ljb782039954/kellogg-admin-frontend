import OptimizedImage from "@/runtime/components/OptimizedImage";
import { createTranslate } from "../../utils/i18n";
import type { Category, Language, Translation } from "@/cms/types";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface Categories2Content {
  showAll?: boolean;
  maxItems?: number;
  categories: Category[];
}

export interface Categories2Props {
  content: Categories2Content;
  lang: Language;
}

export default function Categories2({ content, lang = "en",}: Categories2Props) {
  const t = createTranslate(lang);
  const displayCategories = content.showAll 
    ? (content.categories || []) 
    : (content.categories || []).slice(0, content.maxItems);

  if (displayCategories.length === 0) return null;


  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-center gap-8 flex-wrap">
        {displayCategories.map((item, index) => (
          <div key={`${item.image}-${index}`} className="text-center group cursor-pointer">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mx-auto mb-3 border-2 border-border group-hover:border-border transition-colors">
              <OptimizedImage
                src={item.image}
                alt={t(item.name)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="112px"
              />
            </div>
            {item.name && <p className="text-xs text-body group-hover:text-ink-strong transition-colors">{t(item.name)}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}


