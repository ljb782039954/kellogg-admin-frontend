import type { EntityAdapter } from '@/core/contracts';
import type { Blog, BlogInput } from '@/package/types';

export const blogAdapter: EntityAdapter<Blog, Blog, BlogInput> = {
  fromDto(dto) {
    return dto;
  },
  toInput(model) {
    return {
      slug: model.slug,
      title_zh: model.title_zh,
      title_en: model.title_en,
      summary_zh: model.summary_zh ?? undefined,
      summary_en: model.summary_en ?? undefined,
      content_zh: model.content_zh || undefined,
      content_en: model.content_en || undefined,
      cover_image: model.cover_image ?? undefined,
      category: model.category ?? undefined,
      tags: model.tags,
      author: model.author,
      status: model.status,
      seo_title_zh: model.seo_title_zh ?? undefined,
      seo_title_en: model.seo_title_en ?? undefined,
      seo_desc_zh: model.seo_desc_zh ?? undefined,
      seo_desc_en: model.seo_desc_en ?? undefined,
      publish_date: model.publish_date ?? undefined,
    };
  },
  toRequest(input) {
    return input;
  },
};
