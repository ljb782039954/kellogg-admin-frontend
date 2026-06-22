import { describe, expectTypeOf, it } from 'vitest';
import type { FooterContent, FooterGroupInput, FooterLink } from './footer';

describe('package/types/footer', () => {
  it('声明 Footer 配置结构', () => {
    expectTypeOf<FooterContent>().toHaveProperty('linkGroups');
    expectTypeOf<FooterContent>().toHaveProperty('newsletterButton');
    expectTypeOf<FooterLink>().toHaveProperty('linkType');
  });

  it('保留 Footer 分组输入结构', () => {
    expectTypeOf<FooterGroupInput>().toHaveProperty('title_zh').toEqualTypeOf<string>();
  });
});
