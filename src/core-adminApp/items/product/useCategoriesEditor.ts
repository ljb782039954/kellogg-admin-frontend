import { useEffect, useState } from 'react';
import { useContent } from '@/core-adminApp/context/ContentContext';
import type { Category, Translation } from '@/cms/types';
import {
  createDraftCategory,
  hasCategoryChanges,
  mapCategoryToInput,
} from './productMapper';

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useCategoriesEditor() {
  const {
    categories,
    createCategory,
    updateCategory: apiUpdateCategory,
    deleteCategory: apiDeleteCategory,
    isLoading: contextLoading,
  } = useContent();

  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const showSaved = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      for (const localCategory of localCategories) {
        const remoteCategory = categories.find(category => category.id === localCategory.id);

        if (!remoteCategory) {
          await createCategory(mapCategoryToInput(localCategory));
        } else if (hasCategoryChanges(localCategory, remoteCategory)) {
          await apiUpdateCategory(localCategory.id, mapCategoryToInput(localCategory));
        }
      }

      for (const originalCategory of categories) {
        const stillExists = localCategories.some(category => category.id === originalCategory.id);
        if (!stillExists) {
          await apiDeleteCategory(originalCategory.id);
        }
      }

      showSaved();
    } catch (err) {
      setError(getErrorMessage(err, '保存失败'));
    } finally {
      setIsSaving(false);
    }
  };

  const addCategory = () => {
    setLocalCategories(previous => [...previous, createDraftCategory()]);
  };

  const updateLocalCategory = (index: number, value: Translation) => {
    setLocalCategories(previous => previous.map((category, currentIndex) => (
      currentIndex === index ? { ...category, name: value } : category
    )));
  };

  const updateLocalCategoryImage = (index: number, value: string) => {
    setLocalCategories(previous => previous.map((category, currentIndex) => (
      currentIndex === index ? { ...category, image: value } : category
    )));
  };

  const removeCategory = (index: number) => {
    setLocalCategories(previous => previous.filter((_, currentIndex) => currentIndex !== index));
  };

  return {
    categories,
    contextLoading,
    error,
    isSaving,
    localCategories,
    saved,
    addCategory,
    handleSave,
    removeCategory,
    setError,
    updateLocalCategory,
    updateLocalCategoryImage,
  };
}
