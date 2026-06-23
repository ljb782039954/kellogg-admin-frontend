import { describe, expect, it } from 'vitest';
import { inquiryAdapter } from '@/package/adapters/inquiry.adapter';
import { inquiryEntity } from './inquiry.entity';

describe('inquiryEntity', () => {
  it('接入询盘列表、状态更新与删除能力', () => {
    expect(inquiryEntity.key).toBe('inquiries');
    expect(inquiryEntity.endpoint).toBe('/api/inquiries');
    expect(inquiryEntity.capabilities).toEqual({
      list: true,
      update: true,
      delete: true,
    });
    expect(inquiryEntity.defaultFilters).toEqual({ page: 1, pageSize: 20 });
    expect(inquiryEntity.screens).toEqual({ list: 'inquiries' });
    expect(inquiryEntity.adapter).toBe(inquiryAdapter);
  });
});
