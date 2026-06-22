import { describe, expectTypeOf, it } from 'vitest';
import type {
  BulkPrice,
  PaginatedProducts,
  Product,
  ProductInput,
  ProductsQuery,
} from './product';

describe('package/types/product', () => {
  it('保留产品领域结构', () => {
    expectTypeOf<Product>().toHaveProperty('id').toEqualTypeOf<number>();
    expectTypeOf<Product>()
      .toHaveProperty('bulkPrices')
      .toEqualTypeOf<BulkPrice[] | undefined>();
  });

  it('声明 API 输入与分页查询类型', () => {
    expectTypeOf<ProductInput>()
      .toHaveProperty('name_zh')
      .toEqualTypeOf<string>();
    expectTypeOf<ProductsQuery>()
      .toHaveProperty('featured')
      .toEqualTypeOf<boolean | undefined>();
    expectTypeOf<PaginatedProducts>()
      .toHaveProperty('data')
      .toEqualTypeOf<Product[]>();
  });
});
