import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, Settings, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePageEditor } from '../model/usePageEditor';
import { BlockList } from '@/admin/pageBuilder/BlockList';
import { AddBlockDialog } from '@/admin/pageBuilder/AddBlockDialog';
import { BlockPropsEditor } from '@/admin/pageBuilder/BlockPropsEditor';
import { PageSettingsEditor } from '@/admin/pageBuilder/PageSettingsEditor';
import { SEOEditor } from '@/admin/pageBuilder/SEOEditor';
import { Button } from '@/components/ui/button';

export function PageBuilderEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const {
    localPage,
    isLoading,
    isSaving,
    saved,
    error,
    activePanel,
    setActivePanel,
    isFixedLayout,
    handleSave,
    handleAddBlock,
    handleRemoveBlock,
    handleToggleBlock,
    handleMoveBlock,
    handleUpdateBlockProps,
    handleUpdateMeta,
    handleUpdateSEO,
  } = usePageEditor(pageId);

  if (isLoading || !localPage) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">加载中...</span>
      </div>
    );
  }

  if (isFixedLayout) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">此页面类型不支持编辑积木</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/pages')}>
          返回页面列表
        </Button>
      </div>
    );
  }

  const pageTitle = localPage.title[language as 'zh' | 'en'] || localPage.title.zh;
  const selectedBlock = activePanel && activePanel !== '__settings__' && activePanel !== '__seo__'
    ? localPage.blocks.find((b) => b.id === activePanel)
    : undefined;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left sidebar: block list */}
      <div className="w-80 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/pages')}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-800 truncate">{pageTitle}</h2>
              <p className="text-[10px] text-gray-400 font-mono truncate">{localPage.path}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActivePanel(activePanel === '__settings__' ? null : '__settings__')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activePanel === '__settings__'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-3 h-3" />
              设置
            </button>
            <button
              type="button"
              onClick={() => setActivePanel(activePanel === '__seo__' ? null : '__seo__')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activePanel === '__seo__'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Search className="w-3 h-3" />
              SEO
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <BlockList
            blocks={localPage.blocks}
            selectedId={activePanel ?? undefined}
            onSelect={setActivePanel}
            onToggle={handleToggleBlock}
            onRemove={handleRemoveBlock}
            onMoveUp={(id) => handleMoveBlock(id, 'up')}
            onMoveDown={(id) => handleMoveBlock(id, 'down')}
          />
        </div>

        <div className="p-3 border-t border-gray-100">
          <Button
            variant="outline"
            className="w-full text-xs"
            onClick={() => setAddDialogOpen(true)}
          >
            <Settings className="w-3 h-3 mr-1" />
            添加积木
          </Button>
        </div>
      </div>

      {/* Right panel: editor */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-400 uppercase">
            {activePanel === '__settings__'
              ? '页面设置'
              : activePanel === '__seo__'
                ? 'SEO 设置'
                : activePanel && selectedBlock
                  ? '积木属性编辑'
                  : '选择左侧积木开始编辑'}
          </h3>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs text-green-600 font-medium">已保存</span>
            )}
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
              保存
            </Button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="p-6">
          {activePanel === '__settings__' && (
            <PageSettingsEditor
              title={localPage.title}
              path={localPage.path}
              isFixed={localPage.isFixed}
              onUpdate={handleUpdateMeta}
            />
          )}
          {activePanel === '__seo__' && (
            <SEOEditor
              seo={localPage.seo || { title: { zh: '', en: '' }, description: { zh: '', en: '' } }}
              onChange={handleUpdateSEO}
            />
          )}
          {selectedBlock && (
            <BlockPropsEditor
              block={selectedBlock}
              onUpdate={(content) => handleUpdateBlockProps(selectedBlock.id, content)}
            />
          )}
        </div>
      </div>

      {/* Add Block Dialog */}
      <AddBlockDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddBlock}
        existingBlocks={localPage.blocks}
      />
    </div>
  );
}
