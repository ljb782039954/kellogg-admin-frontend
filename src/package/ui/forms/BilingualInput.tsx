import { BilingualTextControl } from '@/shared/forms/controls/BilingualTextControl';
import type { Translation } from '@/types';

interface BilingualInputProps {
  label?: string;
  value: Translation;
  onChange: (value: Translation) => void;
  placeholder?: { zh?: string; en?: string };
  colRow?: 'col' | 'row';
  disabled?: boolean;
}

export function BilingualInput({
  label,
  value,
  onChange,
  placeholder,
  colRow = 'col',
  disabled,
}: BilingualInputProps) {
  return (
    <BilingualTextControl
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      layout={colRow}
      disabled={disabled}
    />
  );
}

export default BilingualInput;
