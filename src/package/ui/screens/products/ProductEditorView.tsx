import { X, Loader2 } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import type { BulkPrice, Category } from '@/package/types';
import { BilingualTextControl } from '@/shared/forms/controls/BilingualTextControl';
import { Button } from '@/package/ui/primitives/button';
import { Input } from '@/package/ui/primitives/input';
import { Label } from '@/package/ui/primitives/label';
import { Separator } from '@/package/ui/primitives/separator';
import ProductMediaSection from './ProductMediaSection';
import ProductVariantsSection from './ProductVariantsSection';
import ProductCustomFieldsSection from './ProductCustomFieldsSection';
import BulkPriceSection from './BulkPriceSection';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留表单 schema，P4 提取后删除。
import type { ProductFormValues } from '@/features/products/model/product.schema';

interface ProductEditorViewProps {
  form: UseFormReturn<ProductFormValues>;
  categories: Category[];
  isSaving: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
}

export function ProductEditorView({
  form,
  categories,
  isSaving,
  onSubmit,
  onClose,
}: ProductEditorViewProps) {
  const { control, register, watch, setValue } = form;
  const values = watch();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {values.id > 0 ? '编辑产品' : '添加新产品'}
            </h2>
            <p className="text-xs text-gray-400">
              {values.id > 0 ? `ID: ${values.id}` : '新建产品'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              保存
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-8">
          {/* Basic Info */}
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">基本信息</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>产品名称</Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <BilingualTextControl
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={{ zh: '产品中文名称', en: 'Product English Name' }}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>零售价格 (¥)</Label>
                  <Input
                    type="number"
                    {...register('price', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>划线原价 (可选)</Label>
                  <Input
                    type="number"
                    {...register('originalPrice', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>所属分类</Label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 text-sm"
                  >
                    <option value="">未分类</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.zh || c.name.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>上架日期</Label>
                  <Input type="date" {...register('releaseDate')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>展示标签 (如: Hot, New)</Label>
                <Controller
                  control={control}
                  name="tag"
                  render={({ field }) => (
                    <BilingualTextControl
                      value={field.value ?? { zh: '', en: '' }}
                      onChange={field.onChange}
                      placeholder={{ zh: '中文标签', en: 'English Tag' }}
                    />
                  )}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Metrics */}
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">数据指标</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>用户评分</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  {...register('rating', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label>累计销量</Label>
                <Input
                  type="number"
                  {...register('sales', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label>面料说明</Label>
                <Controller
                  control={control}
                  name="fabric"
                  render={({ field }) => (
                    <BilingualTextControl
                      value={field.value ?? { zh: '', en: '' }}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </section>

          {/* Media */}
          <ProductMediaSection watch={watch} setValue={setValue} />

          <Separator />

          {/* Variants */}
          <ProductVariantsSection
            setValue={setValue}
            values={values}
          />

          <Separator />

          {/* Custom Fields */}
          <ProductCustomFieldsSection
            setValue={setValue}
            values={values}
          />

          <Separator />

          {/* Bulk Pricing */}
          <BulkPriceSection
            bulkPrices={(values.bulkPrices ?? []) as BulkPrice[]}
            onChange={(prices) => setValue('bulkPrices', prices)}
          />

          <div className="space-y-2">
            <Label>注意事项</Label>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <BilingualTextControl
                  value={field.value ?? { zh: '', en: '' }}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
