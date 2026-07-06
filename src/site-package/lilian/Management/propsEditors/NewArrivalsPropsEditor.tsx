// 新品组件属性编辑器（轻量版）
import { useContent } from '@/core-adminApp/context/ContentContext';
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
import BilingualInput from '@/core-adminApp/ui/Input/BilingualInput';
import { getPreviewUrl } from '@/core-adminApp/lib/utils';
import type { NewArrivalsContent } from '@site/ui-display/block-adapters';

export interface NewArrivalsPropsEditorProps {
  props: NewArrivalsContent;
  onUpdate: (props: NewArrivalsContent) => void;
}


export function NewArrivalsPropsEditor({ props, onUpdate }: NewArrivalsPropsEditorProps) {
  const { allProducts } = useContent();

  // 按发布日期排序获取最新商品
  const newProducts = [...(allProducts || [])]
    .filter((p) => p.releaseDate)
    .sort((a, b) => new Date(b.releaseDate!).getTime() - new Date(a.releaseDate!).getTime())
    .slice(0, props.maxItems || 8);

  return (
    <div className="space-y-6">
      {/* 区块标题 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">区块标题 (Heading)</h4>
        <BilingualInput
          label="标题"
          value={props.title || { zh: '新品上市', en: 'New Arrivals' }}
          onChange={(val) => onUpdate({ ...props, title: val })}
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
              value={props.layout || 'slider'}
              onValueChange={(val) => onUpdate({ ...props, layout: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slider">滑动展示 (Slider)</SelectItem>
                <SelectItem value="grid">网格展示 (Grid)</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
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
            {newProducts.slice(0, 8).map((product) => (
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
