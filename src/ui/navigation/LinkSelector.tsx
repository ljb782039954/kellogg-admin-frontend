import { useMemo } from 'react';
import { AlertTriangle, ExternalLink, FileText } from 'lucide-react';
import { Input } from '@/ui/primitives/input';
import { Label } from '@/ui/primitives/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/primitives/select';
import type { NavLink, Translation } from '@/types';

export interface PageOption {
  pageId: string;
  path: string;
  title: Translation;
  isFixed: boolean;
}

interface LinkSelectorProps {
  value: NavLink;
  pages: PageOption[];
  disabled?: boolean;
  onChange: (value: NavLink) => void;
}

export function LinkSelector({ value, pages, disabled, onChange }: LinkSelectorProps) {
  const selectedPageExists = useMemo(() => {
    if (value.linkType !== 'internal' || !value.href) return true;
    return pages.some((p) => p.path === value.href || p.pageId === value.href);
  }, [value, pages]);

  return (
    <div className="space-y-2">
      <Label>链接类型</Label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...value, linkType: 'internal', href: '' })}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border-2 transition-all ${
            value.linkType === 'internal'
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          内部页面
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...value, linkType: 'external', href: '' })}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border-2 transition-all ${
          value.linkType === 'external'
            ? 'border-gray-900 bg-gray-900 text-white'
            : 'border-gray-200 text-gray-500 hover:border-gray-300'
        }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          外部链接
        </button>
      </div>

      {value.linkType === 'internal' ? (
        <div className="space-y-2">
          <Label>选择页面</Label>
          <Select
            value={value.href}
            onValueChange={(href) => {
              const page = pages.find((p) => p.path === href);
              onChange({ ...value, href, pageDeleted: page ? false : undefined });
            }}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择内部页面..." />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.pageId} value={page.path}>
                  {page.title.zh || page.title.en} ({page.path})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {value.href && !selectedPageExists && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-1.5 rounded border border-red-100">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>链接目标页面已被删除</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label>外部 URL</Label>
          <Input
            type="url"
            value={value.href || ''}
            onChange={(e) => onChange({ ...value, href: e.target.value, linkType: 'external' })}
            placeholder="https://example.com"
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
