import { describe, expect, it } from 'vitest';
import { footerAdapter } from './footer.adapter';
import type { FooterContent } from '@/package/types';

const footer: FooterContent = {
  linkGroups: [],
  newsletterPlaceholder: { zh: '邮箱', en: 'Email' },
  newsletterButton: { zh: '订阅', en: 'Subscribe' },
};

describe('footerAdapter', () => {
  it('配置 DTO 与领域模型结构一致', () => {
    expect(footerAdapter.fromDto(footer)).toBe(footer);
    expect(footerAdapter.toInput(footer)).toBe(footer);
  });

  it('将 Footer 包装为 footer_config 配置请求', () => {
    expect(footerAdapter.toRequest(footer)).toEqual({
      key: 'footer_config',
      value: footer,
    });
  });
});
