// Header 组件管理主入口

import { motion } from 'framer-motion';
import { Save, AlertTriangle,Loader2 } from 'lucide-react';
import { useHeaderEditor } from '@/core-adminApp/items/site';
import { Button } from '@/components/ui/button';
import NavEditor from './NavEditor';


export default function HeaderEditor() {
  const {
    contextLoading,
    error,
    hasDeletedPages,
    isSaving,
    localHeader,
    saved,
    handleSave,
    setError,
    updateNavItems,
  } = useHeaderEditor();

  if (contextLoading) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Header 导航管理</h1>
          <p className="text-gray-500 mt-1">编辑网站顶部导航菜单，支持下拉框</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
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
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">×</button>
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

      {/* 页面删除警告 */}
      {hasDeletedPages && (
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded-lg">
          <AlertTriangle className="w-5 h-5" />
          <span>部分导航链接指向的页面已被删除，请更新相关链接。</span>
        </div>
      )}

      {/* 提示信息 */}
      <div className="p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2 text-sm">
        <span className="w-2 h-2 bg-blue-500 rounded-full" />
        品牌 Logo 和名称由「公司信息管理」统一配置。
      </div>

      {/* 导航菜单列表编辑器 */}
      <NavEditor 
        navItems={localHeader.navItems} 
        onChange={updateNavItems} 
      />
    </div>
  );
}
