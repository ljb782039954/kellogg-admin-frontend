import { useEffect, useState } from 'react';
import { useContent } from '@/core-adminApp/context/ContentContext';
import type { Product } from '@/cms/types';
import {
  createDraftProduct,
  hasProductChanges,
  mapProductToInput,
  normalizeProductImages,
  updateProductField,
} from './productMapper';

type Language = 'zh' | 'en';

interface UseProductsEditorOptions {
  confirmDelete?: (message: string) => boolean;
  language: Language;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useProductsEditor({
  confirmDelete,
  language,
}: UseProductsEditorOptions) {
  const {
    allProducts,
    categories,
    createProduct,
    updateProduct: apiUpdateProduct,
    deleteProduct: apiDeleteProduct,
    isLoading: contextLoading,
  } = useContent();

  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalProducts(allProducts.map(normalizeProductImages));
  }, [allProducts]);

  const showSaved = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(previous => (
      previous.size === localProducts.length
        ? new Set()
        : new Set(localProducts.map(product => product.id))
    ));
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;

    const count = selectedIds.size;
    const confirmMessage = language === 'zh'
      ? `确定要删除这 ${count} 个产品吗？此操作不可撤销。`
      : `Are you sure you want to delete these ${count} products? This action cannot be undone.`;

    if (confirmDelete && !confirmDelete(confirmMessage)) return;

    setIsSaving(true);
    setError(null);

    try {
      for (const id of selectedIds) {
        await apiDeleteProduct(id);
      }
      setSelectedIds(new Set());
      showSaved();
    } catch (err) {
      setError(getErrorMessage(err, '删除失败'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      for (const localProduct of localProducts) {
        const remoteProduct = allProducts.find(product => product.id === localProduct.id);

        if (!remoteProduct) {
          await createProduct(mapProductToInput(localProduct));
        } else if (hasProductChanges(localProduct, remoteProduct)) {
          await apiUpdateProduct(localProduct.id, mapProductToInput(localProduct));
        }
      }

      showSaved();
    } catch (err) {
      setError(getErrorMessage(err, '保存失败'));
    } finally {
      setIsSaving(false);
    }
  };

  const addProduct = () => {
    const newProduct = createDraftProduct(localProducts, categories);
    setLocalProducts(previous => [newProduct, ...previous]);
    setExpandedId(newProduct.id);
  };

  const updateLocalProduct = <K extends keyof Product>(id: number, field: K, value: Product[K]) => {
    setLocalProducts(previous => previous.map(product => (
      product.id === id ? updateProductField(product, field, value) : product
    )));
  };

  const removeProduct = async (id: number) => {
    const confirmMessage = language === 'zh'
      ? '确定要删除这个产品吗？'
      : 'Are you sure you want to delete this product?';

    if (confirmDelete && !confirmDelete(confirmMessage)) return;

    const existsOnServer = allProducts.some(product => product.id === id);

    if (existsOnServer) {
      setIsSaving(true);
      try {
        await apiDeleteProduct(id);
      } catch (err) {
        setError(getErrorMessage(err, '删除失败'));
        setIsSaving(false);
        return;
      }
      setIsSaving(false);
    }

    setLocalProducts(previous => previous.filter(product => product.id !== id));
    setSelectedIds(previous => {
      const next = new Set(previous);
      next.delete(id);
      return next;
    });
  };

  return {
    allProducts,
    categories,
    contextLoading,
    error,
    expandedId,
    isSaving,
    localProducts,
    saved,
    selectedIds,
    addProduct,
    handleBatchDelete,
    handleSave,
    removeProduct,
    setError,
    setExpandedId,
    toggleSelect,
    toggleSelectAll,
    updateLocalProduct,
  };
}
