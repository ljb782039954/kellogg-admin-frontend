import type { Translation } from '@/cms/types';

interface BilingualInputProps {
  label?: string;
  value: Translation;
  onChange: (value: Translation) => void;
  placeholder?: { zh?: string; en?: string };
  // col / row
  colRow?:'col' | 'row';
}

export default function BilingualInput({
  label,
  value,
  onChange,
  placeholder = {},
  colRow = 'col'
}: BilingualInputProps) {
  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className={`flex ${colRow === 'col' ? 'flex-col' : 'flex-row'} gap-3`}>
        {/* Chinese Input */}
        <div className="relative">
          <span className="absolute left-3 top-3 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            中文
          </span>
          <input
            type="text"
            value={value.zh || ''}
            onChange={(e) => onChange({ ...value, zh: e.target.value })}
            placeholder={placeholder.zh}
            className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          />
        </div>
        {/* English Input */}
        <div className="relative">
          <span className="absolute left-3 top-3 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            EN
          </span>
          <input
            type="text"
            value={value.en || ''}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            placeholder={placeholder.en}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );
}

