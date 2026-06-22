import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
import { MediaManager } from './MediaManager';

export { MediaManager } from './MediaManager';

export const MediaScreen: ComponentType<AdminScreenProps> = function MediaScreen() {
  return <MediaManager />;
};
