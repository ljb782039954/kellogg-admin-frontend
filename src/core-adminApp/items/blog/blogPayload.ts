import type { BlogInput } from '@/cms/types';

export function createBlogSavePayload(
  form: BlogInput,
  targetStatus: 'draft' | 'published'
): BlogInput {
  return {
    ...form,
    status: targetStatus,
    publish_date: form.publish_date || new Date().toISOString().split('T')[0],
  };
}
