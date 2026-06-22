import { describe, expectTypeOf, it } from 'vitest';
import type { Category, CategoryInput } from './category';

describe('package/types/category', () => {
  it('保留双语分类模型', () => {
    expectTypeOf<Category>().toHaveProperty('id').toEqualTypeOf<string>();
    expectTypeOf<Category>()
      .toHaveProperty('name')
      .toEqualTypeOf<{ zh: string; en: string }>();
  });

  it('声明 API 输入字段', () => {
    expectTypeOf<CategoryInput>()
      .toHaveProperty('name_zh')
      .toEqualTypeOf<string>();
    expectTypeOf<CategoryInput>()
      .toHaveProperty('sort_order')
      .toEqualTypeOf<number | undefined>();
  });
});
