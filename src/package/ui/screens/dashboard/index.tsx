import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
import Overview from './Overview';

export { default as Overview } from './Overview';

export const DashboardScreen: ComponentType<AdminScreenProps> =
  function DashboardScreen() {
    return <Overview />;
  };
