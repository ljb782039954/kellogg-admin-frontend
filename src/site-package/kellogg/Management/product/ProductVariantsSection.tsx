import { Plus, Trash2, ClipboardList, Palette } from 'lucide-react';
import ImageInput from '../../components/ImageInput';
import type { Product } from '@/cms/types';

interface ProductVariantsSectionProps {
  product: Product;
  onUpdateField: <K extends keyof Product>(field: K, value: Product[K]) => void;
}

export default function ProductVariantsSection({
  product,
  onUpdateField,
}: ProductVariantsSectionProps) {
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  // const customFields = product.customFields || [];

  return (
    <div className="space-y-8 mt-8">
      {/* Sizes Management */}
      <div className="pt-6 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-1">
          <ClipboardList className="w-3 h-3" /> 尺码管理
        </label>
        <div className="space-y-3 flex flex-wrap gap-3">
          {sizes.map((size, sIdx) => (
            <div key={sIdx} className="flex items-center gap-3 bg-black/5 p-2 rounded-xl relative group/size">
              <div className="w-24 items-center space-y-3">
                <input
                  placeholder="尺码名称 (如 S, L)"
                  value={size.name}
                  onChange={(e) => {
                    const nextSizes = [...sizes];
                    nextSizes[sIdx] = { ...size, name: e.target.value };
                    onUpdateField('sizes', nextSizes);
                  }}
                  className="max-w-24 text-sm font-medium border-black/20 border-1 bg-white px-2 py-1 rounded"
                />
                <div className="w-24 h-24 flex-shrink-0">
                  <ImageInput
                    value={size.image || ''}
                    onChange={(val) => {
                      const nextSizes = [...sizes];
                      nextSizes[sIdx] = { ...size, image: val };
                      onUpdateField('sizes', nextSizes);
                    }}
                    aspectRatio="square"
                    className="!space-y-0"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  const nextSizes = [...sizes];
                  nextSizes.splice(sIdx, 1);
                  onUpdateField('sizes', nextSizes);
                }}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/size:opacity-100 transition-opacity z-10 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              onUpdateField('sizes', [...sizes, { name: '', image: '' }]);
            }}
            className="px-4 py-2 border border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-1 h-32 w-24"
          >
            <Plus className="w-3.5 h-3.5" /> 添加尺码
          </button>
        </div>
      </div>

      {/* Colors Management */}
      <div className="pt-6 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-1">
          <Palette className="w-3 h-3" /> 颜色管理
        </label>
        <div className="flex flex-wrap gap-3">
          {colors.map((color, cIdx) => (
            <div key={cIdx} className="bg-gray-50 p-3 rounded-xl relative group/color">
              <div className="flex flex-col gap-3">
                <div className="w-24 h-24 flex-shrink-0">
                  <ImageInput
                    value={color.image || ''}
                    onChange={(val) => {
                      const nextColors = [...colors];
                      nextColors[cIdx] = { ...color, image: val };
                      onUpdateField('colors', nextColors);
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
                      const nextColors = [...colors];
                      nextColors[cIdx] = { ...color, name: { ...color.name, zh: e.target.value } };
                      onUpdateField('colors', nextColors);
                    }}
                    className="w-full bg-white px-2 py-1 rounded border-none text-[10px] focus:ring-1 focus:ring-gray-900"
                  />
                  <input
                    placeholder="英文名"
                    value={color.name.en}
                    onChange={(e) => {
                      const nextColors = [...colors];
                      nextColors[cIdx] = { ...color, name: { ...color.name, en: e.target.value } };
                      onUpdateField('colors', nextColors);
                    }}
                    className="w-full bg-white px-2 py-1 rounded border-none text-[10px] focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  const nextColors = [...colors];
                  nextColors.splice(cIdx, 1);
                  onUpdateField('colors', nextColors);
                }}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/color:opacity-100 transition-opacity z-10 shadow-sm"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              onUpdateField('colors', [...colors, { name: { zh: '', en: '' }, image: '' }]);
            }}
            className="px-4 py-2 border border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-1 h-40 w-24"
          >
            <Plus className="w-3.5 h-3.5" /> 添加颜色
          </button>
        </div>
      </div>
    </div>
  );
}
