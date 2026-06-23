import { describe, expect, it } from 'vitest';
import { inquiryAdapter } from './inquiry.adapter';
import type { InquiryDto } from '@/package/types';

const dto: InquiryDto = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  phone: null,
  country: 'US',
  company: 'Acme',
  product_type: 'Hoodie',
  quantity: '100',
  message: 'Quote please',
  status: 'pending',
  created_at: '2026-06-01T00:00:00Z',
};

describe('inquiryAdapter', () => {
  it('将 snake_case DTO 转为领域模型', () => {
    expect(inquiryAdapter.fromDto(dto)).toMatchObject({
      productType: 'Hoodie',
      status: 'pending',
      createdAt: '2026-06-01T00:00:00Z',
      updatedAt: null,
    });
  });

  it('生成状态更新输入与请求体', () => {
    const input = inquiryAdapter.toInput(inquiryAdapter.fromDto(dto));
    expect(input).toEqual({ status: 'pending' });
    expect(inquiryAdapter.toRequest(input)).toBe(input);
  });

  it('拒绝未知状态', () => {
    expect(() => inquiryAdapter.fromDto({ ...dto, status: 'archived' })).toThrow(
      'Unknown inquiry status: archived',
    );
  });
});
