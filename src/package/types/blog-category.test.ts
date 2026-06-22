import { describe, expectTypeOf, it } from 'vitest';
import type { BlogCategory, BlogCategoryInput } from './blog-category';

describe('package/types/blog-category', () => {
  it('保留服务端模型字段', () => {
    expectTypeOf<BlogCategory>().toHaveProperty('id').toEqualTypeOf<number>();
    expectTypeOf<BlogCategory>().toHaveProperty('article_count').toEqualTypeOf<
      number | undefined
    >();
  });

  it('输入类型不包含服务端生成字段', () => {
    expectTypeOf<BlogCategoryInput>()
      .toHaveProperty('name_zh')
      .toEqualTypeOf<string>();
    expectTypeOf<BlogCategoryInput>().not.toHaveProperty('created_at');
  });
});
