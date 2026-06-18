import { motion } from 'framer-motion';
import { Pencil, Trash2, Save, X, Loader2, ArrowUp, ArrowDown, Globe } from 'lucide-react';
import type { BlogCategory } from '@/types';
import type { BlogCategoryFormValues } from '../model/blogCategory.schema';

const INPUT_CLASS = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-300';

interface BlogCategoryRowProps {
  category: BlogCategory;
  index: number;
  total: number;
  isEditing: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  form?: BlogCategoryFormValues;
  onEdit: () => void;
  onDelete: () => void;
  onReorderUp: () => void;
  onReorderDown: () => void;
  onUpdateForm: (updater: (form: BlogCategoryFormValues) => BlogCategoryFormValues) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

export function BlogCategoryRow({
  category,
  index,
  total,
  isEditing,
  isSaving,
  isDeleting,
  form,
  onEdit,
  onDelete,
  onReorderUp,
  onReorderDown,
  onUpdateForm,
  onSave,
  onCancel,
}: BlogCategoryRowProps) {
  const hasArticles = (category.article_count ?? 0) > 0;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`hover:bg-gray-50/50 transition-colors ${isEditing ? 'bg-amber-50/30 ring-1 ring-amber-200 ring-inset' : ''}`}
    >
      <td className="px-5 py-3">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={onReorderUp}
            disabled={index === 0 || isEditing}
            className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-all"
            title="上移"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            onClick={onReorderDown}
            disabled={index === total - 1 || isEditing}
            className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-all"
            title="下移"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>
      </td>

      <td className="px-4 py-3">
        {isEditing && form ? (
          <input
            type="text"
            value={form.name.zh}
            onChange={(e) => onUpdateForm((f) => ({ ...f, name: { ...f.name, zh: e.target.value } }))}
            className={INPUT_CLASS}
            autoFocus
          />
        ) : (
          <span className="font-semibold text-gray-800">{category.name_zh}</span>
        )}
      </td>

      <td className="px-4 py-3">
        {isEditing && form ? (
          <input
            type="text"
            value={form.name.en}
            onChange={(e) => onUpdateForm((f) => ({ ...f, name: { ...f.name, en: e.target.value } }))}
            className={INPUT_CLASS}
          />
        ) : (
          <span className="text-gray-600 flex items-center gap-1">
            <Globe className="w-3 h-3 text-gray-400" />
            {category.name_en}
          </span>
        )}
      </td>

      <td className="px-4 py-3">
        {isEditing && form ? (
          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              onUpdateForm((f) => ({
                ...f,
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
              }))
            }
            className={`${INPUT_CLASS} font-mono text-xs`}
          />
        ) : (
          <code className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{category.slug}</code>
        )}
      </td>

      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${hasArticles ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
          {category.article_count ?? 0} 篇
        </span>
      </td>

      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-1">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                disabled={isSaving}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all disabled:opacity-50"
                title="保存"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </button>
              <button
                onClick={onCancel}
                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"
                title="取消"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="编辑分类"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                disabled={isDeleting || hasArticles}
                title={hasArticles ? `该分类有 ${category.article_count} 篇文章，无法删除` : '删除分类'}
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
}
