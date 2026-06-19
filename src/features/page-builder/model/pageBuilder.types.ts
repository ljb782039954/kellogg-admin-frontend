import type {
  BlockType,
  ComponentCategory,
  PageBlock,
  Translation,
} from '@/types';

export type PageBuilderPanel =
  | { type: 'page-settings' }
  | { type: 'seo-settings' }
  | { type: 'block'; blockId: string };

export interface PageSeo {
  title: Translation;
  description: Translation;
  keywords: Translation;
  targetCountry: string;
}

export interface PageBuilderDraft {
  id: string;
  path: string;
  title: Translation;
  isFixed: boolean;
  type?: string;
  content?: unknown;
  blocks: PageBlock[];
  seo: PageSeo;
}

export type PageBuilderSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface PageBuilderState {
  draft: PageBuilderDraft;
  baseline: PageBuilderDraft;
  selectedPanel: PageBuilderPanel | null;
  saveStatus: PageBuilderSaveStatus;
  error: string | null;
}

export interface AvailableBlock {
  type: BlockType;
  name: Translation;
  description: Translation;
  category: ComponentCategory;
  icon: string;
  singleton: boolean;
  hasGlobalData: boolean;
  canAdd: boolean;
  disabledReason?: 'singleton-exists';
}

export interface PageMetaChanges {
  title?: Translation;
  path?: string;
}

export interface PageBuilderViewModel {
  page: PageBuilderDraft;
  selectedPanel: PageBuilderPanel | null;
  selectedBlock?: PageBlock;
  availableBlocks: AvailableBlock[];
  isFixedLayout: boolean;
  isDirty: boolean;
  canSave: boolean;
  isSaving: boolean;
  saveStatus: PageBuilderSaveStatus;
  error: string | null;
}

export interface PageBuilderActions {
  selectPanel(panel: PageBuilderPanel | null): void;
  addBlock(type: BlockType): void;
  removeBlock(blockId: string): void;
  moveBlock(blockId: string, targetIndex: number): void;
  toggleBlock(blockId: string): void;
  updateBlock(blockId: string, content: unknown): void;
  updateMeta(changes: PageMetaChanges): void;
  updateSeo(seo: PageSeo): void;
  save(): Promise<void>;
  requestExit(onConfirmed: () => void): void;
}

export type CommandResult<T> =
  | { ok: true; value: T; changed: boolean }
  | { ok: false; error: PageBuilderCommandError };

export type PageBuilderCommandError =
  | 'UNKNOWN_BLOCK_TYPE'
  | 'BLOCK_NOT_FOUND'
  | 'DUPLICATE_SINGLETON'
  | 'INVALID_TARGET_INDEX';
