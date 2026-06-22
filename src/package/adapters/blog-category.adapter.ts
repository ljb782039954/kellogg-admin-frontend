import type { EntityAdapter } from '@/core/contracts';
import type { BlogCategory, BlogCategoryInput } from '@/package/types';

export const blogCategoryAdapter: EntityAdapter<
  BlogCategory,
  BlogCategory,
  BlogCategoryInput
> = {
  fromDto(dto) {
    return dto;
  },
  toInput(model) {
    return {
      name_zh: model.name_zh,
      name_en: model.name_en,
      slug: model.slug || undefined,
      sort_order: model.sort_order,
    };
  },
  toRequest(input) {
    return input;
  },
};
