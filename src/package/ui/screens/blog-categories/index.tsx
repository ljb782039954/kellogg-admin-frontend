import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
import { BlogCategoriesManager } from './BlogCategoriesManager';

export { BlogCategoriesManager } from './BlogCategoriesManager';

/** core 注入 AdminScreenProps；博客分类是无参单页。 */
export const BlogCategoriesScreen: ComponentType<AdminScreenProps> =
  function BlogCategoriesScreen() {
    return <BlogCategoriesManager />;
  };
