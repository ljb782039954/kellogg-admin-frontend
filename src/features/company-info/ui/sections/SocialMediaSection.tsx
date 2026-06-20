import { type FormState, type UseFormRegister } from 'react-hook-form';
import { Share2 } from 'lucide-react';
import { Label } from '@/ui/primitives/label';
import { Input } from '@/ui/primitives/input';
import { Separator } from '@/ui/primitives/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/primitives/card';
import type { CompanyInfoFormValues } from '../../model/companyInfo.mapper';

interface SocialMediaSectionProps {
  register: UseFormRegister<CompanyInfoFormValues>;
  formState: FormState<CompanyInfoFormValues>;
}

const SOCIAL_FIELDS: { key: keyof CompanyInfoFormValues['socialMedia']; label: string; placeholder: string }[] = [
  { key: 'wechat', label: '微信公众号 ID', placeholder: 'wechat_id' },
  { key: 'weibo', label: '微博主页', placeholder: 'https://weibo.com/...' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/...' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/...' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://whatsapp.com/...' },
];

export function SocialMediaSection({ register, formState }: SocialMediaSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          社交媒体
        </CardTitle>
        <CardDescription>
          社交媒体链接，会显示在 Footer 的社交图标区域
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOCIAL_FIELDS.map(({ key, label, placeholder }) => {
            const path = `socialMedia.${key}` as `socialMedia.${typeof key}`;
            return (
              <div key={key as string}>
                {key === 'facebook' && <Separator className="col-span-full my-2" />}
                <div className="space-y-2">
                  <Label>{label}</Label>
                  <Input {...register(path)} placeholder={placeholder} />
                  {formState.errors.socialMedia?.[key] && (
                    <p className="text-xs text-red-500">{formState.errors.socialMedia[key]?.message}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
