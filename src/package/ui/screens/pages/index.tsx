import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
import { PagesManager } from './PagesManager';

export { PagesManager } from './PagesManager';

export const PagesScreen: ComponentType<AdminScreenProps> = function PagesScreen() {
  return <PagesManager />;
};
