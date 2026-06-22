import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
import { NavigationEditor } from './NavigationEditor';

export { NavigationEditor } from './NavigationEditor';

export const NavigationScreen: ComponentType<AdminScreenProps> =
  function NavigationScreen() {
    return <NavigationEditor />;
  };
