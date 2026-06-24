import type { Translation } from '@/shared/i18n/translation';
import type { CustomPage, NavLink } from '@/package/types';

interface PageLike extends CustomPage {
  slug?: string;
}

/**
 * 校验链接指向的页面是否存在
 */
export function checkPageExists(
  href: string | undefined,
  linkType: 'internal' | 'external',
  pages: PageLike[] = [],
): boolean {
  if (linkType === 'external' || !href) return true;
  return pages.some((p) => p.id === href || p.path === href || p.slug === href);
}

/**
 * 将旧版字符串链接转换为 NavLink 对象，用于向下兼容和初期迁移
 */
export function ensureNavLink(
  val: unknown,
  defaultName: Translation = { zh: '立即行动', en: 'Take Action' },
): NavLink {
  if (isPartialNavLink(val)) {
    return {
      ...val,
      id: val.id || Math.random().toString(36).substr(2, 9),
      name: val.name || defaultName,
      linkType: val.linkType || (val.href.startsWith('http') ? 'external' : 'internal'),
    };
  }
  
  const href = typeof val === 'string' ? val : '';
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: defaultName,
    linkType: href.startsWith('http') ? 'external' : 'internal',
    href,
  };
}

function isPartialNavLink(value: unknown): value is Partial<NavLink> & { href: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'href' in value &&
    typeof value.href === 'string'
  );
}
