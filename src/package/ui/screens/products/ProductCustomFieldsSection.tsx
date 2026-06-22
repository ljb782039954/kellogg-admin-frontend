import { Plus, Trash2 } from 'lucide-react';
import type { UseFormSetValue } from 'react-hook-form';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留表单 schema，P4 提取后删除。
import type { ProductFormValues } from '@/features/products/model/product.schema';

interface ProductCustomFieldsSectionProps {
  setValue: UseFormSetValue<ProductFormValues>;
  values: ProductFormValues;
}

export default function ProductCustomFieldsSection({
  setValue,
  values,
}: ProductCustomFieldsSectionProps) {
  const customFields = values.customFields ?? [];

  return (
    <section>
      <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">自定义参数</h3>
      <div className="space-y-4">
        {customFields.map((field, idx) => (
          <div key={idx} className="bg-gray-100 p-4 rounded-xl relative group/cf">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-400 uppercase">参数名称 (键)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="中文键"
                    value={field.name.zh}
                    onChange={(e) => {
                      const next = [...customFields];
                      next[idx] = { ...field, name: { ...field.name, zh: e.target.value } };
                      setValue('customFields', next);
                    }}
                    className="w-full bg-white px-3 py-2 rounded-lg border-none text-xs focus:ring-1 focus:ring-gray-900"
                  />
                  <input
                    placeholder="英文键"
                    value={field.name.en}
                    onChange={(e) => {
                      const next = [...customFields];
                      next[idx] = { ...field, name: { ...field.name, en: e.target.value } };
                      setValue('customFields', next);
                    }}
                    className="w-full bg-white px-3 py-2 rounded-lg border-none text-xs focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-400 uppercase">参数内容 (值)</p>
                <p className="text-xs text-orange-600">文本中使用 "//" 或 "\\" 可自动换行</p>
                <div className="grid grid-cols-2 gap-2">
                  <textarea
                    placeholder="中文值"
                    value={field.value.zh}
                    onChange={(e) => {
                      const next = [...customFields];
                      next[idx] = { ...field, value: { ...field.value, zh: e.target.value } };
                      setValue('customFields', next);
                    }}
                    className="w-full h-32 bg-white px-3 py-2 rounded-lg border-none text-xs focus:ring-1 focus:ring-gray-900"
                  />
                  <textarea
                    placeholder="英文值"
                    value={field.value.en}
                    onChange={(e) => {
                      const next = [...customFields];
                      next[idx] = { ...field, value: { ...field.value, en: e.target.value } };
                      setValue('customFields', next);
                    }}
                    className="w-full h-32 bg-white px-3 py-2 rounded-lg border-none text-xs focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = [...customFields];
                next.splice(idx, 1);
                setValue('customFields', next);
              }}
              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/cf:opacity-100 transition-opacity z-10 shadow-sm"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setValue('customFields', [
              ...customFields,
              { name: { zh: '', en: '' }, value: { zh: '', en: '' } },
            ])
          }
          className="w-full py-3 border border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> 添加新参数
        </button>
      </div>
    </section>
  );
}
