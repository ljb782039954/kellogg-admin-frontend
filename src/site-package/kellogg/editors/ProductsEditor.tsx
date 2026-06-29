import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Layers, Star, Loader2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';

// Subcomponents
import ProductSummary from './product/ProductSummary';
import ProductMediaSection from './product/ProductMediaSection';
import ProductInfoSection from './product/ProductInfoSection';
import ProductVariantsSection from './product/ProductVariantsSection';
import ProductCustomFields from './product/ProductCustomFields';
import BulkPriceSection from './product/BulkPriceSection';

import type { Product } from '@/types';

export default function ProductsEditor() {
  const {
    allProducts,
    categories,
    createProduct,
    updateProduct: apiUpdateProduct,
    deleteProduct: apiDeleteProduct,
    isLoading: contextLoading,
  } = useContent();
  const { language } = useLanguage();

  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync data from context to local state
  useEffect(() => {
    setLocalProducts(
      allProducts.map(p => {
        const images = p.images && p.images.length > 0 ? p.images : [p.image];
        return {
          ...p,
          images,
          image: images[0] || ''
        };
      })
    );
  }, [allProducts]);

  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === localProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(localProducts.map((p) => p.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;

    const count = selectedIds.size;
    const confirmMsg = language === 'zh'
      ? `确定要删除这 ${count} 个产品吗？此操作不可撤销。`
      : `Are you sure you want to delete these ${count} products? This action cannot be undone.`;

    if (window.confirm(confirmMsg)) {
      setIsSaving(true);
      setError(null);
      try {
        for (const id of selectedIds) {
          await apiDeleteProduct(id);
        }
        setSelectedIds(new Set());
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : '删除失败');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      for (const localProduct of localProducts) {
        const remoteProduct = allProducts.find(p => p.id === localProduct.id);

        if (!remoteProduct) {
          await createProduct({
            name_zh: localProduct.name.zh,
            name_en: localProduct.name.en,
            price: localProduct.price,
            original_price: localProduct.originalPrice,
            bulk_prices: localProduct.bulkPrices,
            category_id: localProduct.category,
            rating: localProduct.rating,
            sales: localProduct.sales,
            tag_zh: localProduct.tag?.zh,
            tag_en: localProduct.tag?.en,
            description_zh: localProduct.description?.zh,
            description_en: localProduct.description?.en,
            release_date: localProduct.releaseDate,
            is_featured: localProduct.isFeatured,
            image: localProduct.image,
            images: localProduct.images,
            fabric_zh: localProduct.fabric?.zh,
            fabric_en: localProduct.fabric?.en,
            notes_zh: localProduct.notes?.zh,
            notes_en: localProduct.notes?.en,
            is_active: localProduct.isActive,
            sizes: localProduct.sizes,
            colors: localProduct.colors?.map(c => ({
              name_zh: c.name.zh,
              name_en: c.name.en,
              image: c.image
            })),
            custom_fields: localProduct.customFields?.map(cf => ({
              name_zh: cf.name.zh,
              name_en: cf.name.en,
              value_zh: cf.value.zh,
              value_en: cf.value.en
            })),
          });
        } else {
          const hasChanges =
            JSON.stringify(localProduct.name) !== JSON.stringify(remoteProduct.name) ||
            localProduct.price !== remoteProduct.price ||
            localProduct.originalPrice !== remoteProduct.originalPrice ||
            JSON.stringify(localProduct.bulkPrices) !== JSON.stringify(remoteProduct.bulkPrices) ||
            localProduct.category !== remoteProduct.category ||
            localProduct.rating !== remoteProduct.rating ||
            localProduct.sales !== remoteProduct.sales ||
            JSON.stringify(localProduct.tag) !== JSON.stringify(remoteProduct.tag) ||
            localProduct.releaseDate !== remoteProduct.releaseDate ||
            localProduct.isFeatured !== remoteProduct.isFeatured ||
            localProduct.image !== remoteProduct.image ||
            JSON.stringify(localProduct.images) !== JSON.stringify(remoteProduct.images) ||
            JSON.stringify(localProduct.fabric) !== JSON.stringify(remoteProduct.fabric) ||
            JSON.stringify(localProduct.notes) !== JSON.stringify(remoteProduct.notes) ||
            localProduct.isActive !== remoteProduct.isActive ||
            JSON.stringify(localProduct.sizes) !== JSON.stringify(remoteProduct.sizes) ||
            JSON.stringify(localProduct.colors) !== JSON.stringify(remoteProduct.colors) ||
            JSON.stringify(localProduct.customFields) !== JSON.stringify(remoteProduct.customFields);

          if (hasChanges) {
            await apiUpdateProduct(localProduct.id, {
              name_zh: localProduct.name.zh,
              name_en: localProduct.name.en,
              price: localProduct.price,
              original_price: localProduct.originalPrice,
              bulk_prices: localProduct.bulkPrices,
              category_id: localProduct.category,
              rating: localProduct.rating,
              sales: localProduct.sales,
              tag_zh: localProduct.tag?.zh,
              tag_en: localProduct.tag?.en,
              description_zh: localProduct.description?.zh,
              description_en: localProduct.description?.en,
              release_date: localProduct.releaseDate,
              is_featured: localProduct.isFeatured,
              image: localProduct.image,
              images: localProduct.images,
              fabric_zh: localProduct.fabric?.zh,
              fabric_en: localProduct.fabric?.en,
              notes_zh: localProduct.notes?.zh,
              notes_en: localProduct.notes?.en,
              is_active: localProduct.isActive,
              sizes: localProduct.sizes,
              colors: localProduct.colors?.map(c => ({
                name_zh: c.name.zh,
                name_en: c.name.en,
                image: c.image
              })),
              custom_fields: localProduct.customFields?.map(cf => ({
                name_zh: cf.name.zh,
                name_en: cf.name.en,
                value_zh: cf.value.zh,
                value_en: cf.value.en
              })),
            });
          }
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  const addProduct = () => {
    const newId = Math.max(...localProducts.map((p) => p.id), 0) + 1;
    const newProduct: Product = {
      id: newId,
      name: { zh: '新产品', en: 'New Product' },
      price: 0,
      bulkPrices: [],
      image: '',
      images: [],
      rating: 5,
      sales: 0,
      category: categories.length > 0 ? categories[0].id : '',
      releaseDate: new Date().toISOString().split('T')[0],
      tag: { zh: '', en: '' },
      isFeatured: false,
      isActive: true,
      customFields: [],
    };
    setLocalProducts([newProduct, ...localProducts]);
    setExpandedId(newId);
  };

  const updateLocalProduct = <K extends keyof Product>(id: number, field: K, value: Product[K]) => {
    setLocalProducts(prev =>
      prev.map((p): Product => {
        if (p.id === id) {
          const updated = { ...p, [field]: value };
          if (field === 'images' && Array.isArray(value)) {
            updated.image = value.length > 0 ? value[0] as string : '';
          }
          return updated as Product;
        }
        return p;
      })
    );
  };

  const removeProduct = async (id: number) => {
    if (confirm(language === 'zh' ? '确定要删除这个产品吗？' : 'Are you sure you want to delete this product?')) {
      const existsOnServer = allProducts.some(p => p.id === id);

      if (existsOnServer) {
        setIsSaving(true);
        try {
          await apiDeleteProduct(id);
        } catch (err) {
          setError(err instanceof Error ? err.message : '删除失败');
          setIsSaving(false);
          return;
        }
        setIsSaving(false);
      }

      setLocalProducts(localProducts.filter((p) => p.id !== id));
      const nextSelected = new Set(selectedIds);
      nextSelected.delete(id);
      setSelectedIds(nextSelected);
    }
  };

  if (contextLoading && allProducts.length === 0 && localProducts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">加载中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            产品主仓库
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full font-mono">
              v2.1
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">管理全站产品参数。支持批量管理及图集展示。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={handleBatchDelete}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold text-sm border border-red-100 animate-in fade-in slide-in-from-right-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              批量删除 ({selectedIds.size})
            </button>
          )}
          <button
            onClick={addProduct}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            添加产品
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium shadow-lg text-sm disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            保存全部改动
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2 text-sm"
        >
          <span className="w-2 h-2 bg-red-500 rounded-full" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">×</button>
        </motion.div>
      )}

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 px-4 py-3 rounded-xl border border-green-100 flex items-center gap-2 text-sm"
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          保存成功！更新已发布至全站。
        </motion.div>
      )}

      {/* Stats & Filter Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedIds.size === localProducts.length && localProducts.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {selectedIds.size > 0 ? `已选 ${selectedIds.size} 项` : '全选'}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-100 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              总计: {localProducts.length} 件
            </span>
          </div>
          <div className="h-4 w-px bg-gray-100 hidden md:block" />
          <div className="hidden md:flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              精选: {localProducts.filter((p) => p.isFeatured).length} 件
            </span>
          </div>
        </div>

        <div className="text-[10px] text-gray-300 font-mono italic">
          {isSaving ? 'SYNCING...' : 'SYNC STATUS: STABLE'}
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4 pb-20">
        <AnimatePresence>
          {localProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white rounded-2xl border transition-all relative overflow-hidden ${expandedId === product.id
                ? 'border-gray-900 shadow-xl z-10'
                : selectedIds.has(product.id)
                  ? 'border-amber-200 bg-amber-50/20 shadow-sm'
                  : 'border-gray-100 shadow-sm'
                }`}
            >
              <ProductSummary
                product={product}
                categories={categories}
                isExpanded={expandedId === product.id}
                isSelected={selectedIds.has(product.id)}
                onToggleExpand={() => setExpandedId(expandedId === product.id ? null : product.id)}
                onToggleSelect={(e) => {
                  e.stopPropagation();
                  toggleSelect(product.id);
                }}
                onUpdateField={(field, value) => updateLocalProduct(product.id, field, value)}
                onRemove={(e) => {
                  e.stopPropagation();
                  removeProduct(product.id);
                }}
              />

              {/* Detailed Content */}
              <AnimatePresence>
                {expandedId === product.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-8 pt-2 border-t border-gray-50 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ProductMediaSection
                          product={product}
                          onUpdateField={(field, value) => updateLocalProduct(product.id, field, value)}
                        />
                        <ProductInfoSection
                          product={product}
                          categories={categories}
                          language={language}
                          onUpdateField={(field, value) => updateLocalProduct(product.id, field, value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ProductVariantsSection
                          product={product}
                          onUpdateField={(field, value) => updateLocalProduct(product.id, field, value)}
                        />
                        <ProductCustomFields
                          product={product}
                          onUpdateField={(field, value) => updateLocalProduct(product.id, field, value)}
                        />
                        <div className="pt-6 border-t border-gray-50">
                          <BulkPriceSection
                            bulkPrices={product.bulkPrices || []}
                            onChange={(prices) => updateLocalProduct(product.id, 'bulkPrices', prices)}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Float Save Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-black transition-all font-bold shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          保存所有改动
        </button>
      </div>
    </div>
  );
}
