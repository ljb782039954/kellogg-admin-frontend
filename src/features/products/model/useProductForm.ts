import { useCallback, useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { productSchema, type ProductFormValues } from './product.schema';
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
  const sessionIdRef = useRef(0);

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

  // Categories query
  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'list'],
    queryFn: getCategories,
    staleTime: 60_000,
  });

  // Single product detail query
  const {
    data: productDetail,
    isLoading: isDetailLoading,
  } = useQuery({
    queryKey: productKeys.detail(editingId!),
    queryFn: () => getProduct(editingId!),
    enabled: editingId !== null && editingId > 0,
  });

  // Form with Zod validation
  const form = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: createDefaultProduct(),
    mode: 'onChange',
  });

  // Initialize form when product detail loads — bound to session to prevent stale overwrites
  useEffect(() => {
    if (productDetail && editingId !== null && editingId > 0) {
      const currentSession = sessionIdRef.current;
      const sid = currentSession;
      // Only reset if this is still the active session
      requestAnimationFrame(() => {
        if (sessionIdRef.current === sid) {
          form.reset(fromProductResponse(productDetail));
        }
      });
    }
  }, [form, productDetail, editingId]);

  // Save mutation via validated submit
  const saveMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (values.id > 0) {
        return updateProduct(values.id, toUpdateProductInput(values));
      }
      const created = await createProduct(toCreateProductInput(values));
      return created;
    },
    onSuccess: (result) => {
      queryClient.setQueryData(productKeys.detail(result.id), result);
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      form.reset(fromProductResponse(result));
      setEditingId(result.id);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : '保存失败');
    },
  });

  // Validated submit — the only save entry point
  const validatedSubmit = form.handleSubmit(
    async (values) => {
      setError(null);
      await saveMutation.mutateAsync(values);
    },
  );

  // Toggle mutations
  const updateSingleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductInput> }) =>
      updateProduct(id, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      if (editingId === variables.id) {
        queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      }
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
    onSuccess: (_result, deletedId) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      if (editingId === deletedId) {
        setEditingId(null);
        form.reset(createDefaultProduct());
      }
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : '删除失败');
    },
  });

  // Open/close with dirty protection
  const requestOpenEditor = useCallback((id: number) => {
    if (form.formState.isDirty) {
      if (!window.confirm('当前有未保存的修改，确定要放弃吗？')) return;
    }
    sessionIdRef.current += 1;
    setEditingId(id);
    setError(null);
    if (id === 0) {
      form.reset(createDefaultProduct());
    }
  }, [form]);

  const requestCloseEditor = useCallback(() => {
    if (form.formState.isDirty) {
      if (!window.confirm('当前有未保存的修改，确定要关闭吗？')) return;
    }
    sessionIdRef.current += 1;
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
    requestOpenEditor(0);
  }, [requestOpenEditor]);

  const deleteSelected = useCallback(async () => {
    if (selectedIds.size === 0) return;
    setError(null);
    const succeeded: number[] = [];
    const failed: { id: number; error: string }[] = [];
    for (const id of selectedIds) {
      try {
        await deleteMutation.mutateAsync(id);
        succeeded.push(id);
      } catch (err) {
        failed.push({ id, error: err instanceof Error ? err.message : '删除失败' });
      }
    }
    setSelectedIds(new Set());
    if (failed.length === 0) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } else {
      setError(`已删除 ${succeeded.length} 项，${failed.length} 项失败`);
    }
  }, [selectedIds, deleteMutation]);

  const removeProduct = useCallback(async (id: number) => {
    setError(null);
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  return {
    products,
    categories,
    isLoading: isListLoading,
    isDetailLoading,
    listError,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    hasSelection: selectedIds.size > 0,
    selectionCount: selectedIds.size,
    editingId,
    requestOpenEditor,
    requestCloseEditor,
    isEditing: editingId !== null,
    form,
    validatedSubmit,
    isSaving: saveMutation.isPending,
    saved,
    error,
    setError,
    addProduct,
    deleteSelected,
    removeProduct,
    toggleFeatured,
    toggleActive,
  };
}
