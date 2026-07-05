// Footer 组件管理编辑器

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, GripVertical, AlertTriangle, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BilingualInput from '../../Input/BilingualInput';
import EditableLinkCard from '../../Input/custom/EditableLinkCard';
import { useFooterEditor } from '@/core-adminApp/items/site';
import type { FooterLink } from '@/cms/types';
import FooterPreview from './footerPreview';


export default function FooterEditor() {
  const [previewLang, setPreviewLang] = useState<'zh' | 'en'>('zh');
  const {
    hasDeletedPages,
    isSaving,
    localFooter,
    saved,
    addLinkGroup,
    addLinkToGroup,
    handleSave,
    isLinkInvalid,
    removeLinkFromGroup,
    removeLinkGroup,
    updateLinkData,
    updateLinkGroup,
    updateLinkName,
    updateNewsletterButton,
    updateNewsletterPlaceholder,
  } = useFooterEditor();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Footer 页脚管理</h1>
          <p className="text-gray-500 mt-1">编辑页脚链接分组和订阅设置</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
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

      {/* Footer 预览 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">组件预览</span>
          <div className="flex gap-1">
            <Button
              variant={previewLang === 'zh' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewLang('zh')}
            >
              中文
            </Button>
            <Button
              variant={previewLang === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewLang('en')}
            >
              English
            </Button>
          </div>
        </div>
        <FooterPreview footer={localFooter} language={previewLang} />
      </div>

      {/* 页面删除警告 */}
      {hasDeletedPages && (
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded-lg">
          <AlertTriangle className="w-5 h-5" />
          <span>部分链接指向的页面已被删除，请更新相关链接。</span>
        </div>
      )}

      {/* 提示信息 */}
      <div className="p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2 text-sm">
        <span className="w-2 h-2 bg-blue-500 rounded-full" />
        公司名称、联系方式、社交媒体链接由「公司信息管理」统一配置。
      </div>

      {/* Newsletter */}
      <Card>
        <CardHeader>
          <CardTitle>邮件订阅</CardTitle>
          <CardDescription>配置订阅框的文案</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BilingualInput
            label="输入框占位文字"
            value={localFooter.newsletterPlaceholder}
            onChange={updateNewsletterPlaceholder}
            placeholder={{ zh: '输入邮箱订阅', en: 'Enter email to subscribe' }}
          />

          <BilingualInput
            label="订阅按钮文字"
            value={localFooter.newsletterButton}
            onChange={updateNewsletterButton}
            placeholder={{ zh: '订阅', en: 'Subscribe' }}
          />
        </CardContent>
      </Card>

      {/* Link Groups */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">链接分组</h3>
          <Button variant="outline" size="sm" onClick={addLinkGroup}>
            <Plus className="w-4 h-4 mr-1" />
            添加分组
          </Button>
        </div>

        {localFooter.linkGroups.map((group, groupIndex) => {
          const groupHasDeletedLinks = group.links.some(isLinkInvalid);

          return (
            <Card
              key={groupIndex}
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
                    onClick={() => removeLinkGroup(groupIndex)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Group Title */}
                <BilingualInput
                  label="分组标题"
                  colRow="row"
                  value={group.title}
                  onChange={(value) => updateLinkGroup(groupIndex, 'title', value)}
                  placeholder={{ zh: '分组标题', en: 'Group Title' }}
                />

                {/* Links */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">链接列表</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addLinkToGroup(groupIndex)}
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
                        <EditableLinkCard<FooterLink>
                          key={link.id || linkIndex}
                          isInvalid={isLinkInvalid(link)}
                          link={link}
                          onLinkChange={(value) => updateLinkData(groupIndex, linkIndex, value)}
                          onNameChange={(value) => updateLinkName(groupIndex, linkIndex, value)}
                          onRemove={() => removeLinkFromGroup(groupIndex, linkIndex)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {localFooter.linkGroups.length === 0 && (
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
