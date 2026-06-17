import { Plus, Trash2, Package } from 'lucide-react';
import type { BulkPrice } from '@/types';

interface BulkPriceSectionProps {
  bulkPrices: BulkPrice[];
  onChange: (prices: BulkPrice[]) => void;
}

export default function BulkPriceSection({ bulkPrices, onChange }: BulkPriceSectionProps) {
  const addPriceTier = () => {
    const lastTier = bulkPrices[bulkPrices.length - 1];
    const newMin = lastTier ? (lastTier.maxQty || lastTier.minQty) + 1 : 1;
    onChange([...bulkPrices, { minQty: newMin, maxQty: null, price: 0 }]);
  };

  const removePriceTier = (index: number) => {
    onChange(bulkPrices.filter((_, i) => i !== index));
  };

  const updatePriceTier = (index: number, updates: Partial<BulkPrice>) => {
    onChange(bulkPrices.map((tier, i) => (i === index ? { ...tier, ...updates } : tier)));
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Package className="w-3 h-3" /> 批量价格阶梯
        </h3>
        <button
          type="button"
          onClick={addPriceTier}
          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg transition-all"
        >
          <Plus className="w-3 h-3" /> 添加阶梯
        </button>
      </div>

      <div className="space-y-3">
        {bulkPrices.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <p className="text-sm text-gray-400">暂无阶梯价格数据</p>
          </div>
        ) : (
          <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">起始数量</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">结束数量</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">单价</th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {bulkPrices.map((tier, index) => (
                  <tr key={index} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={tier.minQty}
                        onChange={(e) => updatePriceTier(index, { minQty: parseInt(e.target.value) || 0 })}
                        placeholder="1"
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 p-0"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={tier.maxQty === null ? '' : tier.maxQty}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePriceTier(index, { maxQty: val === '' ? null : parseInt(val) });
                          }}
                          placeholder="无上限"
                          className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 p-0"
                        />
                        {tier.maxQty === null && <span className="text-gray-300 text-xs font-bold">+</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-xs">¥</span>
                        <input
                          type="number"
                          step="0.01"
                          value={tier.price}
                          onChange={(e) => updatePriceTier(index, { price: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-amber-600 p-0"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => removePriceTier(index)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
