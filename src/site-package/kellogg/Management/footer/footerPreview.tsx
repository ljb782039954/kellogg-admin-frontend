
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import type { FooterContent } from '@/core-adminApp/types';
import siteSettings from '../../metadata/siteSettings.json';

// Footer 预览组件

export default function FooterPreview({ footer, language }: { footer: FooterContent; language: 'zh' | 'en' }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          预览效果
          <Badge variant="outline" className="ml-2">{language === 'zh' ? '中文' : 'English'}</Badge>
        </CardTitle>
        <CardDescription>在浏览器中的实际显示效果（缩略版）</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* 模拟 Footer */}
        <div className="bg-gray-900 text-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* 品牌 & 订阅 */}
            <div>
              <h3 className="text-lg font-bold mb-2">
                {siteSettings.brand.name[language]}
              </h3>
              <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                {siteSettings.brand.description[language]}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={footer.newsletterPlaceholder[language]}
                  className="flex-1 px-2 py-1.5 text-xs rounded bg-gray-800 border border-gray-700 text-white"
                  readOnly
                />
                <button className="px-3 py-1.5 text-xs rounded bg-white text-gray-900 font-medium">
                  {footer.newsletterButton[language]}
                </button>
              </div>
            </div>

            {/* 链接分组 */}
            {footer.linkGroups.slice(0, 2).map((group, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-2 text-sm">{group.title[language]}</h4>
                <ul className="space-y-1">
                  {group.links.slice(0, 4).map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <span className={`text-xs ${link.pageDeleted ? 'text-red-400 line-through' : 'text-gray-400'}`}>
                        {link.name[language]}
                      </span>
                    </li>
                  ))}
                  {group.links.length > 4 && (
                    <li className="text-xs text-gray-500">+{group.links.length - 4} 更多...</li>
                  )}
                </ul>
              </div>
            ))}

            {/* 联系信息 */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">
                {language === 'zh' ? '联系我们' : 'Contact Us'}
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  <span>{siteSettings.contact.phone}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  <span>{siteSettings.contact.email}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 mt-0.5" />
                  <span className="line-clamp-2">{siteSettings.contact.address[language]}</span>
                </li>
              </ul>
              {/* 社交媒体 */}
              <div className="flex gap-2 mt-3">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center">
                    <Icon className="w-3 h-3 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 版权 */}
          <div className="border-t border-gray-800 pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
            <span>© 2024 {siteSettings.brand.name[language]}. {language === 'zh' ? '保留所有权利。' : 'All rights reserved.'}</span>
            <div className="flex gap-4 mt-2 md:mt-0">
              <span>{language === 'zh' ? '隐私政策' : 'Privacy Policy'}</span>
              <span>{language === 'zh' ? '服务条款' : 'Terms of Service'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
