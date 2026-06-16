export const companyInfoKeys = {
  all: ['company-info'] as const,
  detail: () => [...companyInfoKeys.all, 'detail'] as const,
};
