import type { Language, Product } from "@/cms/types";
import type { ProductCustomFieldItem } from "../components/base";
import { createTranslate } from "../utils/i18n";

export function toProductCustomFieldItems(
  customFields: Product["customFields"] = [],
  lang: Language,
): ProductCustomFieldItem[] {
  const translate = createTranslate(lang);

  return customFields.map((field) => {
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
