import { Plus, Trash2, ClipboardList, Palette } from 'lucide-react';
import type { UseFormSetValue } from 'react-hook-form';
import ImageInput from '@/package/ui/media/ImageInput';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留表单 schema，P4 提取后删除。
import type { ProductFormValues } from '@/features/products/model/product.schema';

interface ProductVariantsSectionProps {
  setValue: UseFormSetValue<ProductFormValues>;
  values: ProductFormValues;
}

export default function ProductVariantsSection({
  setValue,
  values,
}: ProductVariantsSectionProps) {
  const sizes = values.sizes ?? [];
  const colors = values.colors ?? [];

  return (
    <section>
      <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">规格管理</h3>

      {/* Sizes */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-1">
          <ClipboardList className="w-3 h-3" /> 尺码管理
        </label>
        <div className="space-y-3 flex flex-wrap gap-3">
          {sizes.map((size, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-black/5 p-2 rounded-xl relative group/size">
              <div className="w-24 items-center space-y-3">
                <input
                  placeholder="尺码名称 (如 S, L)"
                  value={size.name}
                  onChange={(e) => {
                    const next = [...sizes];
                    next[idx] = { ...size, name: e.target.value };
                    setValue('sizes', next);
                  }}
                  className="max-w-24 text-sm font-medium border border-black/20 bg-white px-2 py-1 rounded"
                />
                <div className="w-24 h-24 flex-shrink-0">
                  <ImageInput
                    value={size.image ?? ''}
                    onChange={(val) => {
                      const next = [...sizes];
                      next[idx] = { ...size, image: val };
                      setValue('sizes', next);
                    }}
                    aspectRatio="square"
                    className="!space-y-0"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = [...sizes];
                  next.splice(idx, 1);
                  setValue('sizes', next);
                }}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/size:opacity-100 transition-opacity z-10 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setValue('sizes', [...sizes, { name: '', image: '' }])}
            className="px-4 py-2 border border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-1 h-32 w-24"
          >
            <Plus className="w-3.5 h-3.5" /> 添加尺码
          </button>
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-1">
          <Palette className="w-3 h-3" /> 颜色管理
        </label>
        <div className="flex flex-wrap gap-3">
          {colors.map((color, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-xl relative group/color">
              <div className="flex flex-col gap-3">
                <div className="w-24 h-24 flex-shrink-0">
                  <ImageInput
                    value={color.image ?? ''}
                    onChange={(val) => {
                      const next = [...colors];
                      next[idx] = { ...color, image: val };
                      setValue('colors', next);
                    }}
                    aspectRatio="square"
                    className="!space-y-0"
                  />
                </div>
                <div className="space-y-2 w-24">
                  <input
                    placeholder="中文名"
                    value={color.name.zh}
                    onChange={(e) => {
                      const next = [...colors];
                      next[idx] = { ...color, name: { ...color.name, zh: e.target.value } };
                      setValue('colors', next);
                    }}
                    className="w-full bg-white px-2 py-1 rounded border-none text-[10px] focus:ring-1 focus:ring-gray-900"
                  />
                  <input
                    placeholder="英文名"
                    value={color.name.en}
                    onChange={(e) => {
                      const next = [...colors];
                      next[idx] = { ...color, name: { ...color.name, en: e.target.value } };
                      setValue('colors', next);
                    }}
                    className="w-full bg-white px-2 py-1 rounded border-none text-[10px] focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = [...colors];
                  next.splice(idx, 1);
                  setValue('colors', next);
                }}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/color:opacity-100 transition-opacity z-10 shadow-sm"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setValue('colors', [...colors, { name: { zh: '', en: '' }, image: '' }])}
            className="px-4 py-2 border border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-1 h-40 w-24"
          >
            <Plus className="w-3.5 h-3.5" /> 添加颜色
          </button>
        </div>
      </div>
    </section>
  );
}
