import type { Translation } from '@/types';

interface BilingualTextareaControlProps {
  label?: string;
  value: Translation;
  onChange: (value: Translation) => void;
  placeholder?: { zh?: string; en?: string };
  disabled?: boolean;
  rows?: number;
}

export function BilingualTextareaControl({
  label,
  value,
  onChange,
  placeholder = {},
  disabled = false,
  rows = 3,
}: BilingualTextareaControlProps) {
  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <span className="absolute left-3 top-3 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            中文
          </span>
          <textarea
            value={value.zh || ''}
            onChange={(event) => onChange({ ...value, zh: event.target.value })}
            placeholder={placeholder.zh}
            disabled={disabled}
            rows={rows}
            className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all disabled:bg-gray-50"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-3 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            EN
          </span>
          <textarea
            value={value.en || ''}
            onChange={(event) => onChange({ ...value, en: event.target.value })}
            placeholder={placeholder.en}
            disabled={disabled}
            rows={rows}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all disabled:bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}
