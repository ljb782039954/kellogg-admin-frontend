import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  Check,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useBlogCategoriesManager } from '../model/useBlogCategoriesManager';
import { BlogCategoryRow } from './BlogCategoryRow';

const INPUT_CLASS = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-300';

export function BlogCategoriesManager() {
  const {
    categories,
    isLoading,
    editingRow,
    isSaving,
    deletingId,
    startNew,
    startEdit,
    cancelEdit,
    updateEditingForm,
    saveEditingRow,
    removeCategory,
    reorder,
  } = useBlogCategoriesManager();

  const isEditingNewRow = editingRow?.id === null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <FolderOpen className="w-6 h-6" />
            博客分类管理
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full font-mono">
              {categories.length} 个分类
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            管理博客文章分类。修改分类名称时，已关联的文章会自动更新分类；有文章的分类无法删除。
          </p>
        </div>
        <button
          onClick={startNew}
          disabled={isEditingNewRow}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-all font-medium shadow-sm text-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          新增分类
        </button>
      </div>

      <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <strong>修改分类名称说明：</strong>修改英文名称（English Name）后，所有使用该分类的博客文章将自动更新到新分类名称。
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-gray-300 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm">加载分类中...</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-8">排序</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">中文名称</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">英文名称</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">文章数</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-36">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {isEditingNewRow && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-blue-50/40 border-b border-blue-100"
                  >
                    <td className="px-5 py-3 text-gray-300">—</td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editingRow!.form.name.zh}
                        onChange={(e) =>
                          updateEditingForm((form) => ({
                            ...form,
                            name: { ...form.name, zh: e.target.value },
                          }))
                        }
                        placeholder="中文名称（如：行业资讯）"
                        className={INPUT_CLASS}
                        autoFocus
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editingRow!.form.name.en}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateEditingForm((form) => ({
                            ...form,
                            name: { ...form.name, en: val },
                            slug: form.slug || toSlug(val),
                          }));
                        }}
                        placeholder="English Name (e.g. Industry News)"
                        className={INPUT_CLASS}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editingRow!.form.slug}
                        onChange={(e) =>
                          updateEditingForm((form) => ({
                            ...form,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                          }))
                        }
                        placeholder="auto-slug"
                        className={`${INPUT_CLASS} font-mono text-xs`}
                      />
                    </td>
                    <td className="px-4 py-2 text-gray-400 text-xs">—</td>
                    <td className="px-5 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={saveEditingRow}
                          disabled={isSaving}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all disabled:opacity-50"
                          title="确认创建"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-all"
                          title="取消"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>

              {categories.length === 0 && !isEditingNewRow ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                    <FolderOpen className="w-10 h-10 mx-auto mb-3 stroke-[1]" />
                    暂无分类，点击「新增分类」开始创建
                  </td>
                </tr>
              ) : (
                categories.map((cat, idx) => (
                  <BlogCategoryRow
                    key={cat.id}
                    category={cat}
                    index={idx}
                    total={categories.length}
                    isEditing={editingRow?.id === cat.id}
                    isSaving={isSaving}
                    isDeleting={deletingId === cat.id}
                    form={editingRow?.id === cat.id ? editingRow.form : undefined}
                    onEdit={() => startEdit(cat)}
                    onDelete={() => removeCategory(cat)}
                    onReorderUp={() => reorder(cat, 'up')}
                    onReorderDown={() => reorder(cat, 'down')}
                    onUpdateForm={updateEditingForm}
                    onSave={saveEditingRow}
                    onCancel={cancelEdit}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80);
}
