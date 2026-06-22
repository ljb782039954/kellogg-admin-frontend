import { describe, expectTypeOf, it } from 'vitest';
import type { HeaderContent, LinkType, NavLink, PageOption } from './navigation';

describe('package/types/navigation', () => {
  it('声明递归导航链接结构', () => {
    expectTypeOf<NavLink>().toHaveProperty('href').toEqualTypeOf<string>();
    expectTypeOf<NavLink>()
      .toHaveProperty('children')
      .toEqualTypeOf<NavLink[] | undefined>();
  });

  it('声明 Header 配置与链接类型', () => {
    expectTypeOf<HeaderContent>().toHaveProperty('navItems').toEqualTypeOf<NavLink[]>();
    expectTypeOf<LinkType>().toEqualTypeOf<'internal' | 'external'>();
    expectTypeOf<PageOption>().toHaveProperty('path').toEqualTypeOf<string>();
  });
});
