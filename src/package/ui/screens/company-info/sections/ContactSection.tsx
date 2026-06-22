import { Controller, type Control, type FormState } from 'react-hook-form';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Label } from '@/package/ui/primitives/label';
import { Input } from '@/package/ui/primitives/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/package/ui/primitives/card';
import { BilingualTextControl } from '@/shared/forms/controls/BilingualTextControl';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留 model，P4 提取到 core 后删除。
import type { CompanyInfoFormValues } from '@/features/company-info/model/companyInfo.mapper';

interface ContactSectionProps {
  control: Control<CompanyInfoFormValues>;
  formState: FormState<CompanyInfoFormValues>;
}

export function ContactSection({ control, formState }: ContactSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          联系方式
        </CardTitle>
        <CardDescription>
          客户联系信息，会显示在 Footer 和联系页面
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Phone className="w-4 h-4" />联系电话</Label>
            <Controller
              control={control}
              name="contact.phone"
              render={({ field }) => <Input {...field} placeholder="+86 138-0000-0000" />}
            />
            {formState.errors.contact?.phone && (
              <p className="text-xs text-red-500">{formState.errors.contact.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Mail className="w-4 h-4" />电子邮箱</Label>
            <Controller
              control={control}
              name="contact.email"
              render={({ field }) => <Input type="email" {...field} placeholder="contact@example.com" />}
            />
            {formState.errors.contact?.email && (
              <p className="text-xs text-red-500">{formState.errors.contact.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2"><MapPin className="w-4 h-4" />公司地址</Label>
          <Controller
            control={control}
            name="contact.address"
            render={({ field }) => (
              <BilingualTextControl
                value={field.value}
                onChange={field.onChange}
                placeholder={{ zh: '请输入公司地址', en: 'Enter company address' }}
              />
            )}
          />
          {formState.errors.contact?.address?.zh && (
            <p className="text-xs text-red-500">{formState.errors.contact.address.zh.message}</p>
          )}
          {formState.errors.contact?.address?.en && (
            <p className="text-xs text-red-500">{formState.errors.contact.address.en.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
