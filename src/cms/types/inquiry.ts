import type { Language } from './common';

export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  company?: string;
  product_type: string;
  quantity: string;
  message: string;
}

export interface InquiryPageContent {
  title: Record<Language, string>;
  description: Record<Language, string>;
}

export interface InquiryTranslations {
  form: {
    name: string;
    email: string;
    phone?: string;
    country: string;
    company?: string;
    productType: string;
    quantity: string;
    message: string;
    submit: string;
    success: string;
    successMsg: string;
    back: string;
  };
  alerts: {
    turnstileRequired: string;
    submitFailed: string;
  };
}

export interface SubmitInquiryInput extends InquiryFormData {
  turnstileToken: string;
}
