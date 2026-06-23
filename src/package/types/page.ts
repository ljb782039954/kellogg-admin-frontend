import type { Translation } from '@/shared/i18n/translation';

export type PageKind = 'fixed-block' | 'dynamic-block' | 'fixed-layout';

export interface PageIndexEntry {
  id: string;
  path: string;
  title: Translation;
  isFixed: boolean;
  type?: PageKind;
  content?: unknown;
  blockCount: number;
}
