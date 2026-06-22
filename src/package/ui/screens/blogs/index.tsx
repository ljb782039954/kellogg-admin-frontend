import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
import { BlogEditor } from './BlogEditor';
import { BlogsManager } from './BlogsManager';

export { BlogEditor } from './BlogEditor';
export { BlogsManager } from './BlogsManager';

export const BlogsScreen: ComponentType<AdminScreenProps> = function BlogsScreen() {
  return <BlogsManager />;
};

/** `blog-new` 与 `blog-edit` 共用此 screen，由组件读取路由中的可选 id。 */
export const BlogEditorScreen: ComponentType<AdminScreenProps> =
  function BlogEditorScreen() {
    return <BlogEditor />;
  };
