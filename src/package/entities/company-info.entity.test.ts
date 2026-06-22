import { describe, expect, it } from 'vitest';
import { companyInfoAdapter } from '@/package/adapters/company-info.adapter';
import { companyInfoEntity } from './company-info.entity';

describe('companyInfoEntity', () => {
  it('以仅更新的配置单例接入 company screen', () => {
    expect(companyInfoEntity.key).toBe('company-info');
    expect(companyInfoEntity.endpoint).toBe('/api/config');
    expect(companyInfoEntity.capabilities).toEqual({ update: true });
    expect(companyInfoEntity.screens).toEqual({ editor: 'company' });
    expect(companyInfoEntity.adapter).toBe(companyInfoAdapter);
  });
});
