import { useCallback } from 'react';
import type { Category, CategoryInput } from '@/package/types';
import { categoryKeys } from '../api/categories.keys';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories.api';
import { createDefaultCategory } from './category.defaults';
import { toCategoryInput } from './category.mapper';
import type { CategoryFormValues } from './category.schema';
import { useEntityCollectionController } from '@/core/entities';

interface CategoryUpdateCommand {
  id: string;
  name?: { zh: string; en: string };
  image?: string;
}

export function useCategoriesEditor() {
  const controller = useEntityCollectionController<
    Category,
    string,
    CategoryFormValues,
    CategoryUpdateCommand,
    string
  >({
    keys: categoryKeys,
    operations: {
      load: getCategories,
      create: (form) => createCategory(toCategoryInput(form)),
      update: ({ id, name, image }) => {
      const data: Partial<CategoryInput> = {};
      if (name) {
        data.name_zh = name.zh;
        data.name_en = name.en;
      }
      if (image !== undefined) data.image = image;
      return updateCategory(id, data);
      },
      remove: deleteCategory,
    },
  });

  const addCategory = useCallback(async () => {
    const form = createDefaultCategory();
    await controller.create(form);
  }, [controller]);

  const updateCategoryName = useCallback(
    async (id: string, name: { zh: string; en: string }) => {
      await controller.update({ id, name });
    },
    [controller],
  );

  const updateCategoryImage = useCallback(
    async (id: string, image: string) => {
      await controller.update({ id, image });
    },
    [controller],
  );

  const removeCategory = useCallback(
    async (id: string) => {
      await controller.remove(id);
    },
    [controller],
  );

  return {
    categories: controller.items,
    isLoading: controller.isLoading,
    isSaving: controller.isSaving,
    error: controller.error,
    addCategory,
    updateCategoryName,
    updateCategoryImage,
    removeCategory,
  };
}
