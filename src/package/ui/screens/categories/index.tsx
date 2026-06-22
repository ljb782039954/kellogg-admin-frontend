import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
import { CategoriesEditor } from './CategoriesEditor';

export { CategoriesEditor } from './CategoriesEditor';

export const CategoriesScreen: ComponentType<AdminScreenProps> =
  function CategoriesScreen() {
    return <CategoriesEditor />;
  };
