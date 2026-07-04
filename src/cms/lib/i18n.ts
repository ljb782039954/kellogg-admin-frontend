import type { Translation, Language } from "@/cms/types";

export function createTranslate(
  language: Language,
  fallbackLanguages: readonly Language[] = []
) {
  return (
    value: string | Translation | null | undefined,
    fallback?: string
  ): string => {
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    return (
      value[language] ||
      fallback ||
      fallbackLanguages.map((lang) => value[lang]).find(Boolean) ||
      Object.values(value)[0] ||
      ""
    );
  };
}
