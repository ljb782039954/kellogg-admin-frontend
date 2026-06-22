import { describe, expect, it } from 'vitest';
import { navigationAdapter } from './navigation.adapter';
import type { HeaderContent } from '@/package/types';

const header: HeaderContent = {
  logoText: { zh: '品牌', en: 'Brand' },
  navItems: [],
};

describe('navigationAdapter', () => {
  it('配置 DTO 与领域模型结构一致', () => {
    expect(navigationAdapter.fromDto(header)).toBe(header);
    expect(navigationAdapter.toInput(header)).toBe(header);
  });

  it('将 Header 包装为 header_config 配置请求', () => {
    expect(navigationAdapter.toRequest(header)).toEqual({
      key: 'header_config',
      value: header,
    });
  });
});
