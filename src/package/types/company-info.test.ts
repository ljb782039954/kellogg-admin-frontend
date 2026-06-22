import { describe, expectTypeOf, it } from 'vitest';
import type { CompanyInfo, SocialMediaType } from './company-info';

describe('package/types/company-info', () => {
  it('声明公司信息单例的完整结构', () => {
    expectTypeOf<CompanyInfo>().toHaveProperty('name');
    expectTypeOf<CompanyInfo>().toHaveProperty('contact');
    expectTypeOf<CompanyInfo>().toHaveProperty('socialMedia');
  });

  it('声明支持的社交媒体字段', () => {
    expectTypeOf<SocialMediaType>()
      .toHaveProperty('instagram')
      .toEqualTypeOf<string | undefined>();
  });
});
