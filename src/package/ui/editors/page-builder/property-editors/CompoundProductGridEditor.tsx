import type { PropertyEditorProps } from '@/features/page-builder';
import { LayoutPropsEditor } from './LayoutPropsEditor';
import { ProductGridPropsEditor } from './ProductGridPropsEditor';
import type { PageBlock } from '@/types';

export function CompoundProductGridEditor({
  value,
  onChange,
  resources,
}: PropertyEditorProps<any>) {
  // 模拟 block 数据，以兼容原本接收 block 实例的 LayoutPropsEditor
  const mockBlock = {
    type: 'productGrid',
    content: value,
  };

  const handleLayoutUpdate = (newBlock: PageBlock) => {
    onChange(newBlock.content);
  };

  const handleGridUpdate = (newGridProps: any) => {
    const nextContent = { ...value, productGrid: newGridProps };
    onChange(nextContent);
  };

  return (
    <div className="space-y-4">
      <LayoutPropsEditor value={mockBlock as any} onChange={handleLayoutUpdate} resources={resources} />
      <ProductGridPropsEditor
        value={value?.productGrid ?? value}
        onChange={handleGridUpdate}
        resources={resources}
      />
    </div>
  );
}
