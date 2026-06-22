import { motion } from 'framer-motion';
import { Save, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/package/ui/primitives/button';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留 model，P4 提取到 core 后删除。
import { useNavigationEditor } from '@/features/navigation/model/useNavigationEditor';
import { NavigationFormView } from './NavigationFormView';
import { NavigationPreview } from './NavigationPreview';

export function NavigationEditor() {
  const {
    header,
    isLoading,
    isSaving,
    saved,
    error,
    hasDeletedPages,
    previewLang,
    setPreviewLang,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItemName,
    handleAddSubItem,
    handleRemoveSubItem,
    handleUpdateSubItemName,
    handleUpdateSubItemLink,
    save,
    pages,
  } = useNavigationEditor();

  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-gray-800">Header 导航管理</h1>
          <p className="text-gray-500 mt-1">编辑网站顶部导航菜单，支持下拉框</p>
        </div>
        <Button onClick={save} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          保存更改
        </Button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-red-500 rounded-full" />
          {error}
        </motion.div>
      )}

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 px-4 py-3 rounded-lg"
        >
          保存成功！
        </motion.div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">组件预览</span>
          <div className="flex gap-1">
            <Button variant={previewLang === 'zh' ? 'default' : 'outline'} size="sm" onClick={() => setPreviewLang('zh')}>
              中文
            </Button>
            <Button variant={previewLang === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setPreviewLang('en')}>
              English
            </Button>
          </div>
        </div>
        <NavigationPreview header={header} language={previewLang} />
      </div>

      {hasDeletedPages && (
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded-lg">
          <AlertTriangle className="w-5 h-5" />
          <span>部分导航链接指向的页面已被删除，请更新相关链接。</span>
        </div>
      )}

      <div className="p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2 text-sm">
        <span className="w-2 h-2 bg-blue-500 rounded-full" />
        品牌 Logo 和名称由「公司信息管理」统一配置。
      </div>

      <NavigationFormView
        navItems={header.navItems}
        pages={pages}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onUpdateItemName={handleUpdateItemName}
        onAddSubItem={handleAddSubItem}
        onRemoveSubItem={handleRemoveSubItem}
        onUpdateSubItemName={handleUpdateSubItemName}
        onUpdateSubItemLink={handleUpdateSubItemLink}
      />
    </div>
  );
}
