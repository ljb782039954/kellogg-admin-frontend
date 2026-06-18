import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, GripVertical, AlertTriangle, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BilingualInput from '@/admin/components/BilingualInput';
import LinkSelector from '@/admin/components/LinkSelector';
import siteSettings from '@/config/siteSettings.json';
import type { FooterContent, FooterLink, FooterLinkGroup, Translation } from '@/types';

interface FooterPreviewProps {
  footer: FooterContent;
  language: 'zh' | 'en';
}

export function FooterPreview({ footer, language }: FooterPreviewProps) {
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
        <div className="bg-gray-900 text-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-bold mb-2">{footer.brand.name[language]}</h3>
              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{siteSettings.brand.description[language]}</p>
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

            {footer.linkGroups.slice(0, 2).map((group, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-2 text-sm">{group.title[language]}</h4>
                <ul className="space-y-1">
                  {group.links.slice(0, 4).map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <span
                        className={`text-xs ${
                          link.pageDeleted ? 'text-red-400 line-through' : 'text-gray-400'
                        }`}
                      >
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

            <div>
              <h4 className="font-semibold mb-2 text-sm">{language === 'zh' ? '联系我们' : 'Contact Us'}</h4>
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
              <div className="flex gap-2 mt-3">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center"
                  >
                    <Icon className="w-3 h-3 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
            <span>
              © 2024 {siteSettings.brand.name[language]}.{' '}
              {language === 'zh' ? '保留所有权利。' : 'All rights reserved.'}
            </span>
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

interface FooterEditorProps {
  footer: FooterContent;
  saved: boolean;
  previewLang: 'zh' | 'en';
  hasDeletedPages: boolean;
  onSave: () => void;
  onPreviewLangChange: (lang: 'zh' | 'en') => void;
  onUpdateNewsletterPlaceholder: (value: Translation) => void;
  onUpdateNewsletterButton: (value: Translation) => void;
  onAddGroup: () => void;
  onRemoveGroup: (index: number) => void;
  onUpdateGroup: (index: number, group: FooterLinkGroup) => void;
  onAddLink: (groupIndex: number) => void;
  onRemoveLink: (groupIndex: number, linkIndex: number) => void;
  onUpdateLink: (groupIndex: number, linkIndex: number, link: FooterLink) => void;
}

export function FooterEditorView({
  footer,
  saved,
  previewLang,
  hasDeletedPages,
  onSave,
  onPreviewLangChange,
  onUpdateNewsletterPlaceholder,
  onUpdateNewsletterButton,
  onAddGroup,
  onRemoveGroup,
  onUpdateGroup,
  onAddLink,
  onRemoveLink,
  onUpdateLink,
}: FooterEditorProps) {
  const updateGroupTitle = useCallback(
    (groupIndex: number, title: Translation) => {
      const next = [...footer.linkGroups];
      next[groupIndex] = { ...next[groupIndex], title };
      onUpdateGroup(groupIndex, next[groupIndex]);
    },
    [footer.linkGroups, onUpdateGroup],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Footer 页脚管理</h1>
          <p className="text-gray-500 mt-1">编辑页脚链接分组和订阅设置</p>
        </div>
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">组件预览</span>
          <div className="flex gap-1">
            <Button
              variant={previewLang === 'zh' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPreviewLangChange('zh')}
            >
              中文
            </Button>
            <Button
              variant={previewLang === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPreviewLangChange('en')}
            >
              English
            </Button>
          </div>
        </div>
        <FooterPreview footer={footer} language={previewLang} />
      </div>

      {hasDeletedPages && (
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded-lg">
          <AlertTriangle className="w-5 h-5" />
          <span>部分链接指向的页面已被删除，请更新相关链接。</span>
        </div>
      )}

      <div className="p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2 text-sm">
        <span className="w-2 h-2 bg-blue-500 rounded-full" />
        公司名称、联系方式、社交媒体链接由「公司信息管理」统一配置。
      </div>

      <Card>
        <CardHeader>
          <CardTitle>邮件订阅</CardTitle>
          <CardDescription>配置订阅框的文案</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BilingualInput
            label="输入框占位文字"
            value={footer.newsletterPlaceholder}
            onChange={onUpdateNewsletterPlaceholder}
            placeholder={{ zh: '输入邮箱订阅', en: 'Enter email to subscribe' }}
          />

          <BilingualInput
            label="订阅按钮文字"
            value={footer.newsletterButton}
            onChange={onUpdateNewsletterButton}
            placeholder={{ zh: '订阅', en: 'Subscribe' }}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">链接分组</h3>
          <Button variant="outline" size="sm" onClick={onAddGroup}>
            <Plus className="w-4 h-4 mr-1" />
            添加分组
          </Button>
        </div>

        {footer.linkGroups.map((group, groupIndex) => {
          const groupHasDeletedLinks = group.links.some((link) => link.pageDeleted);

          return (
            <Card
              key={group.id || groupIndex}
              className={groupHasDeletedLinks ? 'border-amber-300' : ''}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    <CardTitle className="text-base">分组 {groupIndex + 1}</CardTitle>
                    {groupHasDeletedLinks && (
                      <Badge variant="outline" className="text-amber-600 border-amber-300">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        有失效链接
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveGroup(groupIndex)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <BilingualInput
                  colRow="row"
                  value={group.title}
                  onChange={(value) => updateGroupTitle(groupIndex, value)}
                  placeholder={{ zh: '分组标题', en: 'Group Title' }}
                  label="分组标题"
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">链接列表</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddLink(groupIndex)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      添加链接
                    </Button>
                  </div>

                  {group.links.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm bg-gray-50 rounded-lg">
                      暂无链接，点击「添加链接」开始配置
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.links.map((link, linkIndex) => (
                        <div
                          key={link.id || linkIndex}
                          className={`p-4 rounded-lg border ${
                            link.pageDeleted
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">链接名称</span>
                                {link.pageDeleted && (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    页面已删除
                                  </Badge>
                                )}
                              </div>
                              <BilingualInput
                                value={link.name}
                                onChange={(value) => {
                                  const next = [...footer.linkGroups];
                                  next[groupIndex].links[linkIndex] = { ...link, name: value };
                                  onUpdateLink(groupIndex, linkIndex, next[groupIndex].links[linkIndex]);
                                }}
                                placeholder={{ zh: '链接中文名', en: 'Link English name' }}
                              />

                              <div className="pt-2 border-t">
                                <LinkSelector
                                  value={link}
                                  onChange={(value) => onUpdateLink(groupIndex, linkIndex, value as FooterLink)}
                                />
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveLink(groupIndex, linkIndex)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {footer.linkGroups.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-sm">暂无链接分组</p>
              <p className="text-xs mt-1">点击「添加分组」开始配置</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
