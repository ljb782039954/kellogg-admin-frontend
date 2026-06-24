import { AlertTriangle, Trash2 } from 'lucide-react';
import BilingualInput from '@/package/ui/forms/BilingualInput';
import { LinkSelector, type PageOption } from '@/package/ui/forms/LinkSelector';
import { Badge } from '@/package/ui/primitives/badge';
import { Button } from '@/package/ui/primitives/button';
import { cn } from '@/shared/utils';
import type { NavLink } from '@/package/types';
import type { Translation } from '@/shared/i18n/translation';

type EditableLinkValue = Pick<NavLink, 'id' | 'name' | 'linkType' | 'href' | 'pageDeleted'>;

interface EditableLinkCardProps<TLink extends EditableLinkValue> {
  link: TLink;
  pages: PageOption[];
  title?: string;
  deletedLabel?: string;
  namePlaceholder: Translation;
  className?: string;
  onNameChange: (name: Translation) => void;
  onLinkChange: (link: TLink) => void;
  onRemove: () => void;
}

export function EditableLinkCard<TLink extends EditableLinkValue>({
  link,
  pages,
  title,
  deletedLabel = '页面已删除',
  namePlaceholder,
  className,
  onNameChange,
  onLinkChange,
  onRemove,
}: EditableLinkCardProps<TLink>) {
  return (
    <div
      className={cn(
        'rounded-lg border',
        link.pageDeleted ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className='flex-1 space-y-4'>
          {title && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{title}</span>
              {link.pageDeleted && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {deletedLabel}
                </Badge>
              )}
            </div>
          )}

          <BilingualInput
            value={link.name}
            onChange={onNameChange}
            placeholder={namePlaceholder}
          />

          <div className="pt-2 border-t">
            <LinkSelector
              value={link}
              pages={pages}
              onChange={(value) => onLinkChange(value as TLink)}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className={cn(
            'text-red-500 hover:text-red-700 hover:bg-red-50',
          )}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
