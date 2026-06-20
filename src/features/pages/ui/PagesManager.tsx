import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Copy, Settings, Trash2, Loader2, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { usePageList } from '../model/usePageList';
import type { PageIndexEntry } from '../model/pages.mapper';
import { Button } from '@/ui/primitives/button';
import { Input } from '@/ui/primitives/input';
import { Label } from '@/ui/primitives/label';

export function PagesManager() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { pages, isLoading, saved, error, addPage, updatePageMeta, deletePage } = usePageList();

  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'duplicate' | 'edit' | null>(null);
  const [dialogData, setDialogData] = useState<{
    sourcePage?: PageIndexEntry;
    pageId?: string;
    titleZh: string;
    titleEn: string;
    path: string;
  }>({ titleZh: '', titleEn: '', path: '' });

  const filtered = pages.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.zh.toLowerCase().includes(q) ||
      p.title.en.toLowerCase().includes(q) ||
      p.path.toLowerCase().includes(q)
    );
  });

  const fixedBlockPages = filtered.filter(
    (p) => p.type === 'fixed-block' || (p.isFixed && p.type !== 'fixed-layout'),
  );
  const dynamicBlockPages = filtered.filter(
    (p) =>
      p.type === 'dynamic-block' ||
      (!p.isFixed && p.type !== 'fixed-layout' && p.type !== 'fixed-block'),
  );
  const fixedLayoutPages = filtered.filter((p) => p.type === 'fixed-layout');

  const openCreateDialog = useCallback(() => {
    setDialogMode('create');
    setDialogData({ titleZh: '', titleEn: '', path: '/' });
  }, []);

  const openDuplicateDialog = useCallback((page: PageIndexEntry) => {
    setDialogMode('duplicate');
    setDialogData({
      sourcePage: page,
      titleZh: page.title.zh,
      titleEn: page.title.en,
      path: `${page.path}-copy`,
    });
  }, []);

  const openEditDialog = useCallback((page: PageIndexEntry) => {
    setDialogMode('edit');
    setDialogData({
      pageId: page.id,
      titleZh: page.title.zh,
      titleEn: page.title.en,
      path: page.path,
    });
  }, []);

  const handleDialogConfirm = useCallback(async () => {
    const { titleZh, titleEn, path, sourcePage, pageId } = dialogData;
    const title = { zh: titleZh, en: titleEn };

    if (dialogMode === 'create') {
      await addPage(title, path, undefined, navigate);
    } else if (dialogMode === 'duplicate') {
      await addPage(title, path, sourcePage, navigate);
    } else if (dialogMode === 'edit' && pageId) {
      await updatePageMeta(pageId, { title, path });
    }

    setDialogMode(null);
  }, [dialogData, dialogMode, addPage, updatePageMeta, navigate]);

  const handleDelete = useCallback(async (pageId: string) => {
    await deletePage(pageId);
    setDeleteConfirm(null);
  }, [deletePage]);

  function PageCard({ page }: { page: PageIndexEntry }) {
    const isFixedLayout = page.type === 'fixed-layout';
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-gray-800">{page.title[language as 'zh' | 'en'] || page.title.zh}</h3>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">{page.path}</code>
              {page.isFixed && (
                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">固定</span>
              )}
              {isFixedLayout && (
                <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold">固定布局</span>
              )}
            </div>
            {!isFixedLayout && (
              <p className="text-xs text-gray-400">{page.blockCount} 个积木块</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
          {!isFixedLayout && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate(`/pages/${page.id}/edit`)}
            >
              <FileText className="w-3 h-3 mr-1" />
              编辑积木
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => openEditDialog(page)}
          >
            <Settings className="w-3 h-3 mr-1" />
            设置
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => openDuplicateDialog(page)}
          >
            <Copy className="w-3 h-3 mr-1" />
            复制
          </Button>
          {!page.isFixed && !isFixedLayout && (
            deleteConfirm === page.id ? (
              <div className="flex items-center gap-1 ml-auto">
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleDelete(page.id)}
                >
                  确认删除
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setDeleteConfirm(null)}
                >
                  取消
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-red-500 ml-auto"
                onClick={() => setDeleteConfirm(page.id)}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                删除
              </Button>
            )
          )}
        </div>
      </div>
    );
  }

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">页面管理</h1>
          <p className="text-gray-500 mt-1 text-sm">管理网站页面、积木布局和 SEO 设置</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-gray-900 text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          新建页面
        </Button>
      </div>

          {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-red-500 rounded-full" />
          {error}
        </motion.div>
      )}

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 px-4 py-3 rounded-xl border border-green-100 text-sm flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          保存成功
        </motion.div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="搜索页面..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 text-sm"
        />
      </div>

      {/* Block-composed pages */}
      {fixedBlockPages.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-3">预设积木页面</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fixedBlockPages.map((page) => <PageCard key={page.id} page={page} />)}
          </div>
        </section>
      )}

      {dynamicBlockPages.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-3">自定义积木页面</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dynamicBlockPages.map((page) => <PageCard key={page.id} page={page} />)}
          </div>
        </section>
      )}

      {dynamicBlockPages.length === 0 && fixedBlockPages.length === 0 && fixedLayoutPages.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">暂无页面</p>
          <p className="text-gray-300 text-xs mt-1">点击"新建页面"创建第一个页面</p>
        </div>
      )}

      {/* Fixed-layout pages */}
      {fixedLayoutPages.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-3">固定布局页面</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fixedLayoutPages.map((page) => <PageCard key={page.id} page={page} />)}
          </div>
        </section>
      )}

      {/* Create/Edit/Duplicate Dialog */}
      {dialogMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-gray-800">
              {dialogMode === 'create' ? '新建页面' : dialogMode === 'duplicate' ? '复制页面' : '页面设置'}
            </h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>中文标题</Label>
                <Input
                  value={dialogData.titleZh}
                  onChange={(e) => setDialogData({ ...dialogData, titleZh: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>英文标题</Label>
                <Input
                  value={dialogData.titleEn}
                  onChange={(e) => setDialogData({ ...dialogData, titleEn: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>URL 路径</Label>
                <Input
                  value={dialogData.path}
                  onChange={(e) => setDialogData({ ...dialogData, path: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogMode(null)}>取消</Button>
              <Button onClick={handleDialogConfirm} className="bg-gray-900 text-white hover:bg-gray-800">
                {dialogMode === 'create' ? '创建' : dialogMode === 'duplicate' ? '复制' : '保存'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800">确认删除</h2>
            <p className="text-sm text-gray-500">确定要删除此页面吗？此操作不可撤销。</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>取消</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>删除</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
