import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { type UseFormReturn } from 'react-hook-form';
import { Button } from '@/package/ui/primitives/button';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留 model，P4 提取到 core 后删除。
import type { CompanyInfoFormValues } from '@/features/company-info/model/companyInfo.mapper';
import { BasicInfoSection } from './sections/BasicInfoSection';
import { ContactSection } from './sections/ContactSection';
import { SocialMediaSection } from './sections/SocialMediaSection';

interface CompanyInfoFormViewProps {
  form: UseFormReturn<CompanyInfoFormValues>;
  onSubmit: () => Promise<void> | void;
  saved: boolean;
  isSaving: boolean;
  errorMessage?: string;
}

export function CompanyInfoFormView({
  form,
  onSubmit,
  saved,
  isSaving,
  errorMessage,
}: CompanyInfoFormViewProps) {
  const { control, register, formState } = form;

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">公司信息管理</h1>
          <p className="text-gray-500 mt-1">管理公司基本信息、联系方式和社交媒体链接</p>
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          保存更改
        </Button>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 px-4 py-3 rounded-lg"
        >
          保存成功！
        </motion.div>
      )}

      {errorMessage && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">{errorMessage}</div>
      )}

      <div className="grid gap-6">
        <BasicInfoSection control={control} formState={formState} />
        <ContactSection control={control} formState={formState} />
        <SocialMediaSection register={register} formState={formState} />
      </div>
    </form>
  );
}
