import { describe, it, expectTypeOf } from 'vitest';
import type { CustomerReview, ReviewInput, ReviewListFilters } from '@/package/types';

describe('package/types/review', () => {
  it('CustomerReview 含服务端字段', () => {
    expectTypeOf<CustomerReview>().toHaveProperty('id').toEqualTypeOf<number>();
    expectTypeOf<CustomerReview>().toHaveProperty('created_at').toEqualTypeOf<string>();
  });
  it('ReviewInput 为可创建子集', () => {
    expectTypeOf<ReviewInput>().toHaveProperty('client_name').toEqualTypeOf<string>();
  });
  it('ReviewListFilters 含分页', () => {
    expectTypeOf<ReviewListFilters>().toHaveProperty('page').toEqualTypeOf<number>();
  });
});
