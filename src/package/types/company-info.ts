import type { Translation } from '@/shared/i18n/translation';

export interface SocialMediaType {
  wechat?: string;
  weibo?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface CompanyInfo {
  name: Translation;
  logo: string;
  description: Translation;
  contact: {
    phone: string;
    email: string;
    address: Translation;
  };
  socialMedia: SocialMediaType;
}
