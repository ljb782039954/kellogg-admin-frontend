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
    <div className="grid grid-cols-1 gap-x-16 gap-y-8 border-t border-border py-12 md:grid-cols-2">
      {displayFields.map((field, idx) => (
        <div key={`${field.nameText}-${idx}`} className="border-l border-border pl-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-subtle">
            {String(idx + 1).padStart(2, "0")} / {field.nameText}
          </p>

          <div className="mt-3">
            {field.parts.length > 1 ? (
              <ul className="space-y-2.5">
                {field.parts.map((part, partIndex) => (
                  <li key={`${part}-${partIndex}`} className="flex items-start gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-ink-strong" />
                    <span className="text-sm leading-6 text-body">
                      {part}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 bg-ink-strong" />
                <p className="text-sm leading-6 text-body">{field.parts[0]}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
