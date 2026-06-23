import type { BlockType } from '@/package/types';

export function blockPreviewId(type: BlockType): string {
  return `block:${type}:preview`;
}

export function blockEditorId(type: BlockType): string {
  return `block:${type}:editor`;
}
