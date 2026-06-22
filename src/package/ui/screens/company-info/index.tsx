import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
import { CompanyInfoEditor } from './CompanyInfoEditor';

export { CompanyInfoEditor } from './CompanyInfoEditor';

export const CompanyInfoScreen: ComponentType<AdminScreenProps> =
  function CompanyInfoScreen() {
    return <CompanyInfoEditor />;
  };
