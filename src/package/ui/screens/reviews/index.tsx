import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
import { ReviewsManager } from './ReviewsManager';

export { ReviewsManager } from './ReviewsManager';

/** core 注入 AdminScreenProps；reviews 为无参单页，忽略 routeId。 */
export const ReviewsScreen: ComponentType<AdminScreenProps> = function ReviewsScreen() {
  return <ReviewsManager />;
};
