import type { CmsCustomPage, SeoAlternate } from '@/cms/types';

export const HREFLANG_OPTIONS = [
  { value: 'x-default', label: '默认页面', description: '无法判断语言或地区时展示的默认链接' },
  { value: 'en', label: '英语', description: '不限定地区的英语页面' },
  { value: 'en-US', label: '美国英语', description: '美国用户优先展示的页面' },
  { value: 'en-GB', label: '英国英语', description: '英国用户优先展示的页面' },
  { value: 'en-CA', label: '加拿大英语', description: '加拿大用户优先展示的页面' },
  { value: 'en-AU', label: '澳大利亚英语', description: '澳大利亚用户优先展示的页面' },
  { value: 'zh', label: '中文', description: '不限定地区的中文页面' },
  { value: 'zh-CN', label: '中国大陆中文', description: '中国大陆用户优先展示的页面' },
  { value: 'zh-HK', label: '香港中文', description: '香港用户优先展示的页面' },
] as const;

export function normalizeHreflangHref(href: string): string {
  const value = href.trim();
  if (!value) return '';
  try {
    return normalizePagePath(new URL(value).pathname);
  } catch {
    return normalizePagePath(value);
  }
}

export function normalizePagePath(path: string): string {
  const value = path.trim();
  if (!value) return '/';
  const withSlash = value.startsWith('/') ? value : `/${value}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
}

export function getHreflangDescription(hreflang: string): string {
  return HREFLANG_OPTIONS.find((option) => option.value === hreflang)?.description
    || '选择搜索引擎识别的语言/地区代码';
}

export function createPageLinkOptions(pages: CmsCustomPage[]) {
  return pages
    .filter((page) => page.type !== 'fixed-layout')
    .map((page) => ({
      href: normalizePagePath(page.path),
      label: page.title.zh || page.title.en || page.path,
      description: normalizePagePath(page.path),
    }));
}

export function createEmptyAlternate(pages: CmsCustomPage[]): SeoAlternate {
  return {
    href: createPageLinkOptions(pages)[0]?.href || '/',
    hreflang: 'x-default',
    enabled: true,
  };
}

export function collectHreflangAlternatesFromPages(pages: CmsCustomPage[]): SeoAlternate[] {
  const pagePaths = new Set(pages.map((page) => normalizePagePath(page.path)));
  const seen = new Set<string>();
  const alternates: SeoAlternate[] = [];

  for (const page of pages) {
    for (const alternate of page.seo?.alternates || []) {
      const href = normalizeHreflangHref(alternate.href);
      if (!href || !pagePaths.has(href) || !alternate.hreflang) continue;

      const key = `${href}::${alternate.hreflang}`;
      if (seen.has(key)) continue;
      seen.add(key);
      alternates.push({
        href,
        hreflang: alternate.hreflang,
        enabled: alternate.enabled !== false,
      });
    }
  }

  return alternates;
}

export function getEnabledHreflangAlternates(alternates: SeoAlternate[]): SeoAlternate[] {
  const seen = new Set<string>();
  const enabled: SeoAlternate[] = [];

  for (const alternate of alternates) {
    const href = normalizeHreflangHref(alternate.href);
    const hreflang = alternate.hreflang.trim();
    if (alternate.enabled === false || !href || !hreflang) continue;

    const key = `${href}::${hreflang}`;
    if (seen.has(key)) continue;
    seen.add(key);
    enabled.push({ href, hreflang, enabled: true });
  }

  return enabled;
}

export function updateAlternate(
  alternates: SeoAlternate[],
  index: number,
  updates: Partial<SeoAlternate>
): SeoAlternate[] {
  return alternates.map((alternate, itemIndex) => (
    itemIndex === index ? { ...alternate, ...updates } : alternate
  ));
}

export function removeAlternate(alternates: SeoAlternate[], index: number): SeoAlternate[] {
  return alternates.filter((_, itemIndex) => itemIndex !== index);
}

export function hasDuplicateHreflang(alternates: SeoAlternate[], alternate: SeoAlternate): boolean {
  if (!alternate.hreflang || alternate.enabled === false) return false;
  return alternates.filter((item) => (
    item.enabled !== false && item.hreflang === alternate.hreflang
  )).length > 1;
}

export function hasDuplicateHref(alternates: SeoAlternate[], alternate: SeoAlternate): boolean {
  const href = normalizeHreflangHref(alternate.href);
  if (!href || alternate.enabled === false) return false;
  return alternates.filter((item) => (
    item.enabled !== false && normalizeHreflangHref(item.href) === href
  )).length > 1;
}

export function shouldPageReceiveHreflang(page: CmsCustomPage, alternates: SeoAlternate[]): boolean {
  const enabledHrefs = new Set(getEnabledHreflangAlternates(alternates).map((item) => item.href));
  return enabledHrefs.has(normalizePagePath(page.path));
}
