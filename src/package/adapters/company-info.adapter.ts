import type { EntityAdapter } from '@/core/contracts';
import type { CompanyInfo } from '@/package/types';

export interface CompanyInfoRequest {
  key: 'site_settings';
  value: CompanyInfo;
}

export const companyInfoAdapter: EntityAdapter<
  CompanyInfo,
  CompanyInfo,
  CompanyInfo
> = {
  fromDto(dto) {
    return dto;
  },
  toInput(model) {
    return model;
  },
  toRequest(input): CompanyInfoRequest {
    return {
      key: 'site_settings',
      value: input,
    };
  },
};
