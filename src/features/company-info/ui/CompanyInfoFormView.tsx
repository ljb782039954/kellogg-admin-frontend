import { motion } from 'framer-motion';
import { Building2, Loader2, Mail, MapPin, Phone, Save, Share2 } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import ImageInput from '@/admin/components/ImageInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BilingualTextControl } from '@/shared/forms/controls/BilingualTextControl';
import { BilingualTextareaControl } from '@/shared/forms/controls/BilingualTextareaControl';
import type { CompanyInfoFormValues } from '../model/companyInfo.mapper';

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
  const { control, register, handleSubmit } = form;

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6">
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
            </div>

            <div className="space-y-2">
              <Label>公司 Logo</Label>
              <Controller
                control={control}
                name="logo"
                render={({ field }) => (
                  <ImageInput
                    value={field.value}
                    onChange={field.onChange}
                    label="上传 Logo"
                    maxWidth={400}
                  />
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
            </div>
          </CardContent>
        </Card>

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
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  联系电话
                </Label>
                <Input {...register('contact.phone')} placeholder="+86 138-0000-0000" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  电子邮箱
                </Label>
                <Input type="email" {...register('contact.email')} placeholder="contact@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                公司地址
              </Label>
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
            </div>
          </CardContent>
        </Card>

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
              <div className="space-y-2">
                <Label>微信公众号 ID</Label>
                <Input {...register('socialMedia.wechat')} placeholder="wechat_id" />
              </div>
              <div className="space-y-2">
                <Label>微博主页</Label>
                <Input {...register('socialMedia.weibo')} placeholder="https://weibo.com/..." />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input {...register('socialMedia.facebook')} placeholder="https://facebook.com/..." />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input {...register('socialMedia.instagram')} placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2">
                <Label>Twitter / X</Label>
                <Input {...register('socialMedia.twitter')} placeholder="https://twitter.com/..." />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input {...register('socialMedia.linkedin')} placeholder="https://linkedin.com/company/..." />
              </div>
              <div className="space-y-2">
                <Label>TikTok</Label>
                <Input {...register('socialMedia.tiktok')} placeholder="https://tiktok.com/..." />
              </div>
              <div className="space-y-2">
                <Label>YouTube</Label>
                <Input {...register('socialMedia.youtube')} placeholder="https://youtube.com/..." />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input {...register('socialMedia.whatsapp')} placeholder="https://whatsapp.com/..." />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
