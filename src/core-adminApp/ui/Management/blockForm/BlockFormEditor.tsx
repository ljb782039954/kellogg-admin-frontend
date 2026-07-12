import type { Translation } from '@/cms/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import BilingualInput from '@/core-adminApp/ui/Input/BilingualInput';
import ImageInput from '@/core-adminApp/ui/Input/ImageInput';
import BilingualRichInput from '@/core-adminApp/ui/Input/RichInput/BilingualRichInput';
import { Plus, Trash2 } from 'lucide-react';

export type EditorFieldType =
  | 'text'
  | 'textarea'
  | 'translation'
  | 'richText'
  | 'number'
  | 'switch'
  | 'select'
  | 'image'
  | 'color'
  | 'repeater';

export interface EditorOption {
  label: string;
  value: string | number;
}

export interface EditorFieldSchema {
  key: string;
  label: string;
  type: EditorFieldType;
  description?: string;
  placeholder?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  options?: readonly EditorOption[];
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  acceptType?: string;
  maxWidth?: number;
  fields?: EditorSchema;
  defaultItem?: EditableRecord;
  minItems?: number;
  maxItems?: number;
}

export type EditorSchema = readonly EditorFieldSchema[];
type EditableRecord = Record<string, unknown>;

type StringKey<T> = Extract<keyof T, string>;
type KeysMatching<T, Value> = {
  [K in StringKey<T>]-?: NonNullable<T[K]> extends Value ? K : never;
}[StringKey<T>];
type ArrayKeys<T> = KeysMatching<T, readonly object[]>;
type ArrayItem<T> = T extends readonly (infer Item extends object)[] ? Item : never;
type FieldBase = Omit<EditorFieldSchema, 'key' | 'type' | 'options' | 'fields' | 'defaultItem'>;

type TextField<T> = FieldBase & {
  key: KeysMatching<T, string>;
  type: 'text' | 'textarea' | 'image' | 'color';
};

type TranslationField<T> = FieldBase & {
  key: KeysMatching<T, Translation>;
  type: 'translation' | 'richText';
};

type NumberField<T> = FieldBase & {
  key: KeysMatching<T, number>;
  type: 'number';
};

type SwitchField<T> = FieldBase & {
  key: KeysMatching<T, boolean>;
  type: 'switch';
};

type SelectField<T> = {
  [K in KeysMatching<T, string | number>]: FieldBase & {
    key: K;
    type: 'select';
    options?: readonly {
      label: string;
      value: Extract<NonNullable<T[K]>, string | number>;
    }[];
  };
}[KeysMatching<T, string | number>];

type RepeaterFieldSchema<T> = {
  [K in ArrayKeys<T>]: FieldBase & {
    key: K;
    type: 'repeater';
    fields?: TypedEditorSchema<ArrayItem<T[K]>>;
    defaultItem?: Partial<ArrayItem<T[K]>>;
  };
}[ArrayKeys<T>];

export type TypedEditorField<T extends object> =
  | TextField<T>
  | TranslationField<T>
  | NumberField<T>
  | SwitchField<T>
  | SelectField<T>
  | RepeaterFieldSchema<T>;

export type TypedEditorSchema<T extends object> = readonly TypedEditorField<T>[];

export function defineEditorSchema<T extends object>() {
  return <const S extends TypedEditorSchema<T>>(schema: S) => schema;
}

interface BlockFormEditorProps {
  content: EditableRecord;
  schema: EditorSchema;
  onUpdate: (content: EditableRecord) => void;
}

function emptyTranslation(): Translation {
  return { zh: '', en: '' };
}

function toTranslation(value: unknown): Translation {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Translation;
  }

  return emptyTranslation();
}

function toStringValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function toNumberValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function toRecord(value: unknown): EditableRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as EditableRecord
    : {};
}

function toRecordArray(value: unknown): EditableRecord[] {
  return Array.isArray(value)
    ? value.map(toRecord)
    : [];
}

