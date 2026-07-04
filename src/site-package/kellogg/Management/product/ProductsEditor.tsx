import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Plus, Trash2, Save, Layers, Star, Loader2 } from 'lucide-react';
import { useLanguage } from '@/core-adminApp/context/LanguageContext';
import { useProductsEditor } from '@/core-adminApp/items/product';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

// Subcomponents
import ProductSummary from './ProductSummary';
import ProductMediaSection from './ProductMediaSection';
import ProductInfoSection from './ProductInfoSection';
import ProductVariantsSection from './ProductVariantsSection';
import ProductCustomFields from './ProductCustomFields';
import BulkPriceSection from './BulkPriceSection';

export default function ProductsEditor() {
  const { language } = useLanguage();
  const {
    allProducts,
    categories,
    contextLoading,
    dirtyProductIds,
    error,
    hasUnsavedChanges,
    expandedId,
    isSaving,
    localProducts,
    saved,
    selectedIds,
    unsavedProductCount,
    addProduct,
    handleBatchDelete,
    handleSave,
    removeProduct,
    setError,
    setExpandedId,
    toggleSelect,
    toggleSelectAll,
    updateLocalProduct,
  } = useProductsEditor({
    confirmDelete: message => window.confirm(message),
    language,
  });
  const editingProduct = localProducts.find(product => product.id === expandedId) || null;

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

      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <div>
            <span className="font-bold">新内容未保存</span>
            <span className="ml-2 text-orange-600">
              当前有 {unsavedProductCount} 个产品包含未保存改动，请点击“保存全部改动”。
            </span>
          </div>
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
          {localProducts.map((product) => {
            const isProductDirty = dirtyProductIds.has(product.id);

            return (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white rounded-2xl border transition-all relative overflow-hidden ${expandedId === product.id
                ? 'border-gray-900 shadow-xl z-10'
                : isProductDirty
                  ? 'border-orange-200 bg-orange-50/30 shadow-sm'
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
                hasUnsavedChanges={isProductDirty}
                onToggleExpand={() => setExpandedId(product.id)}
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
            </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Sheet open={Boolean(editingProduct)} onOpenChange={(open) => !open && setExpandedId(null)}>
        <SheetContent
          side="right"
          className="w-[min(980px,96vw)] sm:max-w-none gap-0 p-0"
        >
          {editingProduct && (
            <>
              <SheetHeader className="shrink-0 border-b px-6 py-5 pr-12">
                <SheetTitle className="text-xl">
                  {editingProduct.name.zh || '未命名产品'}
                </SheetTitle>
                <SheetDescription>
                  ID: {editingProduct.id} · 点击右上角关闭编辑弹窗
                </SheetDescription>
              </SheetHeader>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6">
                <div className="space-y-8 pb-10">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <ProductMediaSection
                      product={editingProduct}
                      onUpdateField={(field, value) => updateLocalProduct(editingProduct.id, field, value)}
                    />
                    <ProductInfoSection
                      product={editingProduct}
                      categories={categories}
                      language={language}
                      onUpdateField={(field, value) => updateLocalProduct(editingProduct.id, field, value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <ProductVariantsSection
                      product={editingProduct}
                      onUpdateField={(field, value) => updateLocalProduct(editingProduct.id, field, value)}
                    />
                    <ProductCustomFields
                      product={editingProduct}
                      onUpdateField={(field, value) => updateLocalProduct(editingProduct.id, field, value)}
                    />
                    <div className="pt-6 border-t border-gray-50">
                      <BulkPriceSection
                        bulkPrices={editingProduct.bulkPrices || []}
                        onChange={(prices) => updateLocalProduct(editingProduct.id, 'bulkPrices', prices)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

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
