import type { EntityDefinition } from '@/core/contracts';
import { inquiryAdapter } from '@/package/adapters/inquiry.adapter';
import type {
  Inquiry,
  InquiryDto,
  InquiryListFilters,
  InquiryStatusInput,
} from '@/package/types';

export const inquiryEntity: EntityDefinition<
  Inquiry,
  InquiryDto,
  InquiryStatusInput,
  InquiryListFilters
> = {
  key: 'inquiries',
  endpoint: '/api/inquiries',
  adapter: inquiryAdapter,
  capabilities: { list: true, update: true, delete: true },
  defaultFilters: { page: 1, pageSize: 20 },
  screens: { list: 'inquiries' },
};
