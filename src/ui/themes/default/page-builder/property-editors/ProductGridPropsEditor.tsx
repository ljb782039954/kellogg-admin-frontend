// 产品网格属性编辑器
import { Label } from '@/ui/primitives/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/primitives/select';
import type { ProductGridProps } from '@/components/blocks/ProductGrid';

export interface ProductGridPropsEditorProps {
  props: ProductGridProps;
  onUpdate: (props: ProductGridProps) => void;
}

export function ProductGridPropsEditor({ props, onUpdate }: ProductGridPropsEditorProps) {

  const handleChange = (key: string, value: unknown) => {
    onUpdate({ ...props, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* 设置每页显示数量 */}
      <div className="space-y-2">
        <Label>每页显示数量</Label>
        <Select
          value={String(props.itemsPerPage || 12)}
          onValueChange={(val) => handleChange('itemsPerPage', parseInt(val) || 12)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择显示数量" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4 个</SelectItem>
            <SelectItem value="8">8 个</SelectItem>
            <SelectItem value="12">12 个</SelectItem>
            <SelectItem value="16">16 个</SelectItem>
            <SelectItem value="20">20 个</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
