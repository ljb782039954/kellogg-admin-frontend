import type { PropertyEditorProps } from '@/package/page-builder';
// 产品网格属性编辑器
import { Label } from '@/package/ui/primitives/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/package/ui/primitives/select';
import type { ProductGridProps } from '@/package/ui/blocks/blocks/ProductGrid';



export function ProductGridPropsEditor({ value, onChange }: PropertyEditorProps<ProductGridProps>) {

  const handleChange = (key: string, val: unknown) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-6">
      {/* 设置每页显示数量 */}
      <div className="space-y-2">
        <Label>每页显示数量</Label>
        <Select
          value={String(value.itemsPerPage || 12)}
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
