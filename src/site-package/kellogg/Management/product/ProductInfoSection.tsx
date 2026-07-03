import { Star, TrendingUp, Layers, Calendar } from 'lucide-react';
import BilingualInput from '../../components/BilingualInput';
import type { Product, Category } from '@/core-adminApp/types';

interface ProductInfoSectionProps {
  product: Product;
  categories: Category[];
  language: string;
  onUpdateField: <K extends keyof Product>(field: K, value: Product[K]) => void;
}

export default function ProductInfoSection({
  product,
  categories,
  language,
  onUpdateField,
}: ProductInfoSectionProps) {
  return (
    <div className="space-y-6">
      {/* Metrics: Rating & Sales */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
            <Star className="w-3 h-3" /> 用户评分
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={product.rating}
            onChange={(e) => onUpdateField('rating', parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 累计销量
          </label>
          <input
            type="number"
            value={product.sales}
            onChange={(e) => onUpdateField('sales', parseInt(e.target.value))}
            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Primary Info */}
      <div className="space-y-6">
        <BilingualInput
          label="产品名称"
          value={product.name}
          onChange={(val) => onUpdateField('name', val)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">零售价格 (¥)</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => onUpdateField('price', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 text-gray-300">划线原价 (可选)</label>
            <input
              type="number"
              value={product.originalPrice || ''}
              onChange={(e) => onUpdateField('originalPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
              <Layers className="w-3 h-3" /> 所属分类
            </label>
            <select
              value={product.category}
              onChange={(e) => onUpdateField('category', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 text-sm"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name[language as keyof typeof c.name] || c.name.zh}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> 上架日期
            </label>
            <input
              type="date"
              value={product.releaseDate}
              onChange={(e) => onUpdateField('releaseDate', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 text-sm"
            />
          </div>
        </div>

        <BilingualInput
          label="展示标签 (如: Hot, New)"
          value={product.tag || { zh: '', en: '' }}
          onChange={(val) => onUpdateField('tag', val)}
        />

        <div className="pt-4 border-t border-gray-100 space-y-4">
          <BilingualInput
            label="面料说明"
            value={product.fabric || { zh: '', en: '' }}
            onChange={(val) => onUpdateField('fabric', val)}
          />
          <BilingualInput
            label="注意事项"
            value={product.notes || { zh: '', en: '' }}
            onChange={(val) => onUpdateField('notes', val)}
          />
        </div>
      </div>
    </div>
  );
}
