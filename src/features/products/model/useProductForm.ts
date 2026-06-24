import { useCallback, useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { Product, ProductInput } from '@/package/types';
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
import {
  invalidateEntityDetail,
  useEntityEditorController,
  usePaginatedEntityListController,
} from '@/core/entities';

interface ProductUpdateCommand {
  id: number;
  data: Partial<ProductInput>;
}

export function useProductsManager() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef(0);

  const listController = usePaginatedEntityListController<
    Product,
    { pageSize: number },
    Awaited<ReturnType<typeof getProducts>>,
    {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    },
    ProductUpdateCommand,
    number
  >({
    keys: {
      lists: productKeys.lists,
      list: () => productKeys.lists(),
    },
    filters: { pageSize: 1000 },
    load: getProducts,
    select: (response) => ({
      items: response.data,
      pagination: {
        page: response.page,
        pageSize: response.pageSize,
        total: response.total,
        totalPages: response.totalPages,
      },
    }),
    mutations: {
      update: {
        execute: ({ id, data }) => updateProduct(id, data),
        onSuccess: (_result, variables) => {
          if (editingId === variables.id) {
            return invalidateEntityDetail(
              queryClient,
              productKeys,
              variables.id,
            );
          }
        },
        onError: (mutationError) => {
          setError(mutationError.message || '更新失败');
        },
      },
      remove: {
        execute: deleteProduct,
        onSuccess: (_result, deletedId) => {
          if (editingId === deletedId) {
            setEditingId(null);
            form.reset(createDefaultProduct());
          }
        },
        onError: (mutationError) => {
          setError(mutationError.message || '删除失败');
        },
      },
    },
  });

  const products = listController.items;

  // Categories query
  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'list'],
    queryFn: getCategories,
    staleTime: 60_000,
  });

  // Form with Zod validation
  const form = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: createDefaultProduct(),
    mode: 'onChange',
  });

  const editorController = useEntityEditorController<
    Product,
    number,
    ProductFormValues,
    Product
  >({
    id: editingId !== null && editingId > 0 ? editingId : undefined,
    enabled: editingId !== null && editingId > 0,
    keys: productKeys,
    operations: {
      load: getProduct,
      create: (values) => createProduct(toCreateProductInput(values)),
      update: (id, values) => updateProduct(id, toUpdateProductInput(values)),
    },
    resolveSavedId: (product) => product.id,
    selectSavedModel: (product) => product,
    onSaved: (savedId, product) => {
      form.reset(fromProductResponse(product));
      setEditingId(savedId);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    },
    onError: (saveError) => {
      setError(saveError.message || '保存失败');
    },
  });

  // Initialize form when product detail loads — bound to session to prevent stale overwrites
  useEffect(() => {
    if (editorController.model && editingId !== null && editingId > 0) {
      const currentSession = sessionIdRef.current;
      const sid = currentSession;
      // Only reset if this is still the active session
      requestAnimationFrame(() => {
        if (sessionIdRef.current === sid) {
          form.reset(fromProductResponse(editorController.model!));
        }
      });
    }
  }, [form, editorController.model, editingId]);

  // Validated submit — the only save entry point
  const validatedSubmit = form.handleSubmit(
    async (values) => {
      setError(null);
      await editorController.save(values);
    },
  );

  const toggleFeatured = useCallback((id: number, isFeatured: boolean) => {
    void listController.update({ id, data: { is_featured: isFeatured } });
  }, [listController]);

  const toggleActive = useCallback((id: number, isActive: boolean) => {
    void listController.update({ id, data: { is_active: isActive } });
  }, [listController]);

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
        await listController.remove(id);
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
  }, [selectedIds, listController]);

  const removeProduct = useCallback(async (id: number) => {
    setError(null);
    await listController.remove(id);
  }, [listController]);

  return {
    products,
    categories,
    isLoading: listController.isLoading,
    isDetailLoading: editorController.isLoading,
    listError: listController.error,
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
    isSaving: editorController.isSaving,
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
