// 分类导航组件属性编辑器（轻量版）
import { Label } from '@/package/ui/primitives/label';
import { Switch } from '@/package/ui/primitives/switch';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/package/ui/primitives/alert';
import AdminImage from '@/package/ui/media/AdminImage';
import type { CategoriesProps } from '@/package/ui/blocks/blocks/Categories';
import type { Category } from '@/package/types';
import type { PropertyEditorProps } from '@/features/page-builder';

export function CategoriesPropsEditor({
  value,
  onChange,
  resources,
}: PropertyEditorProps<CategoriesProps>) {
  const { categories } = resources;

  return (
    <div className="space-y-6">
      {/* 显示设置 */}
      <div className="space-y-4 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">显示设置 (Settings)</h4>
        <div className="flex items-center justify-between">
          <Label>显示全部分类</Label>
          <Switch
            checked={value.showAll !== false}
            onCheckedChange={(checked) => onChange({ ...value, showAll: checked })}
          />
        </div>
      </div>

      {/* 分类数据来源说明 */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          分类数据来自「商品管理 → 商品分类」。如需修改分类信息，请前往分类管理页面编辑。
        </AlertDescription>
      </Alert>

      {/* 当前分类预览 */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-700">当前分类预览 (Total: {categories?.length || 0})</h4>
        {(!categories || categories.length === 0) ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">暂无分类</p>
            <p className="text-xs mt-1">请前往「商品分类」添加分类</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat: Category) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500 font-bold uppercase overflow-hidden flex-shrink-0">
                  <AdminImage
                    src={cat.image}
                    thumbnail={true}
                    fallbackSrc={cat.image}
                    alt={cat.name.zh}
                    className="w-full h-full object-cover"
                    fallback={cat.name.zh.charAt(0)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{cat.name.zh}</p>
                  <p className="truncate text-xs text-gray-500">{cat.name.en}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
