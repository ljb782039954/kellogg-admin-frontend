import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Layers, Loader2 } from 'lucide-react';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留 model，P4 提取到 core 后删除。
import { useCategoriesEditor } from '@/features/categories/model/useCategoriesEditor';
import { CategoryListItem } from './CategoryListItem';

export function CategoriesEditor() {
  const {
    categories,
    isLoading,
    error,
    addCategory,
    updateCategoryName,
    updateCategoryImage,
    removeCategory,
  } = useCategoriesEditor();

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-red-500 rounded-full" />
          {error}
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-500" />
          全部分类
        </h2>

        <div className="space-y-3">
          {categories.length === 0 && (
            <p className="text-center text-gray-400 py-8">暂无分类，点击下方按钮添加</p>
          )}
          {categories.map((cat) => (
            <div key={cat.id}>
              <CategoryListItem
                category={cat}
                onUpdateName={updateCategoryName}
                onUpdateImage={updateCategoryImage}
                onRemove={(id) => setDeleteConfirm(id)}
              />
              {deleteConfirm === cat.id && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-lg ml-14 mt-1"
                >
                  <span className="text-xs text-red-600">
                    确定要删除分类「{cat.name.zh || cat.name.en}」？已绑定的产品将失去此筛选条件。
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      removeCategory(cat.id);
                      setDeleteConfirm(null);
                    }}
                    className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    确认删除
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(null)}
                    className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg"
                  >
                    取消
                  </button>
                </motion.div>
              )}
            </div>
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
        <div className="text-amber-500 flex-shrink-0 mt-0.5">⚠️</div>
        <p className="text-sm text-amber-800">
          <strong>注意：</strong> 删除分类可能会导致已绑定该分类的产品在筛选时失效。建议仅在没有关联产品时删除。
        </p>
      </div>
    </div>
  );
}
