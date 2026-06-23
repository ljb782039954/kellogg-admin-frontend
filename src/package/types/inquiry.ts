import type { Translation } from '@/shared/i18n/translation';

export type InquiryStatus = 'pending' | 'processed';

export interface InquiryListFilters {
  page: number;
  pageSize: number;
  search?: string;
  status?: InquiryStatus;
}

export interface InquiryDto {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  company: string | null;
  product_type: string | null;
  quantity: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface InquiryPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedInquiriesDto {
  data: InquiryDto[];
  pagination: InquiryPagination;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  company: string | null;
  productType: string | null;
  quantity: string | null;
  message: string | null;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface InquiryStatusInput {
  status: InquiryStatus;
}

export interface InquirySettings {
  title: Translation;
  description: Translation;
}

export interface InquiriesViewModel {
  inquiries: Inquiry[];
  selectedInquiry: Inquiry | null;
  pendingCount: number;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  search: string;
  status: 'all' | InquiryStatus;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
}

export interface InquiriesActions {
  changeSearch(value: string): void;
  changeStatus(value: 'all' | InquiryStatus): void;
  changePage(page: number): void;
  selectInquiry(id: number | null): void;
  updateStatus(id: number, status: InquiryStatus): Promise<void>;
  removeInquiry(id: number): Promise<void>;
  exportInquiry(inquiry: Inquiry): void;
  exportCurrentPage(): void;
  retry(): void;
}
