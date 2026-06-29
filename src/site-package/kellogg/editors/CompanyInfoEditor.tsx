// 公司信息管理编辑器
import { motion } from 'framer-motion';
import { Save, Building2, Phone, Mail, MapPin, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BilingualInput from '../components/BilingualInput';
import BilingualInputAera from '../components/BilingualInputAera';
import ImageInput from '../components/ImageInput';
import { useCompanyInfoEditor } from '@/core/items/site';

export default function CompanyInfoEditor() {
  const {
    isSaving,
    localInfo,
    saved,
    handleSave,
    updateContact,
    updateInfo,
    updateSocialMedia,
  } = useCompanyInfoEditor();

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">公司信息管理</h1>
          <p className="text-gray-500 mt-1">管理公司基本信息、联系方式和社交媒体链接</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
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

      <div className="grid gap-6">
        {/* 基本信息 */}
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
              <BilingualInput
                value={localInfo.name}
                onChange={(value) => updateInfo('name', value)}
                placeholder={{ zh: '公司中文名称', en: 'Company English Name' }}
              />
            </div>

            <div className="space-y-2">
              <Label>公司 Logo</Label>
              <ImageInput
                value={localInfo.logo}
                onChange={(value) => updateInfo('logo', value)}
                label="上传 Logo"
                maxWidth={400}
              />
              <p className="text-xs text-gray-500">建议尺寸: 200x60 像素，支持 PNG、JPG、SVG 格式</p>
            </div>

            <div className="space-y-2">
              <Label>公司简介</Label>
              <BilingualInputAera
                value={localInfo.description}
                onChange={(value) => updateInfo('description', value)}
                placeholder={{ zh: '请输入公司简介', en: 'Enter company description' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* 联系方式 */}
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
                <Input
                  value={localInfo.contact.phone}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  placeholder="+86 138-0000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  电子邮箱
                </Label>
                <Input
                  type="email"
                  value={localInfo.contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                公司地址
              </Label>
              <BilingualInput
                value={localInfo.contact.address}
                onChange={(value) => updateContact('address', value)}
                placeholder={{ zh: '请输入公司地址', en: 'Enter company address' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* 社交媒体 */}
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
                <Input
                  value={localInfo.socialMedia.wechat || ''}
                  onChange={(e) => updateSocialMedia('wechat', e.target.value)}
                  placeholder="wechat_id"
                />
              </div>
              <div className="space-y-2">
                <Label>微博主页</Label>
                <Input
                  value={localInfo.socialMedia.weibo || ''}
                  onChange={(e) => updateSocialMedia('weibo', e.target.value)}
                  placeholder="https://weibo.com/..."
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input
                  value={localInfo.socialMedia.facebook || ''}
                  onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                  value={localInfo.socialMedia.instagram || ''}
                  onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Twitter / X</Label>
                <Input
                  value={localInfo.socialMedia.twitter || ''}
                  onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  value={localInfo.socialMedia.linkedin || ''}
                  onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              <div className="space-y-2">
                <Label>TikTok</Label>
                <Input
                  value={localInfo.socialMedia.tiktok || ''}
                  onChange={(e) => updateSocialMedia('tiktok', e.target.value)}
                  placeholder="https://tiktok.com/..."
                />
              </div>


              <div className="space-y-2">
                <Label>YouTube</Label>
                <Input
                  value={localInfo.socialMedia.youtube || ''}
                  onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>


              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input
                  value={localInfo.socialMedia.whatsapp || ''}
                  onChange={(e) => updateSocialMedia('whatsapp', e.target.value)}
                  placeholder="https://whatsapp.com/..."
                />
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
