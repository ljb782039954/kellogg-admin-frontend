import type { CompanyInfo } from '@/package/types';

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
