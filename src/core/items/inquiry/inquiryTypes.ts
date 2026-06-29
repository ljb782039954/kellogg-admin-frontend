export type InquiryStatus = 'pending' | 'processed';
export type InquiryStatusFilter = 'all' | InquiryStatus;

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  company: string | null;
  product_type: string | null;
  quantity: string | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
}
