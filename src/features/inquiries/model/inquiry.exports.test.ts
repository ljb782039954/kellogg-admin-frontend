import { describe, expect, it } from 'vitest';
import {
  buildInquiryText,
  buildInquiriesCsv,
  buildInquiryTextFilename,
  buildInquiriesCsvFilename,
  escapeCsvCell,
} from './inquiry.exports';
import type { Inquiry } from './inquiry.types';

const sampleInquiry: Inquiry = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  phone: '+123456789',
  country: 'USA',
  company: 'Acme Inc',
  productType: 'Hoodie',
  quantity: '500 pcs',
  message: 'Please send quote with comma, "double quotes", and newline\nhere',
  status: 'pending',
  createdAt: '2026-06-01T10:00:00Z',
  updatedAt: null,
};

describe('buildInquiryText', () => {
  it('includes all fields', () => {
    const text = buildInquiryText(sampleInquiry);
    expect(text).toContain('ID: 1');
    expect(text).toContain('Name: Alice');
    expect(text).toContain('Product Type: Hoodie');
    expect(text).toContain('Please send quote');
  });

  it('outputs N/A for null fields', () => {
    const noData = { ...sampleInquiry, phone: null, company: null, productType: null, country: null, quantity: null, message: null };
    const text = buildInquiryText(noData);
    expect(text).toContain('Phone: N/A');
    expect(text).toContain('Company: N/A');
    expect(text).toContain('Product Type: N/A');
  });
});

describe('escapeCsvCell', () => {
  it('wraps cells containing commas in quotes', () => {
    expect(escapeCsvCell('Hello, world')).toBe('"Hello, world"');
  });

  it('escapes double quotes by doubling them', () => {
    expect(escapeCsvCell('Say "hello"')).toBe('"Say ""hello"""');
  });

  it('returns empty string for null', () => {
    expect(escapeCsvCell(null)).toBe('');
  });
});

describe('buildInquiriesCsv', () => {
  it('starts with UTF-8 BOM', () => {
    const csv = buildInquiriesCsv([sampleInquiry]);
    expect(csv.charCodeAt(0)).toBe(0xFEFF);
  });

  it('includes header row and data', () => {
    const csv = buildInquiriesCsv([sampleInquiry]);
    expect(csv).toContain('ID,Name,Email');
    expect(csv).toContain('Alice');
    expect(csv).toContain(',pending,');
  });

  it('escapes problematic cells in export', () => {
    const csv = buildInquiriesCsv([sampleInquiry]);
    expect(csv).toContain('"Please send quote with comma, ""double quotes"", and newline');
  });
});

describe('buildInquiryTextFilename', () => {
  it('removes Windows illegal characters', () => {
    const inquiry = { ...sampleInquiry, name: 'Alice:Bob/Test' };
    const name = buildInquiryTextFilename(inquiry);
    expect(name).not.toMatch(/[<>:"/\\|?*]/);
    expect(name).toContain('Alice_Bob_Test');
  });
});

describe('buildInquiriesCsvFilename', () => {
  it('uses YYYY-MM-DD format', () => {
    const date = new Date('2026-06-19');
    expect(buildInquiriesCsvFilename(date)).toBe('inquiries_export_2026-06-19.csv');
  });
});
