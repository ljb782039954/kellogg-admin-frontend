import { describe, expectTypeOf, it } from 'vitest';
import type { PageIndexEntry, PageKind } from './page';

describe('package/types/page', () => {
  it('声明轻量页面索引结构', () => {
    expectTypeOf<PageIndexEntry>().toHaveProperty('id').toEqualTypeOf<string>();
    expectTypeOf<PageIndexEntry>().toHaveProperty('blockCount').toEqualTypeOf<number>();
  });

  it('声明页面布局类型', () => {
    expectTypeOf<PageKind>().toEqualTypeOf<
      'fixed-block' | 'dynamic-block' | 'fixed-layout'
    >();
  });
});
