import { Plus, Trash2, ClipboardList } from 'lucide-react';
import type { Product } from '@/core-adminApp/types';
// import BilingualRichInput from '@/admin/components/BilingualRichInput';

interface ProductCustomFieldsProps {
  product: Product;
  onUpdateField: <K extends keyof Product>(field: K, value: Product[K]) => void;
}

export default function ProductCustomFields({
  product,
  onUpdateField,
}: ProductCustomFieldsProps) {
  const customFields = product.customFields || [];

  return (
    <div className="space-y-8 mt-8">

      {/* Custom Fields Management */}
      <div className="pt-6 border-t border-gray-100 pb-10">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-1">
          <ClipboardList className="w-3 h-3" /> 自定义参数管理
        </label>
        <div className="space-y-4">
          {customFields.map((field, fIdx) => (
            <div key={fIdx} className="bg-gray-100 p-4 rounded-xl relative group/cf">
              <div className="grid grid-cols-1 gap-4 items-end">
                <div className="space-y-3">
                  <p className="text-sm font-bold text-gray-400 uppercase">参数名称 (键)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="中文键"
                      value={field.name.zh}
                      onChange={(e) => {
                        const nextFields = [...customFields];
                        nextFields[fIdx] = { ...field, name: { ...field.name, zh: e.target.value } };
                        onUpdateField('customFields', nextFields);
                      }}
                      className="w-full bg-white px-3 py-2 rounded-lg border-none text-xs focus:ring-1 focus:ring-gray-900"
                    />
                    <input
                      placeholder="英文键"
                      value={field.name.en}
                      onChange={(e) => {
                        const nextFields = [...customFields];
                        nextFields[fIdx] = { ...field, name: { ...field.name, en: e.target.value } };
                        onUpdateField('customFields', nextFields);
                      }}
                      className="w-full bg-white px-3 py-2 rounded-lg border-none text-xs focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-bold text-gray-400 uppercase">参数内容 (值)</p>
                  <p className="text-sm text-orange-600">文本中使用“//”或者“\\”，在前端显示中会自动进行换行。 </p>

                  <div className="grid grid-cols-2 gap-2">
                    <textarea
                      placeholder="中文值"
                      value={field.value.zh}
                      onChange={(e) => {
                        const nextFields = [...customFields];
                        nextFields[fIdx] = { ...field, value: { ...field.value, zh: e.target.value } };
                        onUpdateField('customFields', nextFields);
                      }}
                      className="w-full h-32 bg-white px-3 py-2 rounded-lg border-none text-xs focus:ring-1 focus:ring-gray-900"
                    />
                    <textarea
                      placeholder="英文值"
                      value={field.value.en}
                      onChange={(e) => {
                        const nextFields = [...customFields];
                        nextFields[fIdx] = { ...field, value: { ...field.value, en: e.target.value } };
                        onUpdateField('customFields', nextFields);
                      }}
                      className="w-full h-32 bg-white px-3 py-2 rounded-lg border-none text-xs focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  const nextFields = [...customFields];
                  nextFields.splice(fIdx, 1);
                  onUpdateField('customFields', nextFields);
                }}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/cf:opacity-100 transition-opacity z-10 shadow-sm"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              onUpdateField('customFields', [...customFields, { name: { zh: '', en: '' }, value: { zh: '', en: '' } }]);
            }}
            className="w-full py-3 border border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> 添加新参数
          </button>
        </div>
      </div>
    </div>
  );
}
