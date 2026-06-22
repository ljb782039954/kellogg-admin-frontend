import { describe, expect, it } from 'vitest';
import { companyInfoAdapter } from './company-info.adapter';
import type { CompanyInfo } from '@/package/types';

const companyInfo: CompanyInfo = {
  name: { zh: '公司', en: 'Company' },
  logo: '/logo.png',
  description: { zh: '简介', en: 'Description' },
  contact: {
    phone: '123',
    email: 'hello@example.com',
    address: { zh: '杭州', en: 'Hangzhou' },
  },
  socialMedia: { instagram: 'https://instagram.example' },
};

describe('companyInfoAdapter', () => {
  it('配置 DTO 与领域模型结构一致', () => {
    expect(companyInfoAdapter.fromDto(companyInfo)).toBe(companyInfo);
    expect(companyInfoAdapter.toInput(companyInfo)).toBe(companyInfo);
  });

  it('将公司信息包装为 site_settings 配置请求', () => {
    expect(companyInfoAdapter.toRequest(companyInfo)).toEqual({
      key: 'site_settings',
      value: companyInfo,
    });
  });
});
