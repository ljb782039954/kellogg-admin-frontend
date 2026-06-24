import { BilingualTextareaControl } from '@/shared/forms/controls/BilingualTextareaControl';
import type { Translation } from '@/shared/i18n/translation';

interface BilingualTextareaProps {
  label?: string;
  value: Translation;
  onChange: (value: Translation) => void;
  placeholder?: { zh?: string; en?: string };
  disabled?: boolean;
  rows?: number;
}

export function BilingualTextarea({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  rows,
}: BilingualTextareaProps) {
  return (
    <BilingualTextareaControl
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
    />
  );
}
