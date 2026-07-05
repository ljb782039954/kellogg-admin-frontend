import type { NavLink, Translation, CmsCustomPage } from '@/cms/types';
/**
 * 校验链接指向的页面是否存在
 */
export function checkPageExists(
  href: string | undefined,
  linkType: 'internal' | 'external',
  pages: CmsCustomPage[] = []
): boolean {
  if (linkType === 'external' || !href) return true;
  // 检查 href 是否匹配任何页面的 ID 或 Path
  return pages.some(p => p.id === href || p.path === href || (p as any).slug === href);
}

/**
 * 将旧版字符串链接转换为 NavLink 对象，用于向下兼容和初期迁移
 */
export function ensureNavLink(
  val: any, 
  defaultName: Translation = { zh: '立即行动', en: 'Take Action' }
): NavLink {
  if (typeof val === 'object' && val !== null && 'href' in val) {
    return {
      ...val,
      name: val.name || defaultName,
      linkType: val.linkType || (val.href?.startsWith('http') ? 'external' : 'internal')
    } as NavLink;
  }
  
  const href = typeof val === 'string' ? val : '';
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: defaultName,
    linkType: href.startsWith('http') ? 'external' : 'internal',
    href: href,
  };
}
