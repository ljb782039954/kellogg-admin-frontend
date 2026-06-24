// 新品组件属性编辑器（轻量版）
import { Input } from '@/package/ui/primitives/input';
import { Label } from '@/package/ui/primitives/label';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/package/ui/primitives/alert';
import BilingualInput from '@/package/ui/forms/BilingualInput';
import { getPreviewUrl } from '@/shared/utils';
import type { NewArrivalsProps } from '@/package/ui/blocks/blocks/NewArrivals';
import type { Product } from '@/package/types';
import type { PropertyEditorProps } from '@/features/page-builder';

export function NewArrivalsPropsEditor({
  value,
  onChange,
  resources,
}: PropertyEditorProps<NewArrivalsProps>) {
  const { products } = resources;

  // 按发布日期排序获取最新商品
  const newProducts = [...(products || [])]
    .filter((p) => p.releaseDate)
    .sort((a, b) => new Date(b.releaseDate!).getTime() - new Date(a.releaseDate!).getTime())
    .slice(0, value.maxItems || 8);

  return (
    <div className="space-y-6">
      {/* 区块标题 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">区块标题 (Heading)</h4>
        <BilingualInput
          label="标题"
          value={value.title || { zh: '新品上市', en: 'New Arrivals' }}
          onChange={(val) => onChange({ ...value, title: val })}
        />
      </div>

      {/* 显示设置 */}
      <div className="space-y-4 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">显示设置 (Settings)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>显示数量</Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={value.maxItems || 8}
              onChange={(e) => onChange({ ...value, maxItems: parseInt(e.target.value) || 8 })}
            />
          </div>
        </div>
      </div>

      {/* 数据来源说明 */}
      <Alert className="bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-700">
          新品数据根据商品的「发布日期」自动排序获取。如需调整商品，请前往「商品管理」编辑。
        </AlertDescription>
      </Alert>

      {/* 当前新品预览 */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-700">当前新品预览 (Total: {newProducts.length})</h4>
        {newProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">暂无新品</p>
            <p className="text-xs mt-1">请在商品中设置「发布日期」</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {newProducts.slice(0, 8).map((product: Product) => (
              <div
                key={product.id}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden border"
              >
                {product.image ? (
                  <img
                    src={getPreviewUrl(product.image)}
                    alt={product.name.zh}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    无图
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
