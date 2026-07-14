import type { Language, Product } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface ProductCustomFieldItem {
  nameText: string;
  parts: string[];
}

export interface ProductCustomFieldsProps {
  customFields?: Product["customFields"];
  lang?: Language;
}

export default function ProductCustomFields({ 
  customFields = [], 
  lang 
}: ProductCustomFieldsProps) {
  let displayFields: ProductCustomFieldItem[] = [];

  if (customFields.length > 0 && lang) {
    const translate = createTranslate(lang);
    displayFields = customFields.map((field) => {
      const valueText = translate(field.value);
      const parts = valueText
        .split(/\/\/|\\\\/)
        .map((part) => part.trim())
        .filter(Boolean);

      return {
        nameText: translate(field.name),
        parts: parts.length > 0 ? parts : [valueText],
      };
    });
  }

  if (displayFields.length === 0) return null;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-y-10 gap-x-20 py-16 border-t border-gray-100">
      {displayFields.map((field, idx) => (
        <div key={`${field.nameText}-${idx}`} className="flex flex-col gap-3">
          <p className="text-xs text-gray-800 uppercase font-black tracking-widest">
            {idx + 1}. {field.nameText}
          </p>

          <div className="space-y-3">
            {field.parts.length > 1 ? (
              <ul className="space-y-3">
                {field.parts.map((part, partIndex) => (
                  <li key={`${part}-${partIndex}`} className="flex items-start gap-3 group">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-primary transition-colors flex-shrink-0" />
                    <span className="text-gray-600 leading-relaxed text-base">
                      {part}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-start gap-3 group">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-primary transition-colors flex-shrink-0" />
                <p className="text-gray-600 leading-relaxed text-base">{field.parts[0]}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
