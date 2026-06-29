// 链接选择组件 - 支持内部页面链接和外部链接
import { useEffect, useMemo } from 'react';
import { AlertTriangle, ExternalLink, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { LinkType, NavLink, Translation, } from '@/core/types';
import { useContent } from '@/core/context/ContentContext';

// 页面选项
interface PageOption {
  pageId: string;
  path: string;
  title: Translation;
  isFixed: boolean;
}

interface LinkSelectorProps {
  value: NavLink;
  onChange: (value: NavLink) => void;
}

export default function LinkSelector({ value, onChange }: LinkSelectorProps) {
  const { content } = useContent();
  // 加载页面列表 (派生状态)
  const pages = useMemo<PageOption[]>(() => {
    return content.pages.map(p => ({
      pageId: p.id,
      path: p.path,
      title: p.title,
      isFixed: p.isFixed,
    }));
  }, [content.pages]);

  // 检查当前链接的页面是否已被删除 (派生状态)
  const isPageDeleted = useMemo(() => {
    if (value.linkType === 'internal' && value.href) {
      const exists = pages.some(p => p.pageId === value.href || p.path === value.href);
      return !exists;
    }
    return false;
  }, [value.href, value.linkType, pages]);

  // 这里的 useEffect 仅用于通知父组件数据模型状态变化，不再同步调用本地 setState
  useEffect(() => {
    if (isPageDeleted && !value.pageDeleted) {
      onChange({ ...value, pageDeleted: true });
    }
  }, [isPageDeleted, value.pageDeleted]);

  // 更新链接类型
  const handleTypeChange = (type: LinkType) => {
    onChange({
      ...value,
      linkType: type,
      href: '',
      pageDeleted: false,
    });
  };

  // 更新内部链接
  const handlePageChange = (pageId: string) => {
    const page = pages.find((p) => p.pageId === pageId);
    onChange({
      ...value,
      href: page?.path || pageId,
      pageDeleted: false,
    });
  };

  // 更新外部链接
  const handleUrlChange = (url: string) => {
    onChange({
      ...value,
      href: url,
      pageDeleted: false,
    });
  };

  return (
    <div className="space-y-3">
      {/* 链接类型选择 */}
      <div className="space-y-2">
        <Label className="text-sm">链接类型 (Type)</Label>
        <Select value={value.linkType} onValueChange={(v) => handleTypeChange(v as LinkType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="internal">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                内部页面 (Page)
              </div>
            </SelectItem>
            <SelectItem value="external">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                外部链接 (URL)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 链接内容 */}
      {value.linkType === 'internal' ? (
        <div className="space-y-2">
          <Label className="text-sm">选择内部页面 (Destination)</Label>
          <Select
            value={pages.find((p) => p.path === value.href)?.pageId || value.href || ''}
            onValueChange={handlePageChange}
          >
            <SelectTrigger className={isPageDeleted ? 'border-red-500' : ''}>
              <SelectValue placeholder="选择一个页面" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.pageId} value={page.pageId}>
                  <div className="flex items-center gap-2">
                    <span>{page.title.zh}</span>
                    <span className="text-gray-400 text-xs">{page.path}</span>
                    {page.isFixed && (
                      <Badge variant="secondary" className="text-xs py-0.5">系统</Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 页面已删除警告 */}
          {isPageDeleted && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
              <AlertTriangle className="w-4 h-4" />
              <span>注意：该页面链接可能已失效，请重新选择</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="text-sm">外部链接地址 (URL)</Label>
          <Input
            type="url"
            value={value.href}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://..."
          />
          <p className="text-xs text-gray-500">请输入完整的 URL，包括 https://</p>
        </div>
      )}
    </div>
  );
}
