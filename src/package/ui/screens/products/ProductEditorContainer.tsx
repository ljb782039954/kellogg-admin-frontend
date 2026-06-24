import { motion } from 'framer-motion';
import { Plus, Save, Trash2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/core/app/LanguageContext';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留 model，P4 提取到 core 后删除。
import { useProductsManager } from '@/features/products/model/useProductForm';
import { ProductEditorView } from './ProductEditorView';
import ProductListSection from './ProductListSection';

export function ProductEditorContainer() {
  const { language } = useLanguage();
  const {
    products,
    categories,
    isLoading,
    isDetailLoading,
    selectedIds,
    isEditing,
    isSaving,
    saved,
    error,
    form,
    toggleSelect,
    toggleSelectAll,
    addProduct,
    requestOpenEditor,
    requestCloseEditor,
    validatedSubmit,
    deleteSelected,
    removeProduct,
    toggleFeatured,
    toggleActive,
    setError,
  } = useProductsManager();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">加载中...</span>
      </div>
    );
  }

  const confirmDelete = () => {
    if (selectedIds.size === 0) return;
    const confirmMsg =
      language === 'zh'
        ? `确定要删除这 ${selectedIds.size} 个产品吗？此操作不可撤销。`
        : `Are you sure you want to delete these ${selectedIds.size} products?`;
    if (window.confirm(confirmMsg)) {
      deleteSelected();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            产品管理
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full font-mono">
              v3.0
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">产品采用独立编辑模式，每件产品单独保存。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={confirmDelete}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold text-sm border border-red-100 animate-in fade-in disabled:opacity-50"
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
          保存成功！
        </motion.div>
      )}

      <ProductListSection
        products={products}
        categories={categories}
        selectedIds={selectedIds}
        isSaving={isSaving}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onEditProduct={requestOpenEditor}
        onRemoveProduct={removeProduct}
        onToggleFeatured={toggleFeatured}
        onToggleActive={toggleActive}
      />

      {isEditing && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={validatedSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-black transition-all font-bold shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            保存当前产品
          </button>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={requestCloseEditor} />
          <div className="relative w-full max-w-3xl bg-white shadow-2xl overflow-y-auto">
            {isDetailLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">加载产品详情...</span>
              </div>
            ) : (
              <ProductEditorView
                form={form}
                categories={categories}
                isSaving={isSaving}
                onSubmit={validatedSubmit}
                onClose={requestCloseEditor}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
