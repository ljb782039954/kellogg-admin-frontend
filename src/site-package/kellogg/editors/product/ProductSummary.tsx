import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AdminImage from '../../components/AdminImage';
import type { Product, Category } from '@/core/types';

interface ProductSummaryProps {
  product: Product;
  categories: Category[];
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onToggleSelect: (e: React.MouseEvent) => void;
  onUpdateField: <K extends keyof Product>(field: K, value: Product[K]) => void;
  onRemove: (e: React.MouseEvent) => void;
}

export default function ProductSummary({
  product,
  categories,
  isExpanded,
  isSelected,
  onToggleExpand,
  onToggleSelect,
  onUpdateField,
  onRemove,
}: ProductSummaryProps) {
  return (
    <div
      className="px-6 py-4 flex items-center justify-between cursor-pointer group select-none"
      onClick={onToggleExpand}
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          className="p-1 -ml-1 hover:bg-gray-50 rounded-lg transition-colors"
          onClick={onToggleSelect}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => { }} // Managed by parent click
            className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
          />
        </div>
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-50 flex items-center justify-center">
          <AdminImage
            src={product.image}
            thumbnail={true}
            className="w-full h-full object-cover"
            fallback={<span className="text-[10px] text-gray-400">无图</span>}
          />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
            {product.name.zh || '未命名产品'}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase font-mono">ID: {product.id}</span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              {categories.find(c => c.id === product.category)?.name.zh || '未分类'}
            </span>
            <span className="text-xs font-bold text-gray-900">¥{product.price}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-6">
          <div
            className="flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Label className="text-[10px] text-gray-400 mb-1 cursor-pointer font-bold uppercase tracking-wide group-hover:text-green-600 transition-colors">
              上架状态
            </Label>
            <Switch
              checked={product.isActive}
              onCheckedChange={(checked) => onUpdateField('isActive', checked)}
              className="scale-90"
            />
          </div>
          <div
            className="flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Label className="text-[10px] text-gray-400 mb-1 cursor-pointer font-bold uppercase tracking-wide group-hover:text-amber-600 transition-colors">
              设为精选
            </Label>
            <Switch
              checked={product.isFeatured}
              onCheckedChange={(checked) => onUpdateField('isFeatured', checked)}
              className="scale-90"
            />
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </div>
    </div>
  );
}
