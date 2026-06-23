import { describe, expectTypeOf, it } from 'vitest';
import type {
  Inquiry,
  InquiryDto,
  InquiryListFilters,
  InquirySettings,
} from './inquiry';

describe('package/types/inquiry', () => {
  it('区分 API DTO 与领域模型字段', () => {
    expectTypeOf<InquiryDto>().toHaveProperty('product_type').toEqualTypeOf<string | null>();
    expectTypeOf<Inquiry>().toHaveProperty('productType').toEqualTypeOf<string | null>();
  });

  it('声明列表筛选与询盘页面设置', () => {
    expectTypeOf<InquiryListFilters>().toHaveProperty('page').toEqualTypeOf<number>();
    expectTypeOf<InquirySettings>().toHaveProperty('title');
  });
});
