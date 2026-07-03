import type { Inquiry, InquiryStatusFilter } from './inquiryTypes';

export function filterInquiries(
  inquiries: Inquiry[],
  searchTerm: string,
  statusFilter: InquiryStatusFilter
): Inquiry[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return inquiries.filter(inquiry => {
    const matchesSearch = !normalizedSearch
      || inquiry.name.toLowerCase().includes(normalizedSearch)
      || inquiry.email.toLowerCase().includes(normalizedSearch)
      || (inquiry.company || '').toLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}

export function countPendingInquiries(inquiries: Inquiry[]): number {
  return inquiries.filter(inquiry => inquiry.status === 'pending').length;
}
