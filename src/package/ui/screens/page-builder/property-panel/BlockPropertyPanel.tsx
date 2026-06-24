import { type ComponentType } from 'react';
import * as LucideIcons from 'lucide-react';
import type { PageBlock } from '@/package/types';
import { getBlockCatalogItem } from '@/package/blocks';
import type { PropertyEditorProps, PropertyEditorResources } from '@/package/page-builder';

interface BlockPropertyPanelProps {
  block: PageBlock;
  onChange(content: unknown): void;
  editors: Record<string, ComponentType<PropertyEditorProps>>;
  resources: PropertyEditorResources;
}

export function BlockPropertyPanel({
  block,
  onChange,
  editors,
  resources,
}: BlockPropertyPanelProps) {
  const meta = getBlockCatalogItem(block.type);

  if (!meta) {
    return (
      <div className="p-8 text-center bg-red-50 border border-dashed border-red-200 rounded-lg">
        <LucideIcons.AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 font-medium">未知组件类型</p>
        <p className="text-red-400 text-sm">{block.type}</p>
      </div>
    );
  }

  const iconMap = LucideIcons as unknown as Record<string, typeof LucideIcons.Square>;
  const IconComponent = iconMap[meta.icon] || LucideIcons.Square;

  const EditorComponent = editors[block.type];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 pb-4 border-b mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold">{meta.name.zh}</h3>
          <p className="text-sm text-gray-500">{meta.description.zh}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {EditorComponent ? (
          <EditorComponent
            value={block.content}
            onChange={onChange}
            resources={resources}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            暂无属性编辑器
          </div>
        )}
      </div>
    </div>
  );
}
