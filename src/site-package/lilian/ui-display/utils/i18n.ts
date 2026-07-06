import { createTranslate as createCoreTranslate } from "@/cms/lib/i18n";
import type { Language } from "@/cms/types";

const fallbackLanguages = ["en", "zh"] satisfies readonly Language[];

export function createTranslate(language: Language) {
  return createCoreTranslate(language, fallbackLanguages);
}
