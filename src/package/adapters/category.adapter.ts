import type { EntityAdapter } from '@/core/contracts';
import type { Category, CategoryInput } from '@/package/types';

export const categoryAdapter: EntityAdapter<Category, Category, CategoryInput> = {
  fromDto(dto) {
    return dto;
  },
  toInput(model) {
    return {
      id: model.id,
      name_zh: model.name.zh,
      name_en: model.name.en,
      image: model.image || undefined,
    };
  },
  toRequest(input) {
    return input;
  },
};
