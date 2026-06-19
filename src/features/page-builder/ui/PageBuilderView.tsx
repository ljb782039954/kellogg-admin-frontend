import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Save, Settings, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BlockList } from './block-list/BlockList';
import { AddBlockDialog } from './block-picker/AddBlockDialog';
import { BlockPropertyPanel } from './property-panel/BlockPropertyPanel';
import { PageSettingsEditor } from './page-settings/PageSettingsEditor';
import { SEOEditor } from './seo-settings/SEOEditor';
import type { PageBuilderViewModel, PageBuilderActions } from '../model/pageBuilder.types';

interface PageBuilderViewProps {
  viewModel: PageBuilderViewModel;
  actions: PageBuilderActions;
  onBack(): void;
}

export function PageBuilderView({ viewModel, actions, onBack }: PageBuilderViewProps) {
  const { language } = useLanguage();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const pageTitle = viewModel.page.title[language as 'zh' | 'en'] || viewModel.page.title.zh;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left sidebar: block list */}
      <div className="w-80 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-800 truncate">{pageTitle}</h2>
              <p className="text-[10px] text-gray-400 font-mono truncate">{viewModel.page.path}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                actions.selectPanel(
                  viewModel.selectedPanel?.type === 'page-settings' ? null : { type: 'page-settings' },
                )
              }
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewModel.selectedPanel?.type === 'page-settings'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-3 h-3" />
              设置
            </button>
            <button
              type="button"
              onClick={() =>
                actions.selectPanel(
                  viewModel.selectedPanel?.type === 'seo-settings' ? null : { type: 'seo-settings' },
                )
              }
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewModel.selectedPanel?.type === 'seo-settings'
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
            blocks={viewModel.page.blocks}
            selectedId={
              viewModel.selectedPanel?.type === 'block' ? viewModel.selectedPanel.blockId : null
            }
            onSelect={(id) => actions.selectPanel({ type: 'block', blockId: id })}
            onToggle={(id) => actions.toggleBlock(id)}
            onRemove={(id) => actions.removeBlock(id)}
            onMoveUp={(id) => {
              const idx = viewModel.page.blocks.findIndex((b) => b.id === id);
              if (idx > 0) actions.moveBlock(id, idx - 1);
            }}
            onMoveDown={(id) => {
              const idx = viewModel.page.blocks.findIndex((b) => b.id === id);
              if (idx < viewModel.page.blocks.length - 1) actions.moveBlock(id, idx + 1);
            }}
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
            {viewModel.selectedPanel?.type === 'page-settings'
              ? '页面设置'
              : viewModel.selectedPanel?.type === 'seo-settings'
                ? 'SEO 设置'
                : viewModel.selectedPanel?.type === 'block' && viewModel.selectedBlock
                  ? '积木属性编辑'
                  : '选择左侧积木开始编辑'}
          </h3>
          <div className="flex items-center gap-2">
            {viewModel.saveStatus === 'saved' && (
              <span className="text-xs text-green-600 font-medium">已保存</span>
            )}
            <Button
              type="button"
              onClick={actions.save}
              disabled={!viewModel.canSave}
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {viewModel.isSaving ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Save className="w-3 h-3 mr-1" />
              )}
              保存
            </Button>
          </div>
        </div>

        {viewModel.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm"
          >
            {viewModel.error}
          </motion.div>
        )}

        <div className="p-6">
          {viewModel.selectedPanel?.type === 'page-settings' && (
            <PageSettingsEditor
              title={viewModel.page.title}
              path={viewModel.page.path}
              isFixed={viewModel.page.isFixed}
              onUpdate={(updates) => {
                if (updates.title) actions.updateMeta({ title: updates.title });
                if (updates.path) actions.updateMeta({ path: updates.path });
              }}
            />
          )}
          {viewModel.selectedPanel?.type === 'seo-settings' && (
            <SEOEditor
              value={viewModel.page.seo}
              onChange={(seo) => actions.updateSeo(seo)}
            />
          )}
          {viewModel.selectedBlock && (
            <BlockPropertyPanel
              block={viewModel.selectedBlock}
              onChange={(content) => actions.updateBlock(viewModel.selectedBlock!.id, content)}
            />
          )}
        </div>
      </div>

      <AddBlockDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={(type) => {
          actions.addBlock(type);
          setAddDialogOpen(false);
        }}
        items={viewModel.availableBlocks}
      />
    </div>
  );
}
