import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Layers, GripVertical, Loader2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import BilingualInput from '@/admin/components/BilingualInput';
import ImageInput from '@/admin/components/ImageInput';
import type { Category } from '@/types';

export default function CategoriesEditor() {
  const {
    categories,
    createCategory,
    updateCategory: apiUpdateCategory,
    deleteCategory: apiDeleteCategory,
    isLoading: contextLoading,
  } = useContent();

  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从 context 同步数据到本地状态
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const originalCategories = categories;

      // 找出需要创建的分类（本地有但远程没有的）
      for (const localCat of localCategories) {
        const exists = originalCategories.find(c => c.id === localCat.id);
        if (!exists) {
          // 新分类
          await createCategory({
            id: localCat.id,
            name_zh: localCat.name.zh,
            name_en: localCat.name.en,
            image: localCat.image,
          });
        } else {
          // 修改判断增加 image 比较
          const hasChanges =
            localCat.name.zh !== exists.name.zh ||
            localCat.name.en !== exists.name.en ||
            localCat.image !== exists.image;

          if (hasChanges) {
            await apiUpdateCategory(localCat.id, {
              name_zh: localCat.name.zh,
              name_en: localCat.name.en,
              image: localCat.image,
            });
          }
        }
      }

      // 找出需要删除的分类（远程有但本地没有的）
      for (const originalCat of originalCategories) {
        const stillExists = localCategories.find(c => c.id === originalCat.id);
        if (!stillExists) {
          await apiDeleteCategory(originalCat.id);
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

  const addCategory = () => {
    const newId = `cat_${Date.now()}`;
    setLocalCategories([
      ...localCategories,
      { id: newId, name: { zh: '新分类', en: 'New Category' }, image: '' },
    ]);
  };

  const updateLocalCategory = (index: number, val: { zh: string; en: string }) => {
    const next = [...localCategories];
    next[index] = { ...next[index], name: val };
    setLocalCategories(next);
  };

  const updateLocalCategoryImage = (index: number, val: string) => {
    const next = [...localCategories];
    next[index] = { ...next[index], image: val };
    setLocalCategories(next);
  };

  const removeCategory = (index: number) => {
    setLocalCategories(localCategories.filter((_, i) => i !== index));
  };

  // 防抖改进：仅在初始化且都为空时显示全局加载，避免用户点击保存重载数据时剥离焦点
  if (contextLoading && categories.length === 0 && localCategories.length === 0) {
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
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium shadow-lg disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">×</button>
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
          {localCategories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl group"
            >
              <GripVertical className="w-4 h-4 text-gray-300" />
              <div className="flex-1 space-y-4">
                <BilingualInput
                  label=""
                  value={cat.name}
                  onChange={(val) => updateLocalCategory(index, val)}
                  placeholder={{ zh: '分类名称', en: 'Category Name' }}
                />

                <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-white">
                  <div className="flex-shrink-0 w-24">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">分类主图</p>
                    <ImageInput
                      value={cat.image || ''}
                      onChange={(val) => updateLocalCategoryImage(index, val)}
                      aspectRatio="square"
                      maxWidth={100}
                    />
                  </div>
                  <div className="flex-1 text-sm text-gray-400 mt-6">
                    在拥有导航画廊、大型精选分类展示区等场合作为展示海报。可选配。
                  </div>
                </div>
              </div>
              <div className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                ID: {cat.id}
              </div>
              <button
                onClick={() => removeCategory(index)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}

          <button
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
