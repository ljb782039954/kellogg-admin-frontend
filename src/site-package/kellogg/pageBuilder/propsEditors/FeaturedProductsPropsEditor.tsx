// 精选商品组件属性编辑器（轻量版）
import { useContent } from '@/core/context/ContentContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BilingualInput from '../../components/BilingualInput';
import { getPreviewUrl } from '@/core/lib/utils';
import type { FeaturedProductsProps } from '@/components/blocks/FeaturedProducts';

export interface FeaturedProductsPropsEditorProps {
  props: FeaturedProductsProps;
  onUpdate: (props: FeaturedProductsProps) => void;
}


export function FeaturedProductsPropsEditor({ props, onUpdate }: FeaturedProductsPropsEditorProps) {
  const { allProducts } = useContent();

  // 获取精选商品 (isFeatured 为 true 的商品)
  const featuredProducts = (allProducts || [])
    .filter(p => p.isFeatured)
    .slice(0, props.maxItems || 8);

  // 如果没有标记为精选的商品，则显示前几个
  const displayProducts = featuredProducts.length > 0
    ? featuredProducts
    : (allProducts || []).slice(0, props.maxItems || 8);

  return (
    <div className="space-y-6">
      {/* 区块标题 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">区块标题 (Heading)</h4>
        <BilingualInput
          label="主标题"
          value={props.title || { zh: '精选商品', en: 'Featured Products' }}
          onChange={(val) => onUpdate({ ...props, title: val })}
        />
        <BilingualInput
          label="副标题"
          value={props.subtitle || { zh: '精选商品', en: 'Featured Products' }}
          onChange={(val) => onUpdate({ ...props, subtitle: val })}
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
              value={props.maxItems || 8}
              onChange={(e) => onUpdate({ ...props, maxItems: parseInt(e.target.value) || 8 })}
            />
          </div>
          {/* <div className="space-y-2">
            <Label>布局方式</Label>
            <Select
              value={props.layout || 'grid'}
              onValueChange={(val) => onUpdate({ ...props, layout: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">网格展示 (Grid)</SelectItem>
                <SelectItem value="slider">滑动展示 (Slider)</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
      </div>

      {/* 数据来源说明 */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          精选商品数据来自「商品管理」中勾选了「精选」的商品。
        </AlertDescription>
      </Alert>

      {/* 当前精选预览 */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-700">当前精选预览 (Total: {displayProducts.length})</h4>
        {displayProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">暂无精选商品</p>
            <p className="text-xs mt-1">请在「商品管理」中添加商品并勾选为精选</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {displayProducts.slice(0, 8).map((product: any) => (
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
