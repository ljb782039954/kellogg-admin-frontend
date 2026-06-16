import type { CompanyInfo } from '@/types';

export const blankCompanyInfo: CompanyInfo = {
  name: { zh: '', en: '' },
  logo: '',
  description: { zh: '', en: '' },
  contact: {
    phone: '',
    email: '',
    address: { zh: '', en: '' },
  },
  socialMedia: {},
};
