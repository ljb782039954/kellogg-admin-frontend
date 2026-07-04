import type { BlogInput } from '@/cms/types';

export function validateBlogBeforeSave(form: BlogInput): string | null {
  if (!form.slug || !form.title_zh || !form.title_en) {
    return '请填写必要字段：Slug、中文标题、英文标题';
  }

  return null;
}
