import { useState } from 'react';
import type { Translation } from '@/core-adminApp/types';
import RichInput from './RichInput';
import BilingualRichInputModal from './BilingualRichInputModal';

interface BilingualRichInputProps {
  label?: string;
  value: Translation;
  onChange: (value: Translation) => void;
  placeholder?: { zh?: string; en?: string };
  rows?: number;
}

export default function BilingualRichInput({
  label,
  value,
  onChange,
  placeholder = {},
  rows = 4,
}: BilingualRichInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex flex-col gap-4">
        {/* 中文输入框 (开启放大按钮) */}
        <RichInput
          label="中文 (ZH)"
          value={value.zh || ''}
          onChange={(val) => onChange({ ...value, zh: val })}
          placeholder={placeholder.zh}
          rows={rows}
          showMaximize={true}
          onMaximize={() => setIsModalOpen(true)}
        />

        {/* 英文输入框 (开启放大按钮) */}
        <RichInput
          label="English (EN)"
          value={value.en || ''}
          onChange={(val) => onChange({ ...value, en: val })}
          placeholder={placeholder.en}
          rows={rows}
          showMaximize={true}
          onMaximize={() => setIsModalOpen(true)}
        />
      </div>

      {isModalOpen && (
        <BilingualRichInputModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
