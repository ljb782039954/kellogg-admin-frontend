import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useContent } from '@/core-adminApp/context/ContentContext';
import {
  collectHreflangAlternatesFromPages,
  createEmptyAlternate,
  createPageLinkOptions,
  getEnabledHreflangAlternates,
  getHreflangDescription,
  hasDuplicateHref,
  hasDuplicateHreflang,
  HREFLANG_OPTIONS,
  removeAlternate,
  updateAlternate,
} from '@/core-adminApp/items/hreflang/hreflangUtils';
import type { SeoAlternate } from '@/cms/types';
import { Globe2, Plus, Save, Trash2 } from 'lucide-react';

export function HreflangManager() {
  const { content, syncHreflangAlternates } = useContent();
  const [alternates, setAlternates] = useState<SeoAlternate[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const pageOptions = useMemo(() => createPageLinkOptions(content.pages), [content.pages]);
  const enabledAlternates = useMemo(() => getEnabledHreflangAlternates(alternates), [alternates]);

  useEffect(() => {
    if (isDirty) return;
    setAlternates(collectHreflangAlternatesFromPages(content.pages));
  }, [content.pages, isDirty]);

  const updateAlternates = (nextAlternates: SeoAlternate[]) => {
    setAlternates(nextAlternates);
    setIsDirty(true);
  };

  const handleAdd = () => {
    updateAlternates([...alternates, createEmptyAlternate(content.pages)]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await syncHreflangAlternates(alternates);
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-blue-600" />
            hreflang 管理
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            管理同一组地区页面关系，并批量同步到所有启用页面的 JSON 数据中。
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving || !isDirty}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? '保存中...' : '保存同步'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">功能说明</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 leading-relaxed">
          hreflang 是给搜索引擎看的页面关系配置。启用的页面会被视为同一组地区替代页面，保存时系统会把完整的 hreflang 列表写入这些页面；从列表中移除或停用的页面，会从页面 JSON 中删除 hreflang 数据。
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">页面地区映射</CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              已启用 {enabledAlternates.length} 个地区链接。每一行左侧选择页面，右侧选择对应的 hreflang。
            </p>
          </div>
          <Button size="sm" onClick={handleAdd} disabled={pageOptions.length === 0}>
            <Plus className="w-4 h-4 mr-1" />
            添加链接
          </Button>
        </CardHeader>
        <CardContent>
          {pageOptions.length === 0 ? (
            <div className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-gray-500">
              暂无可选择的页面。
            </div>
          ) : alternates.length === 0 ? (
            <div className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-gray-500">
              暂未配置 hreflang。点击「添加链接」开始创建一组地区页面关系。
            </div>
          ) : (
            <div className="space-y-3">
              {alternates.map((alternate, index) => {
                const duplicateHref = hasDuplicateHref(alternates, alternate);
                const duplicateHreflang = hasDuplicateHreflang(alternates, alternate);

                return (
                  <div key={`${alternate.href}-${alternate.hreflang}-${index}`} className="rounded-lg border bg-white p-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px_auto_auto] lg:items-start">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">页面链接</Label>
                        <Select
                          value={alternate.href || pageOptions[0]?.href}
                          onValueChange={(href) => updateAlternates(updateAlternate(alternates, index, { href }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="选择页面" />
                          </SelectTrigger>
                          <SelectContent>
                            {pageOptions.map((page) => (
                              <SelectItem key={page.href} value={page.href}>
                                {page.label} · {page.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {duplicateHref && (
                          <p className="text-[10px] text-amber-600">存在重复页面链接，请确认是否需要保留。</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">hreflang</Label>
                        <Select
                          value={alternate.hreflang || 'x-default'}
                          onValueChange={(hreflang) => updateAlternates(updateAlternate(alternates, index, { hreflang }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="选择地区" />
                          </SelectTrigger>
                          <SelectContent>
                            {HREFLANG_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.value} · {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-[10px] leading-relaxed text-gray-400">
                          {getHreflangDescription(alternate.hreflang)}
                        </p>
                        {duplicateHreflang && (
                          <p className="text-[10px] text-red-500">存在重复 hreflang，请确认是否需要保留。</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1 lg:pt-7">
                        <Switch
                          checked={alternate.enabled !== false}
                          onCheckedChange={(enabled) => updateAlternates(updateAlternate(alternates, index, { enabled }))}
                        />
                        <Badge variant={alternate.enabled === false ? 'outline' : 'secondary'}>
                          {alternate.enabled === false ? '停用' : '启用'}
                        </Badge>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 lg:mt-6"
                        onClick={() => updateAlternates(removeAlternate(alternates, index))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default HreflangManager;
