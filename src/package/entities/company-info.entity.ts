import type { EntityDefinition } from '@/core/contracts';
import { companyInfoAdapter } from '@/package/adapters/company-info.adapter';
import type { CompanyInfo } from '@/package/types';

export const companyInfoEntity: EntityDefinition<
  CompanyInfo,
  CompanyInfo,
  CompanyInfo
> = {
  key: 'company-info',
  endpoint: '/api/config',
  adapter: companyInfoAdapter,
  capabilities: { update: true },
  screens: { editor: 'company' },
};
