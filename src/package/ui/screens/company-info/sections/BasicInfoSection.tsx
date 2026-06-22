import { Controller, type Control, type FormState } from 'react-hook-form';
import { Building2 } from 'lucide-react';
import { Label } from '@/package/ui/primitives/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/package/ui/primitives/card';
import { BilingualTextControl } from '@/shared/forms/controls/BilingualTextControl';
import { BilingualTextareaControl } from '@/shared/forms/controls/BilingualTextareaControl';
import ImageInput from '@/package/ui/media/ImageInput';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留 model，P4 提取到 core 后删除。
import type { CompanyInfoFormValues } from '@/features/company-info/model/companyInfo.mapper';

interface BasicInfoSectionProps {
  control: Control<CompanyInfoFormValues>;
  formState: FormState<CompanyInfoFormValues>;
}

export function BasicInfoSection({ control, formState }: BasicInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          基本信息
        </CardTitle>
        <CardDescription>
          公司名称、Logo 和简介会显示在网站的 Header、Footer 等位置
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>公司名称</Label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <BilingualTextControl
                value={field.value}
                onChange={field.onChange}
                placeholder={{ zh: '公司中文名称', en: 'Company English Name' }}
              />
            )}
          />
          {formState.errors.name?.zh && (
            <p className="text-xs text-red-500">{formState.errors.name.zh.message}</p>
          )}
          {formState.errors.name?.en && (
            <p className="text-xs text-red-500">{formState.errors.name.en.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>公司 Logo</Label>
          <Controller
            control={control}
            name="logo"
            render={({ field }) => (
              <ImageInput value={field.value} onChange={field.onChange} label="上传 Logo" maxWidth={400} />
            )}
          />
          <p className="text-xs text-gray-500">建议尺寸: 200x60 像素，支持 PNG、JPG、SVG 格式</p>
        </div>

        <div className="space-y-2">
          <Label>公司简介</Label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <BilingualTextareaControl
                value={field.value}
                onChange={field.onChange}
                placeholder={{ zh: '请输入公司简介', en: 'Enter company description' }}
              />
            )}
          />
          {formState.errors.description?.zh && (
            <p className="text-xs text-red-500">{formState.errors.description.zh.message}</p>
          )}
          {formState.errors.description?.en && (
            <p className="text-xs text-red-500">{formState.errors.description.en.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
