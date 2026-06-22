import { describe, expectTypeOf, it } from 'vitest';
import type { Blog, BlogInput, BlogsQuery, PaginatedBlogs } from './blog';

describe('package/types/blog', () => {
  it('保留文章领域与服务端字段', () => {
    expectTypeOf<Blog>().toHaveProperty('id').toEqualTypeOf<number>();
    expectTypeOf<Blog>().toHaveProperty('status').toEqualTypeOf<
      'draft' | 'published' | 'archived'
    >();
  });

  it('输入、查询与分页类型可供 entity 使用', () => {
    expectTypeOf<BlogInput>().toHaveProperty('slug').toEqualTypeOf<string>();
    expectTypeOf<BlogsQuery>().toHaveProperty('page').toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf<PaginatedBlogs>()
      .toHaveProperty('data')
      .toEqualTypeOf<Blog[]>();
  });
});
