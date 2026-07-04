import type { Language, Translation } from '@/cms/types';

export function t(
  obj: string | Translation | null | undefined,
  lang: Language,
  fallbackLanguages: readonly Language[] = []
): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;

  return (
    obj[lang] ||
    fallbackLanguages.map((l) => obj[l]).find(Boolean) ||
    Object.values(obj).find(Boolean) ||
    ''
  );
}

export function resolveLink(href: string) {
  if (!href) return '/';
  if (href.startsWith('http')) return href;
  return href;
}
