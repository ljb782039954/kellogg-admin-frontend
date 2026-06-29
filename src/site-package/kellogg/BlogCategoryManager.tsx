import { useMemo } from 'react';
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
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';
import { useBlogCategoryManager } from '@/core/items/blog';

const INPUT_CLASS = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-300';

export default function BlogCategoryManager() {
  const notify = useMemo(() => ({
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
  }), []);
  const {
    categories,
    deletingId,
    editingRow,
    isLoading,
    isSaving,
    cancelEdit,
    handleDelete,
    handleReorder,
    handleSave,
    startEdit,
    startNew,
    updateEditingEnglishName,
    updateEditingRow,
    updateEditingSlug,
  } = useBlogCategoryManager({
    confirmDelete: message => window.confirm(message),
    notify,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
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
          disabled={editingRow?.id === null}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-all font-medium shadow-sm text-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          新增分类
        </button>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <strong>修改分类名称说明：</strong>修改英文名称（English Name）后，所有使用该分类的博客文章将自动更新到新分类名称。
        </div>
      </div>

      {/* Table */}
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

              {/* New row editor */}
              <AnimatePresence>
                {editingRow?.id === null && (
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
                        value={editingRow.name_zh}
                        onChange={e => updateEditingRow({ name_zh: e.target.value })}
                        placeholder="中文名称（如：行业资讯）"
                        className={INPUT_CLASS}
                        autoFocus
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editingRow.name_en}
                        onChange={e => updateEditingEnglishName(e.target.value)}
                        placeholder="English Name (e.g. Industry News)"
                        className={INPUT_CLASS}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editingRow.slug}
                        onChange={e => updateEditingSlug(e.target.value)}
                        placeholder="auto-slug"
                        className={`${INPUT_CLASS} font-mono text-xs`}
                      />
                    </td>
                    <td className="px-4 py-2 text-gray-400 text-xs">—</td>
                    <td className="px-5 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={handleSave}
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

              {/* Category rows */}
              {categories.length === 0 && editingRow?.id !== null ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                    <FolderOpen className="w-10 h-10 mx-auto mb-3 stroke-[1]" />
                    暂无分类，点击「新增分类」开始创建
                  </td>
                </tr>
              ) : (
                categories.map((cat, idx) => {
                  const isEditing = editingRow?.id === cat.id;
                  const isDeleting = deletingId === cat.id;
                  const hasArticles = (cat.article_count ?? 0) > 0;

                  return (
                    <motion.tr
                      key={cat.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`hover:bg-gray-50/50 transition-colors ${isEditing ? 'bg-amber-50/30 ring-1 ring-amber-200 ring-inset' : ''}`}
                    >
                      {/* Sort order controls */}
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handleReorder(cat, 'up')}
                            disabled={idx === 0 || isEditing}
                            className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-all"
                            title="上移"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleReorder(cat, 'down')}
                            disabled={idx === categories.length - 1 || isEditing}
                            className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-all"
                            title="下移"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Name ZH */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingRow!.name_zh}
                            onChange={e => updateEditingRow({ name_zh: e.target.value })}
                            className={INPUT_CLASS}
                            autoFocus
                          />
                        ) : (
                          <span className="font-semibold text-gray-800">{cat.name_zh}</span>
                        )}
                      </td>

                      {/* Name EN */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingRow!.name_en}
                            onChange={e => updateEditingRow({ name_en: e.target.value })}
                            className={INPUT_CLASS}
                          />
                        ) : (
                          <span className="text-gray-600 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-gray-400" />
                            {cat.name_en}
                          </span>
                        )}
                      </td>

                      {/* Slug */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingRow!.slug}
                            onChange={e => updateEditingSlug(e.target.value)}
                            className={`${INPUT_CLASS} font-mono text-xs`}
                          />
                        ) : (
                          <code className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{cat.slug}</code>
                        )}
                      </td>

                      {/* Article Count */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${hasArticles ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                          {cat.article_count ?? 0} 篇
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {isEditing ? (
                            <>
                              <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all disabled:opacity-50"
                                title="保存"
                              >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"
                                title="取消"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(cat)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="编辑分类"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(cat)}
                                disabled={isDeleting || hasArticles}
                                title={hasArticles ? `该分类有 ${cat.article_count} 篇文章，无法删除` : '删除分类'}
                                className={`p-1.5 rounded-lg transition-all ${hasArticles ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                              >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
