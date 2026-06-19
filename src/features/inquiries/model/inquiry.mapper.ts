import type {
  Inquiry,
  InquiryDto,
  InquirySettings,
  PaginatedInquiriesDto,
} from './inquiry.types';

export function toInquiry(dto: InquiryDto): Inquiry {
  if (dto.status !== 'pending' && dto.status !== 'processed') {
    throw new Error(`Unknown inquiry status: ${dto.status}`);
  }
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    country: dto.country,
    company: dto.company,
    productType: dto.product_type,
    quantity: dto.quantity,
    message: dto.message,
    status: dto.status as Inquiry['status'],
    createdAt: dto.created_at,
    updatedAt: dto.updated_at ?? null,
  };
}

export function toPaginatedInquiries(
  dto: PaginatedInquiriesDto,
) {
  return {
    data: dto.data.map(toInquiry),
    pagination: dto.pagination,
  };
}

const defaultSettings: InquirySettings = {
  title: { zh: '联系我们要样品', en: 'Contact Us For Samples' },
  description: {
    zh: '如果您有任何关于产品的咨询，请填写下方表格，我们的团队会尽快与您联系。',
    en: 'If you have any inquiries about our products, please fill out the form below and our team will get back to you as soon as possible.',
  },
};

export function toInquirySettings(content: unknown): InquirySettings {
  if (!content || typeof content !== 'object') {
    return { ...defaultSettings };
  }
  const c = content as Record<string, unknown>;
  return {
    title: {
      zh: typeof c.title === 'object' && c.title ? (c.title as Record<string, unknown>).zh as string ?? defaultSettings.title.zh : defaultSettings.title.zh,
      en: typeof c.title === 'object' && c.title ? (c.title as Record<string, unknown>).en as string ?? defaultSettings.title.en : defaultSettings.title.en,
    },
    description: {
      zh: typeof c.description === 'object' && c.description ? (c.description as Record<string, unknown>).zh as string ?? defaultSettings.description.zh : defaultSettings.description.zh,
      en: typeof c.description === 'object' && c.description ? (c.description as Record<string, unknown>).en as string ?? defaultSettings.description.en : defaultSettings.description.en,
    },
  };
}
