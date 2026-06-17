// Header 组件管理主入口

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, AlertTriangle, Globe, Share2, Menu, Loader2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { checkPageExists } from '@/lib/linkUtils';
import type { HeaderContent } from '@/types';
import siteSettings from '@/config/siteSettings.json';
import { getPreviewUrl } from '@/lib/utils';
import NavEditor from './NavEditor';

// Header 预览组件
function HeaderPreview({ header, language }: { header: HeaderContent; language: 'zh' | 'en' }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          预览效果
          <Badge variant="outline" className="ml-2">{language === 'zh' ? '中文' : 'English'}</Badge>
        </CardTitle>
        <CardDescription>在浏览器中的实际显示效果（简易预览，完整下拉效果请在前台查看）</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              {siteSettings.brand.logo && (
                <img
                  src={getPreviewUrl(siteSettings.brand.logo)}
                  alt="Logo"
                  className="w-8 h-8 object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <span className="text-xl font-bold text-gray-800">
                {siteSettings.brand.name[language]}
              </span>
            </div>

            {/* 导航菜单 */}
            <nav className="hidden md:flex items-center gap-6">
              {header.navItems.slice(0, 5).map((item, index) => (
                <div key={index} className="group relative">
                  <span
                    className={`text-sm font-medium transition-colors ${item.pageDeleted
                      ? 'text-red-500 line-through'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {item.name[language]}
                    {item.children && item.children.length > 0 && (
                      <span className="ml-1 text-xs">▼</span>
                    )}
                  </span>
                </div>
              ))}
            </nav>

            {/* 右侧操作 */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 border border-gray-200">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200">
                <Globe className="w-4 h-4" />
                {language === 'zh' ? '中文' : 'EN'}
              </button>
              <button className="md:hidden p-2 text-gray-600">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HeaderEditor() {
  const { content, isLoading: contextLoading } = useContent();
  const [localHeader, setLocalHeader] = useState<HeaderContent>(content.header);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDeletedPages, setHasDeletedPages] = useState(false);
  const [previewLang, setPreviewLang] = useState<'zh' | 'en'>('zh');

  // 从 context 同步数据
  useEffect(() => {
    setLocalHeader(content.header);
  }, [content.header]);

  // 检查是否有已删除的页面链接
  useEffect(() => {
    const hasDeleted = localHeader.navItems.some(
      (item) => !checkPageExists(item.href, item.linkType, content.pages) || 
      (item.children && item.children.some(sub => !checkPageExists(sub.href, sub.linkType, content.pages)))
    );
    setHasDeletedPages(hasDeleted);
  }, [localHeader.navItems, content.pages]);

  // 将旧格式转换为新格式
  useEffect(() => {
    const needsConversion = localHeader.navItems.some((item) => !('linkType' in item));
    if (needsConversion) {
      const convertedItems = localHeader.navItems.map((item) => ({
        ...item,
        linkType: (item.href?.startsWith('http') ? 'external' : 'internal') as 'internal' | 'external',
      }));
      setLocalHeader({ ...localHeader, navItems: convertedItems });
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setIsSaving(false);
    }
  };

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

      {/* Header 预览 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">组件预览</span>
          <div className="flex gap-1">
            <Button
              variant={previewLang === 'zh' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewLang('zh')}
            >
              中文
            </Button>
            <Button
              variant={previewLang === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewLang('en')}
            >
              English
            </Button>
          </div>
        </div>
        <HeaderPreview header={localHeader} language={previewLang} />
      </div>

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
        onChange={(items) => setLocalHeader({ ...localHeader, navItems: items })} 
      />
    </div>
  );
}
