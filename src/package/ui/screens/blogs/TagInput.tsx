import { useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [inputVal, setInputVal] = useState('');

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputVal('');
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-xl bg-gray-50/50 min-h-[44px]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg"
        >
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputVal);
          }
          if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
          }
        }}
        onBlur={() => inputVal && addTag(inputVal)}
        placeholder={tags.length === 0 ? '输入标签，回车确认...' : ''}
        className="flex-1 min-w-[80px] bg-transparent text-sm text-gray-700 focus:outline-none placeholder-gray-400"
      />
    </div>
  );
}
