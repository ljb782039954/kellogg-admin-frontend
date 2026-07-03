import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { NavLink, Translation } from '@/core-adminApp/types';
import BilingualInput from '../BilingualInput';
import LinkSelector from '../LinkSelector';

interface EditableLinkCardProps<TLink extends NavLink> {
  className?: string;
  isInvalid?: boolean;
  link: TLink;
  nameLabel?: string;
  namePlaceholder?: Translation;
  onLinkChange: (value: TLink) => void;
  onNameChange: (value: Translation) => void;
  onRemove: () => void;
}

export default function EditableLinkCard<TLink extends NavLink>({
  className,
  isInvalid,
  link,
  nameLabel = '链接名称',
  namePlaceholder = { zh: '链接中文名', en: 'Link English name' },
  onLinkChange,
  onNameChange,
  onRemove,
}: EditableLinkCardProps<TLink>) {
  return (
    <div
      className={className || `p-4 rounded-lg border ${
        isInvalid ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{nameLabel}</span>
            {link.pageDeleted && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                页面已删除
              </Badge>
            )}
          </div>

          <BilingualInput
            value={link.name}
            onChange={onNameChange}
            placeholder={namePlaceholder}
          />

          <div className="pt-2 border-t">
            <LinkSelector
              value={link}
              onChange={(value) => onLinkChange(value as TLink)}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
