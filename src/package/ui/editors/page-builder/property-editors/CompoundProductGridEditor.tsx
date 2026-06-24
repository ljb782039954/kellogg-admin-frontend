import type { PropertyEditorProps } from '@/package/page-builder';
import { LayoutPropsEditor } from './LayoutPropsEditor';
import { ProductGridPropsEditor } from './ProductGridPropsEditor';
import type { PageBlock } from '@/package/types';
import type { ProductGridProps } from '@/package/ui/blocks/blocks/ProductGrid';

type CompoundProductGridValue = Record<string, unknown> & {
  productGrid?: ProductGridProps;
};

function toCompoundProductGridValue(value: unknown): CompoundProductGridValue {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as CompoundProductGridValue;
  }

  return {};
}

export function CompoundProductGridEditor({
  value,
  onChange,
  resources,
}: PropertyEditorProps<CompoundProductGridValue>) {
  // 模拟 block 数据，以兼容原本接收 block 实例的 LayoutPropsEditor
  const mockBlock: PageBlock = {
    id: 'compound-product-grid',
    type: 'productGrid',
    content: value,
    isVisible: true,
  };

  const handleLayoutUpdate = (newBlock: PageBlock) => {
    onChange(toCompoundProductGridValue(newBlock.content));
  };

  const handleGridUpdate = (newGridProps: ProductGridProps) => {
    const nextContent = { ...value, productGrid: newGridProps };
    onChange(nextContent);
  };

  return (
    <div className="space-y-4">
      <LayoutPropsEditor value={mockBlock} onChange={handleLayoutUpdate} resources={resources} />
      <ProductGridPropsEditor
        value={(value.productGrid ?? value) as ProductGridProps}
        onChange={handleGridUpdate}
        resources={resources}
      />
    </div>
  );
}
