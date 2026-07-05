// 积木块属性编辑面板
import type { ComponentType } from 'react';
import { type PageBlock } from '@site/types';
import { componentRegistry } from '@site/metadata/componentRegistry';
import * as LucideIcons from 'lucide-react';
import BlockLivePreview from './BlockLivePreview';
import {PropsEditorSwitch} from '@site/Management/pageBuilder/BlockPropsEditor'

interface BlockPropsEditorProps {
  block: PageBlock;
  onUpdate: (content: unknown) => void;
}

export function BlockPropsEditor({ block, onUpdate }: BlockPropsEditorProps) {
  const meta = componentRegistry[block.type];

  if (!meta) {
    return (
      <div className="p-8 text-center bg-red-50 border border-dashed border-red-200 rounded-lg">
        <LucideIcons.AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 font-medium">未知组件类型</p>
        <p className="text-red-400 text-sm">{block.type}</p>
      </div>
    );
  }

  const icons = LucideIcons as unknown as Record<string, ComponentType<{ className?: string }>>;
  const IconComponent = icons[meta.icon] || icons.Box || LucideIcons.Square;

  return (
    <div className="h-full flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center gap-3 pb-4 border-b mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold">{meta.name.zh}</h3>
          <p className="text-sm text-gray-500">{meta.description.zh}</p>
        </div>
      </div>

      {/* 真实组件预览 */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-widest text-gray-800">
            真实组件预览
          </span>
          <span className="text-xs text-gray-400">
            {block.type}
          </span>
        </div>
        <BlockLivePreview
          type={block.type}
          content={block.content}
          variant="editor"
        />
      </div>

      {/* 编辑内容 */}
      <div className="flex-1 overflow-y-auto border-t pt-6">
        <PropsEditorSwitch block={block} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

