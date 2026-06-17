import { motion } from 'framer-motion';
import { Plus, Save, Layers, Loader2 } from 'lucide-react';
import { useCategoriesEditor } from '../model/useCategoriesEditor';
import { CategoryListItem } from './CategoryListItem';

export function CategoriesEditor() {
  const {
    categories,
    isLoading,
    isSaving,
    saved,
    error,
    addCategory,
    updateCategory,
    removeCategory,
    save,
  } = useCategoriesEditor();

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">加载中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">分类管理</h1>
          <p className="text-gray-500 mt-1">定义产品所属的分类，将直接影响前台的筛选功能</p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium shadow-lg disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          保存更改
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-red-500 rounded-full" />
          {error}
          <button
            type="button"
            onClick={() => {}}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </motion.div>
      )}

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 px-4 py-3 rounded-xl border border-green-100"
        >
          保存成功！
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-500" />
          全部分类
        </h2>

        <div className="space-y-3">
          {categories.map((cat, index) => (
            <CategoryListItem
              key={cat.id}
              category={cat}
              index={index}
              onUpdate={updateCategory}
              onRemove={removeCategory}
            />
          ))}

          <button
            type="button"
            onClick={addCategory}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-2 bg-gray-50/30"
          >
            <Plus className="w-5 h-5" />
            添加新分类
          </button>
        </div>
      </div>

      <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3">
        <div className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5">⚠️</div>
        <p className="text-sm text-amber-800">
          <strong>注意：</strong> 删除分类可能会导致已绑定该分类的产品在筛选时失效。建议仅在没有关联产品时删除。
        </p>
      </div>
    </div>
  );
}
