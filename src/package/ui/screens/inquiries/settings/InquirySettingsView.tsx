import { Save, Loader2, FileText, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { type UseFormReturn } from 'react-hook-form';
import { BilingualInput, BilingualTextarea } from '@/package/ui/forms';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留 schema，P4 提取到 core 后删除。
import type { InquirySettingsFormValues } from '@/features/inquiries/model/inquiry.schema';

interface InquirySettingsViewProps {
  form: UseFormReturn<InquirySettingsFormValues>;
  isSaving: boolean;
  error: string | null;
  onSubmit(): void;
}

export function InquirySettingsView({ form, isSaving, error, onSubmit }: InquirySettingsViewProps) {
  const title = form.watch('title');
  const description = form.watch('description');
  const titleErrors = form.formState.errors.title;
  const descErrors = form.formState.errors.description;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            询盘页面编辑
          </h1>
          <p className="text-gray-500 mt-1 text-sm">配置询盘页面的标题和引导文字。</p>
        </div>
        <button
          onClick={onSubmit}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium shadow-lg disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          保存配置
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4" /> 页面头部文本
          </h3>
        </div>
        <div className="p-8 space-y-8">
          <div>
            <BilingualInput
              label="主标题"
              value={title}
              onChange={(val) => form.setValue('title', val, { shouldValidate: true })}
            />
            {titleErrors?.zh && <p className="text-red-500 text-xs mt-1">{titleErrors.zh.message}</p>}
          </div>

          <div>
            <BilingualTextarea
              label="描述性文字"
              value={description}
              onChange={(val) => form.setValue('description', val, { shouldValidate: true })}
              placeholder={{
                zh: '如果您有任何关于产品的咨询，请填写下方表格，我们的团队会尽快与您联系。',
                en: 'If you have any inquiries about our products, please fill out the form below and our team will get back to you as soon as possible.',
              }}
            />
            {descErrors?.zh && <p className="text-red-500 text-xs mt-1">{descErrors.zh.message}</p>}
          </div>
        </div>
      </motion.div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
        <Info className="w-6 h-6 text-blue-500 fill-blue-50/50 flex-shrink-0" />
        <div className="text-sm text-blue-700 space-y-1">
          <p className="font-bold">提示</p>
          <p>这些文字将显示在询盘页面的左侧。右侧的表单项和公司信息（地址、电话等）是固定的。</p>
        </div>
      </div>
    </div>
  );
}
