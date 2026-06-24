import type { ComponentType } from 'react';

export interface BlockPropertyEditorProps<T = unknown> {
  value: T;
  onChange(value: T): void;
  disabled?: boolean;
  errors?: Record<string, string>;
}

export type PropertyEditorComponent =
  ComponentType<BlockPropertyEditorProps<unknown>>;
