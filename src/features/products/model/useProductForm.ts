import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { ProductInput } from '@/types';
import { getCategories } from '@/features/categories/api/categories.api';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/products.api';
import { productKeys } from '../api/products.keys';
import type { ProductFormValues } from './product.schema';
import { createDefaultProduct } from './product.defaults';
import {
  fromProductResponse,
  toCreateProductInput,
  toUpdateProductInput,
} from './product.mapper';

export function useProductsManager() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Product list query
  const {
    data: listData,
    isLoading: isListLoading,
    error: listError,
  } = useQuery({
    queryKey: productKeys.lists(),
    queryFn: () => getProducts({ pageSize: 1000 }),
  });

  const products = listData?.data ?? [];

  // Categories query (needed by product editor UI)
  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'list'],
    queryFn: getCategories,
    staleTime: 60_000,
  });

  // Single product detail query (only when editing an existing product)
  const {
    data: productDetail,
    isLoading: isDetailLoading,
  } = useQuery({
    queryKey: productKeys.detail(editingId!),
    queryFn: () => getProduct(editingId!),
    enabled: editingId !== null && editingId > 0,
  });

  // Form
  const form = useForm<ProductFormValues>({
    defaultValues: createDefaultProduct(),
  });

  // Initialize form when product detail loads
  useEffect(() => {
    if (productDetail && editingId !== null && editingId > 0) {
      form.reset(fromProductResponse(productDetail));
    }
  }, [form, productDetail, editingId]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (values.id > 0) {
        return updateProduct(values.id, toUpdateProductInput(values));
      }
      const created = await createProduct(toCreateProductInput(values));
      return created;
    },
    onSuccess: (result, variables) => {
      // Update detail cache
      queryClient.setQueryData(productKeys.detail(variables.id || result.id), result);
      // Invalidate list cache
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Reset form with server response
      form.reset(fromProductResponse(result));
      setEditingId(result.id);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : '保存失败');
    },
  });

  // Toggle mutations (instant save from list view)
  const updateSingleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductInput> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : '更新失败');
    },
  });

  const toggleFeatured = useCallback((id: number, isFeatured: boolean) => {
    updateSingleMutation.mutate({ id, data: { is_featured: isFeatured } });
  }, [updateSingleMutation]);

  const toggleActive = useCallback((id: number, isActive: boolean) => {
    updateSingleMutation.mutate({ id, data: { is_active: isActive } });
  }, [updateSingleMutation]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      if (editingId !== null) {
        setEditingId(null);
        form.reset(createDefaultProduct());
      }
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : '删除失败');
    },
  });

  const openEditor = useCallback((id: number) => {
    setEditingId(id);
    setError(null);
    if (id === 0) {
      form.reset(createDefaultProduct());
    }
  }, [form]);

  const closeEditor = useCallback(() => {
    setEditingId(null);
    form.reset(createDefaultProduct());
  }, [form]);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === products.length) return new Set();
      return new Set(products.map((p) => p.id));
    });
  }, [products]);

  const addProduct = useCallback(() => {
    openEditor(0);
  }, [openEditor]);

  const saveProduct = useCallback(async () => {
    const values = form.getValues();
    setError(null);
    await saveMutation.mutateAsync(values);
  }, [form, saveMutation]);

  const deleteSelected = useCallback(async () => {
    if (selectedIds.size === 0) return;
    setError(null);
    try {
      for (const id of selectedIds) {
        await deleteMutation.mutateAsync(id);
      }
      setSelectedIds(new Set());
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '批量删除失败');
    }
  }, [selectedIds, deleteMutation]);

  const removeProduct = useCallback(async (id: number) => {
    setError(null);
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  return {
    // List
    products,
    categories,
    isLoading: isListLoading || isDetailLoading,
    listError,

    // Selection
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    hasSelection: selectedIds.size > 0,
    selectionCount: selectedIds.size,

    // Editing
    editingId,
    openEditor,
    closeEditor,
    isEditing: editingId !== null,

    // Form
    form,
    isSaving: saveMutation.isPending,
    saved,
    error,
    setError,

    // Actions
    addProduct,
    saveProduct,
    deleteSelected,
    removeProduct,
    toggleFeatured,
    toggleActive,
  };
}
