import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Category, CategoryInput } from '@/types';
import { categoryKeys } from '../api/categories.keys';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories.api';
import { createDefaultCategory } from './category.defaults';

export function useCategoriesEditor() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<Category[] | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
  });

  const localCategories = draft ?? categories;

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.list() }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryInput> }) =>
      updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.list() }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.list() }),
  });

  const isSaving =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const error =
    (createMutation.error || updateMutation.error || deleteMutation.error)?.message ?? null;

  const addCategory = useCallback(() => {
    setDraft((prev) => [...(prev ?? categories), createDefaultCategory()]);
  }, [categories]);

  const updateCategoryByIndex = useCallback(
    (index: number, patch: Partial<Category>) => {
      setDraft((prev) => {
        const list = [...(prev ?? categories)];
        list[index] = { ...list[index], ...patch };
        return list;
      });
    },
    [categories],
  );

  const removeCategory = useCallback(
    (index: number) => {
      setDraft((prev) => {
        const list = [...(prev ?? categories)];
        list.splice(index, 1);
        return list;
      });
    },
    [categories],
  );

  const save = useCallback(async () => {
    const original = categories;
    const current = localCategories;

    for (const localCat of current) {
      const exists = original.find((c) => c.id === localCat.id);
      if (!exists) {
        await createMutation.mutateAsync({
          id: localCat.id,
          name_zh: localCat.name.zh,
          name_en: localCat.name.en,
          image: localCat.image,
        });
      } else {
        const hasChanges =
          localCat.name.zh !== exists.name.zh ||
          localCat.name.en !== exists.name.en ||
          localCat.image !== exists.image;

        if (hasChanges) {
          await updateMutation.mutateAsync({
            id: localCat.id,
            data: {
              name_zh: localCat.name.zh,
              name_en: localCat.name.en,
              image: localCat.image,
            },
          });
        }
      }
    }

    for (const originalCat of original) {
      const stillExists = current.find((c) => c.id === originalCat.id);
      if (!stillExists) {
        await deleteMutation.mutateAsync(originalCat.id);
      }
    }

    setSaved(true);
    setDraft(null);
    setTimeout(() => setSaved(false), 2000);
  }, [categories, localCategories, createMutation, updateMutation, deleteMutation]);

  return useMemo(
    () => ({
      categories: localCategories,
      isLoading,
      isSaving,
      saved,
      error,
      addCategory,
      updateCategory: updateCategoryByIndex,
      removeCategory,
      save,
    }),
    [
      localCategories,
      isLoading,
      isSaving,
      saved,
      error,
      addCategory,
      updateCategoryByIndex,
      removeCategory,
      save,
    ],
  );
}
