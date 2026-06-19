import { describe, expect, it } from 'vitest';
import { toInquiry, toPaginatedInquiries, toInquirySettings } from './inquiry.mapper';
import type { InquiryDto } from './inquiry.types';

function dto(overrides: Partial<InquiryDto> = {}): InquiryDto {
  return {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    phone: '+123456789',
    country: 'USA',
    company: 'Acme Inc',
    product_type: 'Hoodie',
    quantity: '500 pcs',
    message: 'Please send quote',
    status: 'pending',
    created_at: '2026-06-01T10:00:00Z',
    ...overrides,
  };
}

describe('toInquiry', () => {
  it('converts snake_case to camelCase', () => {
    const result = toInquiry(dto());
    expect(result.productType).toBe('Hoodie');
    expect(result.createdAt).toBe('2026-06-01T10:00:00Z');
  });

  it('keeps null fields as null', () => {
    const result = toInquiry(dto({ phone: null, company: null }));
    expect(result.phone).toBeNull();
    expect(result.company).toBeNull();
  });

  it('sets updatedAt to null when missing', () => {
    const result = toInquiry(dto({ updated_at: undefined }));
    expect(result.updatedAt).toBeNull();
  });

  it('converts pending and processed statuses', () => {
    expect(toInquiry(dto({ status: 'pending' })).status).toBe('pending');
    expect(toInquiry(dto({ status: 'processed' })).status).toBe('processed');
  });

  it('throws on unknown status', () => {
    expect(() => toInquiry(dto({ status: 'archived' }))).toThrow('Unknown inquiry status: archived');
  });
});

describe('toPaginatedInquiries', () => {
  it('preserves pagination metadata', () => {
    const result = toPaginatedInquiries({
      data: [dto()],
      pagination: { page: 2, pageSize: 20, total: 45, totalPages: 3 },
    });
    expect(result.data).toHaveLength(1);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.total).toBe(45);
  });
});

describe('toInquirySettings', () => {
  it('uses defaults when content is null', () => {
    const settings = toInquirySettings(null);
    expect(settings.title.zh).toBe('联系我们要样品');
    expect(settings.title.en).toBe('Contact Us For Samples');
  });

  it('falls back to defaults for missing fields', () => {
    const settings = toInquirySettings({ title: { zh: '仅中文' } });
    expect(settings.title.zh).toBe('仅中文');
    expect(settings.title.en).toBe('Contact Us For Samples');
  });
});
