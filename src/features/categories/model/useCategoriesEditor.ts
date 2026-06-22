import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CategoryInput } from '@/package/types';
import { categoryKeys } from '../api/categories.keys';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories.api';
import { createDefaultCategory } from './category.defaults';
import { toCategoryInput } from './category.mapper';
import type { CategoryFormValues } from './category.schema';

export function useCategoriesEditor() {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
  });

  const invalidateList = useCallback(
    () => queryClient.invalidateQueries({ queryKey: categoryKeys.list() }),
    [queryClient],
  );

  const createMutation = useMutation({
    mutationFn: (form: CategoryFormValues) => createCategory(toCategoryInput(form)),
    onSuccess: () => invalidateList(),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      name,
      image,
    }: {
      id: string;
      name?: { zh: string; en: string };
      image?: string;
    }) => {
      const data: Partial<CategoryInput> = {};
      if (name) {
        data.name_zh = name.zh;
        data.name_en = name.en;
      }
      if (image !== undefined) data.image = image;
      return updateCategory(id, data);
    },
    onSuccess: () => invalidateList(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => invalidateList(),
  });

  const addCategory = useCallback(async () => {
    const form = createDefaultCategory();
    await createMutation.mutateAsync(form);
  }, [createMutation]);

  const updateCategoryName = useCallback(
    async (id: string, name: { zh: string; en: string }) => {
      await updateMutation.mutateAsync({ id, name });
    },
    [updateMutation],
  );

  const updateCategoryImage = useCallback(
    async (id: string, image: string) => {
      await updateMutation.mutateAsync({ id, image });
    },
    [updateMutation],
  );

  const removeCategory = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation],
  );

  const error =
    (createMutation.error || updateMutation.error || deleteMutation.error)?.message ?? null;

  return {
    categories,
    isLoading,
    isSaving: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error,
    addCategory,
    updateCategoryName,
    updateCategoryImage,
    removeCategory,
  };
}