function FieldDescription({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="text-xs leading-relaxed text-gray-500">{children}</p>;
}

function BlockField({
  field,
  value,
  onChange,
}: {
  field: EditorFieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (field.type) {
    case 'translation':
      return (
        <BilingualInput
          value={toTranslation(value)}
          onChange={onChange}
          placeholder={{ zh: `${field.label} 中文`, en: `${field.label} English` }}
        />
      );

    case 'richText':
      return (
        <BilingualRichInput
          value={toTranslation(value)}
          onChange={onChange}
          placeholder={{ zh: `${field.label} 中文富文本`, en: `${field.label} English rich text` }}
          rows={field.rows ?? 4}
        />
      );

    case 'image':
      return (
        <ImageInput
          value={toStringValue(value)}
          onChange={onChange}
          aspectRatio={field.aspectRatio ?? 'auto'}
          acceptType={field.acceptType}
          maxWidth={field.maxWidth}
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          value={toNumberValue(value)}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      );

    case 'switch':
      return (
        <Switch
          checked={Boolean(value)}
          onCheckedChange={onChange}
        />
      );

    case 'select':
      {
        const selectedValue = field.options?.find(
          (option) => String(option.value) === String(value),
        )?.value ?? field.options?.[0]?.value;

      return (
        <Select
          value={selectedValue === undefined ? undefined : String(selectedValue)}
          onValueChange={(nextValue) => {
            const option = field.options?.find(
              (item) => String(item.value) === nextValue,
            );
            onChange(option?.value ?? nextValue);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      }

    case 'color':
      return (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={toStringValue(value) || '#000000'}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 w-12 rounded border bg-white"
          />
          <Input
            value={toStringValue(value)}
            onChange={(event) => onChange(event.target.value)}
            placeholder="#000000"
          />
        </div>
      );

    case 'textarea':
      return (
        <Textarea
          value={toStringValue(value)}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          rows={field.rows ?? 4}
        />
      );

    case 'repeater':
      return (
        <RepeaterField
          field={field}
          value={value}
          onChange={onChange}
        />
      );

    case 'text':
    default:
      return (
        <Input
          value={toStringValue(value)}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
        />
      );
  }
}

function RepeaterField({
  field,
  value,
  onChange,
}: {
  field: EditorFieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const items = toRecordArray(value);

  const updateItem = (index: number, key: string, nextValue: unknown) => {
    onChange(items.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [key]: nextValue } : item
    )));
  };

  const addItem = () => {
    if (field.maxItems !== undefined && items.length >= field.maxItems) return;
    onChange([...items, { ...(field.defaultItem ?? {}) }]);
  };

  const removeItem = (index: number) => {
    if (field.minItems !== undefined && items.length <= field.minItems) return;
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const canAddItem = field.maxItems === undefined || items.length < field.maxItems;
  const canRemoveItem = field.minItems === undefined || items.length > field.minItems;

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
          暂无项目
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="rounded-xl border bg-gray-50/60 p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {field.label} {index + 1}
                </span>
                {canRemoveItem && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    删除
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {(field.fields ?? []).map((childField) => (
                  <FormField
                    key={childField.key}
                    field={childField}
                    value={item[childField.key]}
                    onChange={(nextValue) => updateItem(index, childField.key, nextValue)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {canAddItem && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
        >
          <Plus className="mr-1 h-4 w-4" />
          添加{field.label}
        </Button>
      )}
    </div>
  );
}

function FormField({
  field,
  value,
  onChange,
}: {
  field: EditorFieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{field.label}</Label>
      <BlockField
        field={field}
        value={value}
        onChange={onChange}
      />
      <FieldDescription>{field.description}</FieldDescription>
    </div>
  );
}

export function BlockFormEditor({ content, schema, onUpdate }: BlockFormEditorProps) {
  const handleChange = (key: string, value: unknown) => {
    onUpdate({ ...content, [key]: value });
  };

  if (schema.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
        当前积木块没有可编辑的局部属性。
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {schema.map((field) => (
        <div key={field.key} className="rounded-xl border bg-white p-4">
          <FormField
            field={field}
            value={content[field.key]}
            onChange={(value) => handleChange(field.key, value)}
          />
        </div>
      ))}
    </div>
  );
}
