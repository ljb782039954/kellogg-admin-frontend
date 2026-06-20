import { Layers, Star, Trash2, Loader2 } from 'lucide-react';
import AdminImage from '@/ui/media/AdminImage';
import { Switch } from '@/ui/primitives/switch';
import type { Category, Product } from '@/types';

interface ProductListSectionProps {
  products: Product[];
  categories: Category[];
  selectedIds: Set<number>;
  isSaving: boolean;
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onEditProduct: (id: number) => void;
  onRemoveProduct: (id: number) => void;
  onToggleFeatured: (id: number, isFeatured: boolean) => void;
  onToggleActive: (id: number, isActive: boolean) => void;
}

export default function ProductListSection({
  products,
  categories,
  selectedIds,
  isSaving,
  onToggleSelect,
  onToggleSelectAll,
  onEditProduct,
  onRemoveProduct,
  onToggleFeatured,
  onToggleActive,
}: ProductListSectionProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-400 text-sm">暂无产品数据</p>
        <p className="text-gray-300 text-xs mt-1">点击上方"添加产品"开始</p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedIds.size === products.length && products.length > 0}
              onChange={onToggleSelectAll}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {selectedIds.size > 0 ? `已选 ${selectedIds.size} 项` : '全选'}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-100" />
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              总计: {products.length} 件
            </span>
          </div>
          <div className="h-4 w-px bg-gray-100 hidden md:block" />
          <div className="hidden md:flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              精选: {products.filter((p) => p.isFeatured).length} 件
            </span>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-2xl border transition-all ${
              selectedIds.has(product.id)
                ? 'border-amber-200 bg-amber-50/20 shadow-sm'
                : 'border-gray-100 shadow-sm'
            }`}
          >
            <div className="px-6 py-4 flex items-center justify-between select-none">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="p-1 -ml-1 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(product.id);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.id)}
                    onChange={() => {}}
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
                  <h3 className="font-bold text-gray-800">
                    {product.name.zh || '未命名产品'}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase font-mono">
                      ID: {product.id}
                    </span>
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      {categories.find((c) => c.id === product.category)?.name.zh || '未分类'}
                    </span>
                    <span className="text-xs font-bold text-gray-900">¥{product.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wide">
                      上架
                    </span>
                    <Switch
                      checked={product.isActive}
                      onCheckedChange={(checked) => onToggleActive(product.id, checked)}
                      className="scale-90"
                    />
                  </div>
                  <div
                    className="flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wide">
                      精选
                    </span>
                    <Switch
                      checked={product.isFeatured}
                      onCheckedChange={(checked) => onToggleFeatured(product.id, checked)}
                      className="scale-90"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProduct(product.id);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  编辑
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveProduct(product.id);
                  }}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
